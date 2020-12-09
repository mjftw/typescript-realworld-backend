import { UserAuth, UserLogin } from './types';
import { getUserByEmail } from '../db/queries';

export async function loginUser(
    userLogin: UserLogin
): Promise<UserAuth | Error> {
    //TODO: 1. Check if user already logged in, error if so

    //DONE: 2. Check if user exists in database
    const user = await getUserByEmail(userLogin.email);

    if (user === null) {
        const error: Error = {
            name: 'NonexistentUser',
            message: `No user found with email ${userLogin.email}`,
        };
        return error;
    }

    //TODO: 3. Create hash of password
    //TODO: 4. Check password hash matches value from db, error if not
    //TODO: 5. Create JWT for user login (including user ID as data)
    //TODO: 6. Populate and return UserAuth

    const mockUser: UserAuth = {
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
        token: 'Not a real token',
    };

    return mockUser;
}
