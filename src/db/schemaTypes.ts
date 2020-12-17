import { UserProfile } from '../common/types';

export type UserDbSchema = {
    user_id: number;
    email: string;
    username: string;
    bio?: string;
    image?: string;
    password_hash: string;
    password_salt: string;
};

export interface ArticleDbSchema {
    article_id: number;
    slug: string;
    title: string;
    description: string;
    body: string;
    created_at: string;
    updated_at: string;
    author_id: number;
}

export interface Comment {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    author: UserProfile;
}
