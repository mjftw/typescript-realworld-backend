import { randomBytes } from 'crypto';
import { User, UserLogin } from './types';
import { getUserByEmail } from '../db/queries';

export async function loginUser(userLogin: UserLogin): Promise<User | Error> {
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
    //TODO: 5. Return logged in User

    return user;
}

//TODO: Add expiry date to tokens
export function newAuthJwt(id: number): string {
    //TODO: Create JWT for user login (including user ID as data)
    return 'Foo';
}

// function hashPassword(password: string, salt: string): string {
//     return 'Foo';
// }

// function newSalt(length: number): string {
//     return 'Foo';
// }
