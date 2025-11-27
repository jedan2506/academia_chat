import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { authenticateToken } from '../middleware/auth';
import { authLimiter, createAccountLimiter } from '../middleware/rateLimiter';
import { defaultTheme, themeValues } from '../constants/theme';
import { errorMessages, successMessages, validationMessages } from '../constants/messages';

const router = Router();

const signupValidation = [
    body('name')
        .trim(),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

const signinValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

router.post('/signup', createAccountLimiter, signupValidation, async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: errorMessages.validationFailed,
                errors: errors.array()
            });
            return;
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
            return;
        }

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        const token = generateToken(String(user._id));

        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            theme: user.theme || defaultTheme,
            createdAt: user.createdAt
        };

        res.status(201).json({
            success: true,
            message: successMessages.userRegistered,
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: errorMessages.internalServerError
        });
    }
});


router.post('/signin', authLimiter, signinValidation, async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: errorMessages.validationFailed,
                errors: errors.array()
            });
            return;
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: errorMessages.invalidCredentials
            });
            return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: errorMessages.invalidCredentials
            });
            return;
        }

        const token = generateToken(String(user._id));

        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            theme: user.theme || defaultTheme,
            createdAt: user.createdAt
        };

        res.json({
            success: true,
            message: successMessages.loginSuccessful,
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            success: false,
            message: errorMessages.internalServerError
        });
    }
});

router.get('/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: errorMessages.userNotFound
            });
            return;
        }

        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            theme: user.theme || defaultTheme,
            createdAt: user.createdAt
        };

        res.json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: errorMessages.internalServerError
        });
    }
});


router.post('/logout', authenticateToken, (req: Request, res: Response): void => {
    res.json({
        success: true,
        message: successMessages.logoutSuccessful
    });
});

router.patch('/theme', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: errorMessages.userNotFound
            });
            return;
        }

        const { theme } = req.body;

        if (!theme || !themeValues.includes(theme)) {
            res.status(400).json({
                success: false,
                message: validationMessages.invalidTheme
            });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { theme },
            { new: true }
        );

        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: errorMessages.userNotFound
            });
            return;
        }

        res.json({
            success: true,
            theme: updatedUser.theme
        });
    } catch (error) {
        console.error('Update theme error:', error);
        res.status(500).json({
            success: false,
            message: errorMessages.internalServerError
        });
    }
});

export default router;
