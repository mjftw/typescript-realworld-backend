import { Pool } from 'pg';

export const dbConnectionString =
    process.env.DB_CONNECTION_STRING ||
    'postgresql://postgres:postgres@localhost:5432/app';

const pool = new Pool({
    connectionString: dbConnectionString,
});

export default pool;
