import pool from './dbconfig';
import { User } from '../common/types';

export async function getUserByEmail(email: string): Promise<User | null> {
    const client = await pool.connect();
    const result = await client.query(
        `
        SELECT
            user_id,
            email,
            password_hash,
            password_salt,
            username,
            bio,
            image
        FROM users
        WHERE email = $1
        LIMIT 1;
    `,
        [email]
    );
    client.release();

    // No users in DB with matching email
    if (result.rowCount == 0) {
        return null;
    }
    const user: User = result.rows[0];

    return user;
}

export async function getUserByUsername(
    username: string
): Promise<User | null> {
    const client = await pool.connect();
    const result = await client.query(
        `
        SELECT
            user_id,
            email,
            password_hash,
            password_salt,
            username,
            bio,
            image
        FROM users
        WHERE username = $1
        LIMIT 1;
    `,
        [username]
    );
    client.release();

    // No users in DB with matching email
    if (result.rowCount == 0) {
        return null;
    }
    const user: User = result.rows[0];

    return user;
}

export async function addUser(
    username: string,
    email: string,
    password_hash: string,
    password_salt: string
): Promise<User | null> {
    const client = await pool.connect();
    const result = await client.query(
        `
        INSERT INTO users (
            email,
            username,
            password_hash,
            password_salt
        )
        VALUES (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING *;
    `,
        [username, email, password_hash, password_salt]
    );
    client.release();
    console.log(result);
    console.log(JSON.stringify(result, undefined, 4));

    // Ugly but required as we really get an array of results back

    const newUser: User = result.rows[0];
    return newUser;
}
