export const ERROR_MESSAGES = {
    USER_NOT_AUTHENTICATED: 'User not authenticated',
    CONVERSATION_NOT_FOUND: 'Conversation not found',
    SERVER_ERROR: 'Server error',
    INVALID_CREDENTIALS: 'Invalid credentials',
    VALIDATION_FAILED: 'Validation failed',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    USER_NOT_FOUND: 'User not found',
    INVALID_TOKEN: 'Invalid token',
} as const;

export const SUCCESS_MESSAGES = {
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESSFUL: 'Login successful',
    LOGOUT_SUCCESSFUL: 'Logout successful',
    CONVERSATION_DELETED: 'Conversation deleted successfully',
} as const;

export const VALIDATION_MESSAGES = {
    INVALID_CONVERSATION_ID: 'Invalid conversation ID',
    TITLE_REQUIRED: 'Title cannot be empty',
    MESSAGE_REQUIRED: 'Message cannot be empty',
    EMAIL_REQUIRED: 'Please provide a valid email',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
    PASSWORD_REQUIRED: 'Password is required',
    INVALID_THEME: 'Invalid theme. Must be "light" or "dark"',
} as const;

