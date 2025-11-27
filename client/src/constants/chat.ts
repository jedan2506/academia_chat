export const messageRole = {
    user: 'user',
    assistant: 'assistant',
} as const;

export type MessageRole = typeof messageRole[keyof typeof messageRole];

