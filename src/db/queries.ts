import pool from './dbconfig';
import { UserDbSchema } from '../common/types';

//TODO: Need add database error handling throughout:
//      - Report some error in the response body
//      - Ensure client is released from pool on database error

export function getUserByEmail(email: string): Promise<UserDbSchema | null> {
    return getUserBy('email', email);
}

export function getUserByUsername(
    username: string
): Promise<UserDbSchema | null> {
    return getUserBy('username', username);
}

export function getUserById(id: number): Promise<UserDbSchema | null> {
    return getUserBy('user_id', id);
}

// Do not use user input as column, this is unsantised in query and could result in SQL injection!
async function getUserBy(
    column: string,
    value: string | number
): Promise<UserDbSchema | null> {
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
    const dbUser = result.rows[0];

    return {
        user_id: dbUser.user_id,
        username: dbUser.username,
        email: dbUser.email,
        bio: dbUser.bio,
        image: dbUser.bio,
        password_hash: dbUser.password_hash,
        password_salt: dbUser.password_salt,
    };
}

export async function addUser(
    username: string,
    email: string,
    password_hash: string,
    password_salt: string
): Promise<UserDbSchema | null> {
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
        user_id: newUser.user_id,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        image: newUser.image,
        password_hash: newUser.password_hash,
        password_salt: newUser.password_salt,
    };
}

export async function updateUser(
    id: number,
    fields: Partial<UserDbSchema>
): Promise<UserDbSchema | Error> {
    return update<UserDbSchema>(
        'users',
        { column: 'user_id', value: id },
        fields
    );
}

async function update<T extends Object>(
    table: string,
    primaryKey: { column: string; value: unknown },
    updateColumns: Partial<T>
): Promise<T | Error> {
    const columns = Object.keys(updateColumns);
    const setAssigns = columns
        .map((column, idx) => `${column} = $${idx + 1}`)
        .join(', ');
    const idSub = `$${columns.length + 1}`;
    const values = [...Object.values(updateColumns), primaryKey.value];

    //TODO: Add check that ONLY 1 row will be updated, abort if more

    const client = await pool.connect();
    const result = await client.query(
        `
        UPDATE ${table}
        SET ${setAssigns}
        WHERE ${primaryKey.column} = ${idSub}
        RETURNING *;
    `,
        values
    );
    client.release();

    if (result.rowCount < 1) {
        return Error('No records were updated');
    }

    const updated: T = result.rows[0];
    return updated;
}

//TODO: Make generic database function: create
//TODO: Make generic database function: read
//TODO: Make generic database function: update ^^^ above
//TODO: Make generic database function: delete
