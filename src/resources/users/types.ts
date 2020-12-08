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
export interface UserAuth {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string;
}

// View of another user when logged in
export interface UserProfile {
    id: number;
    username: string;
    bio: string;
    image: string;
    following: boolean;
}
