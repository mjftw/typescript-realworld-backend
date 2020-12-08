import { UserAuth, UserLogin } from './types';

export function loginUser(userLogin: UserLogin): UserAuth {
    //TODO:
    // 1. Check if user already logged in, error if so
    // 2. Check if user exists in database
    // 3. Create hash of password
    // 4. Check password hash matches value from db, error if not
    // 5. Create JWT for user login (including user ID as data)
    // 6. Populate and return UserAuth

    const mockUser: UserAuth = {
        email: userLogin.email,
        username: 'John Smith',
        bio: 'You know nothing John Smith',
        image: null,
        token: 'Not a real token',
    };

    return mockUser;
}
