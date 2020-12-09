import pool from './dbconfig';
import { User } from '../common/types';

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

    // No users in DB with matching email
    if (result.rowCount == 0) {
        return null;
    }
    const user: User = result.rows[0];

    return user;
}
