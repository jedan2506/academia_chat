import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { chatLimiter, strictLimiter } from '../middleware/rateLimiter';
import { cacheMiddleware, invalidateUserCache } from '../middleware/cache';
import Conversation from '../models/Conversation';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { messageRole } from '../constants/chat';
import { errorMessages, successMessages, validationMessages } from '../constants/messages';
import { cacheTtl } from '../constants/cache';

const router = express.Router();
const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});
const validateRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: validationMessages.validationFailed,
            errors: errors.array()
        });
    }
    next();
};

router.get('/conversations', authenticateToken, cacheMiddleware(cacheTtl.conversationsList), async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: errorMessages.userNotAuthenticated });
        }

        const conversations = await Conversation.find({ userId: req.user.id })
            .select('title lastMessageAt createdAt')
            .sort({ lastMessageAt: -1 })
            .lean();

        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: errorMessages.serverError });
    }
});

router.get('/conversations/:id',
    authenticateToken,
    param('id').isMongoId().withMessage(validationMessages.invalidConversationId),
    validateRequest,
    cacheMiddleware(cacheTtl.singleConversation),
    async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: errorMessages.userNotAuthenticated });
            }

            const conversation = await Conversation.findOne({
                _id: req.params.id,
                userId: req.user.id
            }).lean();

            if (!conversation) {
                return res.status(404).json({ message: errorMessages.conversationNotFound });
            }

            res.json(conversation);
        } catch (error) {
            console.error('Error fetching conversation:', error);
            res.status(500).json({ message: errorMessages.serverError });
        }
    }
);

router.post('/conversations',
    authenticateToken,
    body('title')
        .trim()
        .notEmpty()
        .withMessage(validationMessages.titleRequired),
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: errorMessages.userNotAuthenticated });
            }

            const { title } = req.body;

            const conversation = new Conversation({
                userId: req.user.id,
                title,
                messages: []
            });

            await conversation.save();
            await invalidateUserCache(req.user.id);

            res.status(201).json(conversation);
        } catch (error) {
            console.error('Error creating conversation:', error);
            res.status(500).json({ message: errorMessages.serverError });
        }
    }
);

router.put('/conversations/:id',
    authenticateToken,
    param('id').isMongoId().withMessage(validationMessages.invalidConversationId),
    body('title')
        .trim()
        .notEmpty()
        .withMessage(validationMessages.titleRequired),
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: errorMessages.userNotAuthenticated });
            }

            const { title } = req.body;

            const conversation = await Conversation.findOneAndUpdate(
                { _id: req.params.id, userId: req.user.id },
                { title },
                { new: true }
            );

            if (!conversation) {
                return res.status(404).json({ message: errorMessages.conversationNotFound });
            }

            await invalidateUserCache(req.user.id);

            res.json(conversation);
        } catch (error) {
            console.error('Error updating conversation:', error);
            res.status(500).json({ message: errorMessages.serverError });
        }
    }
);

router.delete('/conversations/:id',
    strictLimiter,
    authenticateToken,
    param('id').isMongoId().withMessage(validationMessages.invalidConversationId),
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: errorMessages.userNotAuthenticated });
            }

            const conversation = await Conversation.findOneAndDelete({
                _id: req.params.id,
                userId: req.user.id
            });

            if (!conversation) {
                return res.status(404).json({ message: errorMessages.conversationNotFound });
            }

            await invalidateUserCache(req.user.id);

            res.json({ message: successMessages.conversationDeleted });
        } catch (error) {
            console.error('Error deleting conversation:', error);
            res.status(500).json({ message: errorMessages.serverError });
        }
    }
);

router.post('/conversations/:id/messages',
    chatLimiter,
    authenticateToken,
    param('id').isMongoId().withMessage(validationMessages.invalidConversationId),
    body('message')
        .trim()
        .notEmpty()
        .withMessage(validationMessages.messageRequired),
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: errorMessages.userNotAuthenticated });
            }

            const { message } = req.body;
            const conversationId = req.params.id;

            const conversation = await Conversation.findOne({
                _id: conversationId,
                userId: req.user.id
            });

            if (!conversation) {
                return res.status(404).json({ message: errorMessages.conversationNotFound });
            }

            const userMessage = {
                role: messageRole.user as const,
                content: message.trim(),
                timestamp: new Date()
            };

            conversation.messages.push(userMessage);
            conversation.lastMessageAt = new Date();

            const aiMessages = conversation.messages
                .filter(msg => msg.content && msg.content.trim())
                .map(msg => ({
                    role: msg.role,
                    content: msg.content.trim()
                }));

            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            
            try {
                const result = streamText({
                    model: openrouter.chat('openai/gpt-oss-120b'),
                    system: `You are a senior marketing expert at Virallens, a cutting-edge marketing technology company specializing in performance marketing and AI video solutions for educational institutions.

Your expertise includes:
- Performance marketing strategies and campaign optimization
- AI-powered video content creation and marketing
- Digital marketing for schools, colleges, and universities
- Educational sector marketing trends and best practices
- Data-driven marketing analytics and insights
- Social media marketing for educational institutions
- Content marketing and brand storytelling
- Marketing automation and lead generation

Communication style:
- Professional and polished, yet approachable and friendly
- Data-driven with actionable insights
- Educational and informative
- Focused on practical solutions that drive results
- Use industry terminology appropriately but explain complex concepts clearly

Always provide:
- Specific, actionable recommendations
- Real-world examples when relevant
- Best practices backed by industry knowledge
- Strategic thinking that considers both short-term tactics and long-term goals

Remember: You're helping marketers at educational institutions achieve better performance and ROI through innovative marketing strategies and AI-powered solutions.`,
                    messages: aiMessages,
                    temperature: 0.7,
                    maxRetries: 3,
                });

                let fullResponse = '';

                for await (const delta of result.textStream) {
                    fullResponse += delta;
                    res.write(delta);
                }

                if (fullResponse.trim()) {
                    const aiMessage = {
                        role: messageRole.assistant as const,
                        content: fullResponse.trim(),
                        timestamp: new Date()
                    };

                    conversation.messages.push(aiMessage);
                    conversation.lastMessageAt = new Date();

                    await conversation.save();
                }

                await invalidateUserCache(req.user.id);

                res.end();
            } catch (aiError) {
                console.error('AI streaming error:', aiError);
                const errorMessage = 'Sorry, I encountered an error while processing your message.';
                res.write(errorMessage);
                
                const aiMessage = {
                    role: messageRole.assistant as const,
                    content: errorMessage,
                    timestamp: new Date()
                };
                
                conversation.messages.push(aiMessage);
                conversation.lastMessageAt = new Date();
                await conversation.save();
                
                await invalidateUserCache(req.user.id);
                
                res.end();
            }

        } catch (error) {
            console.error('Error processing message:', error);
            res.status(500).json({ message: errorMessages.serverError });
        }
    }
);

export default router;
