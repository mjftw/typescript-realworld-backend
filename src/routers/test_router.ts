import { Router } from 'express';
import pool, { dbConnectionString } from '../dbconfig';

const router = Router();

router.get('/', async (_req, res) => {
    console.log(`Connecting to ${dbConnectionString}`);
    const client = await pool.connect();
    const query = await client.query('SELECT CURRENT_DATE');
    client.release();

    const date = query.rows[0];
    console.log(date);

    res.send(date);
});

export default router;
