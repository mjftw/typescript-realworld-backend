import { JSONSchema7 } from 'json-schema';

// Used for login requests
export const UserLoginSchema: JSONSchema7 = {
    title: 'UserLogin',
    type: 'object',
    required: ['user'],
    properties: {
        user: {
            required: ['email', 'password'],
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    format: 'email',
                },
                password: {
                    type: 'string',
                },
            },
            additionalProperties: false,
        },
    },
    additionalProperties: false,
};

// Used for registration requests
export const UserRegisterSchema: JSONSchema7 = {
    type: 'object',
    required: ['user'],
    title: 'UserRegister',
    properties: {
        user: {
            required: ['email', 'password', 'username'],
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    format: 'email',
                },
                username: {
                    type: 'string',
                },
                password: {
                    type: 'string',
                },
            },
            additionalProperties: false,
        },
        additionalProperties: false,
    },
};

// Used for update requests
export const UserUpdateSchema: JSONSchema7 = {
    type: 'object',
    required: ['user'],
    title: 'UserRegister',
    properties: {
        user: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    format: 'email',
                },
                username: {
                    type: 'string',
                },
                password: {
                    type: 'string',
                },
                image: {
                    type: 'string',
                },
                bio: {
                    type: 'string',
                },
            },
            additionalProperties: false,
        },
        additionalProperties: false,
    },
};
