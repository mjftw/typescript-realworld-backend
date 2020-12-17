import { Router } from 'express';
import userApiRouter from './user_api';
import articleApiRouter from './article_api';

const router = Router();

router.use(userApiRouter, articleApiRouter);

export default router;
