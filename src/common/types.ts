// ========== User ==========
// Used for login requests
export interface UserLogin {
    email: string;
    password: string;
}

// Used for registration requests
export interface UserRegister extends UserLogin {
    username: string;
}

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

export interface User extends UserBase {
    id: number;
    email: string;
    password_hash: string;
    password_salt: string;
}

interface UserBase {
    username: string;
    bio: string;
    image: string | null;
}

// ========== Article ==========
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
    uid: number;
}
