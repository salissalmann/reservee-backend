export const authPaths = {
    '/auth/sign-up': {
        post: {
            tags: ['Authentication'],
            summary: 'User registration',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['first_name', 'last_name', 'email', 'password', 'phone_no', 'country_code', 'otp'],
                            properties: {
                                first_name: { type: 'string' },
                                last_name: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                password: { type: 'string' },
                                phone_no: { type: 'string' },
                                country_code: { type: 'string' },
                                otp: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'User registered successfully'
                },
                '400': {
                    description: 'Invalid input'
                },
                '409': {
                    description: 'Email already exists'
                }
            }
        }
    },

    '/auth/member/sign-up': {
        post: {
            tags: ['Authentication'],
            summary: 'Member registration via invitation',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['first_name', 'last_name', 'email', 'password', 'phone_no', 'country_code', 'invitation_id'],
                            properties: {
                                first_name: { type: 'string' },
                                last_name: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                password: { type: 'string' },
                                phone_no: { type: 'string' },
                                country_code: { type: 'string' },
                                invitation_id: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Member registered successfully' },
                '400': { description: 'Invalid input or invitation' },
                '409': { description: 'Email or phone number already exists' }
            }
        }
    },

    '/auth/log-in': {
        post: {
            tags: ['Authentication'],
            summary: 'User login',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password'],
                            properties: {
                                email: { type: 'string', format: 'email' },
                                password: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Login successful' },
                '400': { description: 'Invalid credentials or email not verified' },
                '500': { description: 'Server error' }
            }
        }
    },

    '/auth/refresh-token': {
        post: {
            tags: ['Authentication'],
            summary: 'Refresh access token',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['refresh_token'],
                            properties: {
                                refresh_token: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Token refreshed successfully' },
                '401': { description: 'Invalid or expired refresh token' }
            }
        }
    },

    '/file-upload': {
        post: {
            tags: ['Files'],
            summary: 'Upload single file',
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                file: { type: 'string', format: 'binary' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'File uploaded successfully' },
                '400': { description: 'No valid file found' },
                '500': { description: 'Server error' }
            }
        }
    },

    '/auth/google/log-in': {
        post: {
            tags: ['Authentication'],
            summary: 'Google OAuth login',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['first_name', 'email'],
                            properties: {
                                first_name: { type: 'string' },
                                last_name: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                image: { type: 'string' },
                                phone_no: { type: 'string' },
                                country_code: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Login successful' },
                '400': { description: 'Missing required fields' },
                '500': { description: 'Server error' }
            }
        }
    },

    '/file-upload/multiple': {
        post: {
            tags: ['Files'],
            summary: 'Upload multiple files',
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                files: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                        format: 'binary'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Files uploaded successfully' },
                '400': { description: 'No valid files found' },
                '500': { description: 'Server error' }
            }
        }
    },

    '/users': {
        get: {
            tags: ['Users'],
            summary: 'Get authenticated user profile',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': { description: 'User data retrieved successfully' },
                '401': { description: 'Unauthorized' },
                '404': { description: 'User not found' }
            }
        }
    },

    '/auth/forgot-password': {
        post: {
            tags: ['Authentication'],
            summary: 'Request password reset',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email'],
                            properties: {
                                email: { type: 'string', format: 'email' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Password reset OTP sent' },
                '404': { description: 'User not found' },
                '500': { description: 'Server error' }
            }
        } 
    },

    '/auth/reset-password': {
        post: {
            tags: ['Authentication'],
            summary: 'Reset password with OTP',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'otp', 'new_password'],
                            properties: {
                                email: { type: 'string', format: 'email' },
                                otp: { type: 'string' },
                                new_password: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Password reset successful' },
                '400': { description: 'Invalid input' },
                '409': { description: 'Invalid OTP' }
            }
        }
    },

    '/users/onboard': {
        put: {
            tags: ['Users'],
            summary: 'Update user onboarding information',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                first_name: { type: 'string' },
                                last_name: { type: 'string' },
                                phone_no: { type: 'string' },
                                country_code: { type: 'string' },
                                image: { type: 'string' },
                                city: { type: 'string' },
                                state: { type: 'string' },
                                country: { type: 'string' },
                                dob: { type: 'string' },
                                gender: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'User updated successfully' },
                '400': { description: 'Invalid input' },
                '401': { description: 'Unauthorized' }
            }
        }
    },

    '/users/change-password': {
        put: {
            tags: ['Users'],
            summary: 'Change user password',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['old_password', 'new_password'],
                            properties: {
                                old_password: { type: 'string' },
                                new_password: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Password changed successfully' },
                '401': { description: 'Unauthorized' },
                '409': { description: 'Incorrect old password' }
            }
        }
    },

    '/users/profile': {
        put: {
            tags: ['Users'],
            summary: 'Update user profile',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                first_name: { type: 'string' },
                                last_name: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                phone_no: { type: 'string' },
                                city: { type: 'string' },
                                state: { type: 'string' },
                                country: { type: 'string' },
                                dob: { type: 'string' },
                                gender: { type: 'string' },
                                is_public: { type: 'boolean' },
                                country_code: { type: 'string' },
                                image: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': { description: 'Profile updated successfully' },
                '401': { description: 'Unauthorized' },
                '404': { description: 'User not found' }
            }
        }
    },

    '/users/verify-kyc': {
        post: {
            tags: ['Users'],
            summary: 'Initiate KYC verification with Veriff',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': {
                    description: 'Veriff session created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    statusCode: { type: 'number', example: 200 },
                                    status: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Veriff session created successfully' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            sessionUrl: { 
                                                type: 'string', 
                                                example: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiJ9...' 
                                            },
                                            sessionId: { 
                                                type: 'string', 
                                                example: '12345678-1234-1234-1234-123456789012' 
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                '401': {
                    description: 'Unauthorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    statusCode: { type: 'number', example: 401 },
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Unauthorized' },
                                    data: { type: 'null' }
                                }
                            }
                        }
                    }
                },
                '404': {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    statusCode: { type: 'number', example: 404 },
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'User not found' },
                                    data: { type: 'null' }
                                }
                            }
                        }
                    }
                },
                '500': {
                    description: 'Server error or Veriff configuration missing',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    statusCode: { type: 'number', example: 500 },
                                    status: { type: 'boolean', example: false },
                                    message: { type: 'string', example: 'Failed to initiate KYC verification' },
                                    data: { type: 'null' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
