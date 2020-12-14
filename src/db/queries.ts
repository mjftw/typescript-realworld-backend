import pool from './dbconfig';
import { UserDbSchema } from '../common/types';

//TODO: Need add database error handling throughout:
//      - Report some error in the response body
//      - Ensure client is released from pool on database error

export function getUserByEmail(email: string): Promise<UserDbSchema | Error> {
    return read<UserDbSchema>('users', { column: 'email', value: email });
}

export function getUserByUsername(
    username: string
): Promise<UserDbSchema | Error> {
    return read<UserDbSchema>('users', { column: 'username', value: username });
}

export function getUserById(id: number): Promise<UserDbSchema | Error> {
    return read<UserDbSchema>('users', { column: 'user_id', value: id });
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

async function read<T extends Object>(
    table: string,
    uniqueKey: { column: string; value: unknown },
    columns?: string[]
): Promise<T | Error> {
    const columnsString = columns ? columns.join(', ') : '*';
    const client = await pool.connect();
    const result = await client.query(
        `
        SELECT ${columnsString}
        FROM ${table}
        WHERE ${uniqueKey.column} = $1;
    `,
        [uniqueKey.value]
    );
    client.release();

    if (result.rowCount < 1) {
        return Error('No records were found');
    }
    if (result.rowCount > 1) {
        return Error('Multiple records were found');
    }

    const found: T = result.rows[0];
    return found;
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

async function update<T extends Object>(
    table: string,
    uniqueKey: { column: string; value: unknown },
    updateColumns: Partial<T>
): Promise<T | Error> {
    const columns = Object.keys(updateColumns);
    const setAssigns = columns
        .map((column, idx) => `${column} = $${idx + 1}`)
        .join(', ');
    const idSub = `$${columns.length + 1}`;
    const values = [...Object.values(updateColumns), uniqueKey.value];

    //TODO: Add check that ONLY 1 row will be updated, abort if more

    const client = await pool.connect();
    const result = await client.query(
        `
        UPDATE ${table}
        SET ${setAssigns}
        WHERE ${uniqueKey.column} = ${idSub}
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
