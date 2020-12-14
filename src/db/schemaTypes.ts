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

export interface Article {
    article_id: number;
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: [Tag];
    createdAt: Date;
    updatedAt: Date;
    favorited: boolean;
    favoritesCount: number;
    author: UserProfile;
}

export interface Comment {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    author: UserProfile;
}

export interface Tag {
    id: number;
    title: string;
}
