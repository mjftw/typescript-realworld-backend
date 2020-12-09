import { Pool } from 'pg';
import { dbHost, dbPort, dbName, dbUser, dbPass } from '../config';

const pool = new Pool({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPass,
});

export default pool;
