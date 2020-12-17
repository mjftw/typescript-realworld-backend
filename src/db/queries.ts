import pool from './dbconfig';
import { ArticleDbSchema, UserDbSchema } from './schemaTypes';

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

export async function createUser(
    username: string,
    email: string,
    password_hash: string,
    password_salt: string
): Promise<UserDbSchema | Error> {
    return create<UserDbSchema>('users', {
        username: username,
        email: email,
        password_hash: password_hash,
        password_salt: password_salt,
    });
}

export async function createArticle({
    title,
    description,
    body,
    authorId,
    tagList,
}: {
    title: string;
    description: string;
    body: string;
    authorId: number;
    tagList?: string[];
}): Promise<ArticleDbSchema | Error> {
    const client = await pool.connect();
    return client
        .query('START TRANSACTION;')
        .then(() =>
            client.query(
                `
                INSERT INTO articles(
                    title,
                    description,
                    body,
                    author_id,
                    created_at,
                    updated_at
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                );
            `,
                [title, description, body, authorId]
            )
        )
        .then(() =>
            tagList?.length
                ? client.query(`

                INSERT INTO article_tags(article_id, tag)
                VALUES ${tagList
                    .map(
                        (tag) =>
                            `(currval(pg_get_serial_sequence('articles', 'article_id')), '${tag}')`
                    )
                    .join(', ')};
                `)
                : undefined
        )
        .then(() => client.query('COMMIT;'))
        .then(() =>
            client.query(`
                SELECT currval(pg_get_serial_sequence('articles', 'article_id')) AS article_id;
            `)
        )
        .then(({ rows: [{ article_id }] }) => {
            return getArticlebyId(article_id);
        })
        .catch((err) => err)
        .finally(() => client.release());
}

export async function getArticlebyId(
    articleId: number
): Promise<ArticleDbSchema | Error> {
    return read<ArticleDbSchema>('articles', {
        column: 'article_id',
        value: articleId,
    });
}

export async function getArticlebySlug(
    slug: string
): Promise<ArticleDbSchema | Error> {
    return read<ArticleDbSchema>('articles', {
        column: 'slug',
        value: slug,
    });
}

export async function getArticleTags(
    articleId: number
): Promise<string[] | undefined | Error> {
    const client = await pool.connect();
    return client
        .query(
            `
            SELECT tag
            FROM article_tags
            WHERE article_id = $1;
        `,
            [articleId]
        )
        .then((result) => {
            if (result.rowCount < 1) {
                return undefined;
            }
            return result.rows.map(({ tag }) => tag);
        })
        .catch((err) => err)
        .finally(() => client.release());
}

export async function getArticleFavoritesCount(
    articleId: number
): Promise<number | Error> {
    const client = await pool.connect();
    return client
        .query(
            `
            SELECT count(*)
            FROM users_favorited_articles
            WHERE article_id = $1;
            `,
            [articleId]
        )
        .then(({ rows: [{ count }] }) => parseInt(count))
        .catch((err) => err)
        .finally(() => client.release());
}

export async function isArticledFavorited(
    articleId: number,
    userId: number
): Promise<boolean | Error> {
    const client = await pool.connect();
    return client
        .query(
            `
            SELECT exists(
                SELECT 1
                FROM users_favorited_articles
                WHERE article_id = $1 AND user_id = $2
            );
        `,
            [articleId, userId]
        )
        .then(({ rows: [{ exists }] }) => exists)
        .catch((err) => err)
        .finally(() => client.release());
}

export async function isUserFollowing(
    followerUserId: number,
    followedUserId: number
): Promise<boolean | Error> {
    const client = await pool.connect();
    return client
        .query(
            `
            SELECT exists(
                SELECT 1
                FROM users_followed_users
                WHERE follower_user_id = $1 AND followed_user_id = $2
            );
        `,
            [followerUserId, followedUserId]
        )
        .then(({ rows: [{ exists }] }) => exists)
        .catch((err) => err)
        .finally(() => client.release());
}

async function create<T extends Object>(
    table: string,
    columns: Partial<T>
): Promise<T | Error> {
    const { columnsStr, valuesStr, values } = getInsertList(columns);

    const client = await pool.connect();
    return client
        .query(
            `
            INSERT INTO ${table}(${columnsStr})
            VALUES (${valuesStr})
            RETURNING *;
            `,
            values
        )
        .then((result) => {
            if (result.rowCount < 1) {
                return Error('No records were created');
            }

            const updated: T = result.rows[0];
            return updated;
        })
        .catch((error) => error)
        .finally(() => client.release());
}

async function read<T extends Object>(
    table: string,
    uniqueKey: { column: string; value: unknown },
    columns?: string[]
): Promise<T | Error> {
    const columnsStr = columns ? columns.join(', ') : '*';
    const client = await pool.connect();
    return client
        .query(
            `
            SELECT ${columnsStr}
            FROM ${table}
            WHERE ${uniqueKey.column} = $1;
            `,
            [uniqueKey.value]
        )
        .then((result) => {
            if (result.rowCount < 1) {
                return Error('No records were found');
            }
            if (result.rowCount > 1) {
                return Error('Multiple records were found');
            }

            const found: T = result.rows[0];
            return found;
        })
        .catch((error) => error)
        .finally(() => client.release());
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
    return client
        .query(
            `
        UPDATE ${table}
        SET ${setAssigns}
        WHERE ${uniqueKey.column} = ${idSub}
        RETURNING *;
    `,
            values
        )
        .then((result) => {
            if (result.rowCount < 1) {
                return Error('No records were updated');
            }

            const updated: T = result.rows[0];
            return updated;
        })
        .catch((error) => error)
        .finally(() => client.release());
}

//TODO: Make generic database function: delete

function getInsertList<T extends Object>(
    obj: Partial<T>
): { columnsStr: string; valuesStr: string; values: unknown[] } {
    return {
        columnsStr: Object.keys(obj).join(', '),
        valuesStr: Object.keys(obj)
            .map((_, idx) => `$${idx + 1}`)
            .join(', '),
        values: Object.values(obj),
    };
}
