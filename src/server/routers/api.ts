import { Router } from 'express';
import userApiRouter from './user_api';

const router = Router();

router.use('/user?s/', userApiRouter);

export default router;
