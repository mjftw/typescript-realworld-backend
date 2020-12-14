import { Router } from 'express';
import userApiRouter from './user_api';

const router = Router();

router.use(userApiRouter);

export default router;
