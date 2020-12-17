import { JSONSchema7 } from 'json-schema';

export const CreateArticleSchema: JSONSchema7 = {
    type: 'object',
    required: ['article'],
    title: 'CreateArticle',
    properties: {
        article: {
            required: ['title', 'description', 'body'],
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                body: {
                    type: 'string',
                },
                tagList: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
            },
            additionalProperties: false,
        },
        additionalProperties: false,
    },
};
