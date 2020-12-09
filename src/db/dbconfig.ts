import { Pool } from 'pg';

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432');
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USERNAME;
const dbPass = process.env.DB_PASSWORD;

const pool = new Pool({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPass,
});

export default pool;
