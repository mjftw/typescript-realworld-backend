// ========== User ==========

// Returned by authentication requests
export interface UserAuth extends UserBase {
    email: string;
    token: string;
}

// View of another user when logged in
export interface UserProfile extends UserBase {
    id: number;
    following: boolean;
}

interface UserBase {
    username: string;
    bio?: string;
    image?: string;
}

// ========== DbSchemas ==========

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
    id: number;
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

// ========== Comment ==========
export interface Comment {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    author: UserProfile;
}

// ========== Tag ==========
export interface Tag {
    id: number;
    title: string;
}

// ========== Auth ==========
export interface JwtAuth {
    userId: number;
}

// ========== Errors ==========
// Error codes that server can return
export type HttpErrorCode = 401 | 403 | 404 | 422 | 500;
