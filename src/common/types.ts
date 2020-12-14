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

// Data stored in JWT payload
export interface JwtAuth {
    userId: number;
}

// ========== Errors ==========
// Error codes that server can return
export type HttpErrorCode = 401 | 403 | 404 | 422 | 500;
