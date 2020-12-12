import pool from './dbconfig';
import { User } from '../common/types';

//TODO: Need add database error handling throughout:
//      - Report some error in the response body
//      - Ensure client is released from pool on database error

export function getUserByEmail(email: string): Promise<User | null> {
    return getUserBy('email', email);
}

export function getUserByUsername(username: string): Promise<User | null> {
    return getUserBy('username', username);
}

// Do not use user input as column, this is unsantised in query and could result in SQL injection!
async function getUserBy(column: string, value: string): Promise<User | null> {
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
        WHERE ${column} = $1
        LIMIT 1;
    `,
        [value]
    );
    client.release();

    // No matching users
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
        [email, username, password_hash, password_salt]
    );
    client.release();
    const newUser = result.rows[0];

    // Extracting specific fields to protect against DB schema changes
    return {
        id: newUser.user_id,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        password_hash: newUser.password_hash,
        password_salt: newUser.password_salt,
    };
}
