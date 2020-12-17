import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { CreateArticleSchema } from '../../json_schemas/article';
import { createArticle } from '../../db/queries';
import { getCurrentUserId, sendErrResponse } from '../utils';

const router = Router();
const validator = new Validator({ allErrors: true });

interface CreateArticleBody {
    article: {
        title: string;
        description: string;
        body: string;
        tagList: string[];
    };
}
router.post(
    '/articles/',
    validator.validate({ body: CreateArticleSchema }),
    async (req: Request, res: Response) => {
        const userId = getCurrentUserId(req);
        if (userId === undefined) {
            sendErrResponse(res, 500, 'Failed to get current user');
            return;
        }

        const { article: reqArticle }: CreateArticleBody = req.body;

        const article = await createArticle(
            reqArticle.title,
            reqArticle.description,
            reqArticle.body,
            userId,
            reqArticle.tagList
        );
        if (article instanceof Error) {
            sendErrResponse(res, 500, Error);
        }

        res.send(article);
    }
);

export default router;
