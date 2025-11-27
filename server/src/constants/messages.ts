export const errorMessages = {
    userNotAuthenticated: 'User not authenticated',
    conversationNotFound: 'Conversation not found',
    serverError: 'Server error',
    invalidCredentials: 'Invalid credentials',
    validationFailed: 'Validation failed',
    internalServerError: 'Internal server error',
    userNotFound: 'User not found',
    invalidToken: 'Invalid token',
} as const;

export const successMessages = {
    userRegistered: 'User registered successfully',
    loginSuccessful: 'Login successful',
    logoutSuccessful: 'Logout successful',
    conversationDeleted: 'Conversation deleted successfully',
} as const;

export const validationMessages = {
    invalidConversationId: 'Invalid conversation ID',
    titleRequired: 'Title cannot be empty',
    messageRequired: 'Message cannot be empty',
    emailRequired: 'Please provide a valid email',
    passwordMinLength: 'Password must be at least 6 characters long',
    passwordRequired: 'Password is required',
    invalidTheme: 'Invalid theme. Must be "light" or "dark"',
} as const;

