import pool from '../../dbconfig';
import { User, UserAuth, UserLogin } from './types';

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

export async function getUserByEmail(email: string): Promise<User | null> {
    const client = await pool.connect();
    const result = await client.query(`
        SELECT
            user_id,
            email,
            password_hash,
            password_salt,
            username,
            bio,
            image
        FROM users
        WHERE email = '${email}'
        LIMIT 1;
    `);
    client.release();

    //TODO: No users in DB with matching email
    if (result.rowCount == 0) {
        return null;
    }
    const user: User = result.rows[0];

    return user;
}
