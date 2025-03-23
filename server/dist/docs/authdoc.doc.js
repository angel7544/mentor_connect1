"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Request and Response Types
const SignupRequest = {
    type: 'object',
    required: ['email', 'password', 'firstName', 'lastName', 'role'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
            description: 'User\'s email address',
            example: 'user@example.com'
        },
        password: {
            type: 'string',
            format: 'password',
            minLength: 8,
            description: 'User\'s password (min 8 characters)',
            example: 'Password123!'
        },
        firstName: {
            type: 'string',
            description: 'User\'s first name',
            example: 'John'
        },
        lastName: {
            type: 'string',
            description: 'User\'s last name',
            example: 'Doe'
        },
        role: {
            type: 'string',
            enum: ['student', 'alumni'],
            description: 'User\'s role in the system',
            example: 'student'
        },
        graduationYear: {
            type: 'number',
            description: 'Required for alumni role',
            example: 2020
        },
        company: {
            type: 'string',
            description: 'Current company (for alumni)',
            example: 'Tech Corp'
        },
        position: {
            type: 'string',
            description: 'Current position (for alumni)',
            example: 'Software Engineer'
        }
    }
};
const LoginRequest = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
            description: 'User\'s email address',
            example: 'user@example.com'
        },
        password: {
            type: 'string',
            format: 'password',
            description: 'User\'s password',
            example: 'Password123!'
        }
    }
};
const AuthResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            description: 'Indicates if the operation was successful',
            example: true
        },
        message: {
            type: 'string',
            description: 'Response message',
            example: 'Login successful'
        },
        data: {
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User\'s unique identifier',
                            example: '507f1f77bcf86cd799439011'
                        },
                        email: {
                            type: 'string',
                            description: 'User\'s email',
                            example: 'user@example.com'
                        },
                        firstName: {
                            type: 'string',
                            description: 'User\'s first name',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            description: 'User\'s last name',
                            example: 'Doe'
                        },
                        role: {
                            type: 'string',
                            description: 'User\'s role',
                            example: 'student'
                        }
                    }
                },
                tokens: {
                    type: 'object',
                    properties: {
                        accessToken: {
                            type: 'string',
                            description: 'JWT access token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                        },
                        refreshToken: {
                            type: 'string',
                            description: 'JWT refresh token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                        }
                    }
                }
            }
        }
    }
};
const ErrorResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            description: 'Always false for errors',
            example: false
        },
        message: {
            type: 'string',
            description: 'Error message',
            example: 'Invalid credentials'
        },
        error: {
            type: 'string',
            description: 'Detailed error message',
            example: 'Email or password is incorrect'
        }
    }
};
// Endpoint Definitions
const signup = {
    tags: ["Authentication"],
    description: "Register a new user account as student or alumni",
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ["email", "password", "firstName", "lastName", "role"],
                    properties: {
                        email: {
                            type: "string",
                            description: "User's email address",
                            example: "user@example.com",
                            format: "email"
                        },
                        password: {
                            type: "string",
                            description: "User's password (min 8 characters)",
                            example: "Password123!",
                            minLength: 8
                        },
                        firstName: {
                            type: "string",
                            description: "User's first name",
                            example: "John",
                            minLength: 2
                        },
                        lastName: {
                            type: "string",
                            description: "User's last name",
                            example: "Doe",
                            minLength: 2
                        },
                        role: {
                            type: "string",
                            description: "User's role in the system",
                            example: "student",
                            enum: ["student", "alumni"]
                        },
                        graduationYear: {
                            type: "number",
                            description: "Required for alumni role",
                            example: 2020
                        },
                        company: {
                            type: "string",
                            description: "Current company (for alumni)",
                            example: "Tech Corp"
                        },
                        position: {
                            type: "string",
                            description: "Current position (for alumni)",
                            example: "Software Engineer"
                        }
                    }
                }
            }
        }
    },
    responses: {
        "201": {
            description: "User created successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "boolean",
                                example: true
                            },
                            message: {
                                type: "string",
                                example: "Registration successful"
                            },
                            data: {
                                type: "object",
                                properties: {
                                    user: {
                                        type: "object",
                                        properties: {
                                            _id: {
                                                type: "string",
                                                example: "507f1f77bcf86cd799439011"
                                            },
                                            email: {
                                                type: "string",
                                                example: "user@example.com"
                                            },
                                            firstName: {
                                                type: "string",
                                                example: "John"
                                            },
                                            lastName: {
                                                type: "string",
                                                example: "Doe"
                                            },
                                            role: {
                                                type: "string",
                                                example: "student"
                                            }
                                        }
                                    },
                                    tokens: {
                                        type: "object",
                                        properties: {
                                            accessToken: {
                                                type: "string",
                                                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                            },
                                            refreshToken: {
                                                type: "string",
                                                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "400": {
            description: "Bad Request - Invalid input data",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "boolean",
                                example: false
                            },
                            message: {
                                type: "string",
                                example: "Invalid input data"
                            },
                            error: {
                                type: "string",
                                example: "Email format is invalid"
                            }
                        }
                    }
                }
            }
        },
        "409": {
            description: "Conflict - Email already exists",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "boolean",
                                example: false
                            },
                            message: {
                                type: "string",
                                example: "User already exists"
                            },
                            error: {
                                type: "string",
                                example: "Email is already registered"
                            }
                        }
                    }
                }
            }
        }
    }
};
const login = {
    tags: ["Authentication"],
    description: "Authenticate user with email and password",
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            description: "User's email address",
                            example: "user@example.com",
                            format: "email"
                        },
                        password: {
                            type: "string",
                            description: "User's password",
                            example: "Password123!"
                        }
                    }
                }
            }
        }
    },
    responses: {
        "200": {
            description: "Login successful",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "boolean",
                                example: true
                            },
                            message: {
                                type: "string",
                                example: "Login successful"
                            },
                            data: {
                                type: "object",
                                properties: {
                                    user: {
                                        type: "object",
                                        properties: {
                                            _id: {
                                                type: "string",
                                                example: "507f1f77bcf86cd799439011"
                                            },
                                            email: {
                                                type: "string",
                                                example: "user@example.com"
                                            },
                                            firstName: {
                                                type: "string",
                                                example: "John"
                                            },
                                            lastName: {
                                                type: "string",
                                                example: "Doe"
                                            },
                                            role: {
                                                type: "string",
                                                example: "student"
                                            }
                                        }
                                    },
                                    tokens: {
                                        type: "object",
                                        properties: {
                                            accessToken: {
                                                type: "string",
                                                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                            },
                                            refreshToken: {
                                                type: "string",
                                                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "401": {
            description: "Unauthorized - Invalid credentials",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "boolean",
                                example: false
                            },
                            message: {
                                type: "string",
                                example: "Invalid credentials"
                            },
                            error: {
                                type: "string",
                                example: "Email or password is incorrect"
                            }
                        }
                    }
                }
            }
        }
    }
};
const refreshToken = {
    tags: ["Authentication"],
    description: "Generate new access token using refresh token",
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ["refreshToken"],
                    properties: {
                        refreshToken: {
                            type: "string",
                            description: "Valid refresh token",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        }
                    }
                }
            }
        }
    },
    responses: {
        "200": {
            description: "New access token generated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "boolean",
                                example: true
                            },
                            message: {
                                type: "string",
                                example: "Access token refreshed successfully"
                            },
                            accessToken: {
                                type: "string",
                                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            }
                        }
                    }
                }
            }
        },
        "401": {
            description: "Unauthorized - Invalid or expired refresh token",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "boolean",
                                example: false
                            },
                            message: {
                                type: "string",
                                example: "Invalid refresh token"
                            },
                            error: {
                                type: "string",
                                example: "Refresh token has expired"
                            }
                        }
                    }
                }
            }
        }
    }
};
const getCurrentUser = {
    tags: ["Authentication"],
    description: "Get current authenticated user's information",
    security: [{ bearerAuth: [] }],
    responses: {
        "200": {
            description: "Current user information retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "boolean",
                                example: true
                            },
                            message: {
                                type: "string",
                                example: "User information retrieved successfully"
                            },
                            data: {
                                type: "object",
                                properties: {
                                    user: {
                                        type: "object",
                                        properties: {
                                            _id: {
                                                type: "string",
                                                example: "507f1f77bcf86cd799439011"
                                            },
                                            email: {
                                                type: "string",
                                                example: "user@example.com"
                                            },
                                            firstName: {
                                                type: "string",
                                                example: "John"
                                            },
                                            lastName: {
                                                type: "string",
                                                example: "Doe"
                                            },
                                            role: {
                                                type: "string",
                                                example: "student"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "401": {
            description: "Unauthorized - Invalid or missing token",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "boolean",
                                example: false
                            },
                            message: {
                                type: "string",
                                example: "Authentication failed"
                            },
                            error: {
                                type: "string",
                                example: "Invalid or expired token"
                            }
                        }
                    }
                }
            }
        }
    }
};
const baseUrl = process.env.BASE_URL;
const authdocs = {
    [`${baseUrl}/auth/signup`]: {
        post: signup
    },
    [`${baseUrl}/auth/login`]: {
        post: login
    },
    [`${baseUrl}/refresh-token`]: {
        post: refreshToken
    },
    [`${baseUrl}/me/current-user`]: {
        get: getCurrentUser
    }
};
exports.default = authdocs;
