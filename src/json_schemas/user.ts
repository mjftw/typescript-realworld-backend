import { JSONSchema7 } from 'json-schema';

const UserProperties: JSONSchema7 = {
    required: ['email', 'password'],
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
            maxLength: 200,
        },
        password: {
            type: 'string',
        },
    },
    additionalProperties: false,
};

// Used for login requests
export const UserLoginSchema: JSONSchema7 = {
    title: 'UserLogin',
    type: 'object',
    required: ['user'],
    properties: {
        user: UserProperties,
    },
    additionalProperties: false,
};

// Used for registration requests
export const UserRegisterSchema: JSONSchema7 = {
    ...UserLoginSchema,
    title: 'UserRegister',
    properties: {
        user: {
            ...UserProperties,
            required: [...(UserProperties?.required || []), 'username'],
            properties: {
                ...UserProperties.properties,
                username: {
                    type: 'string',
                },
            },
        },
    },
};
