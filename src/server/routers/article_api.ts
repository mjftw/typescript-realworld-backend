import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { CreateArticleSchema } from '../../json_schemas/article';
import {
    createArticle,
    getArticleFavoritesCount,
    getUserById,
    isArticledFavorited,
    isUserFollowing,
} from '../../db/queries';
import { getCurrentUserId, sendErrResponse } from '../utils';

const router = Router();
const validator = new Validator({ allErrors: true });

interface ArticleResponseBody {
    article: {
        slug: string;
        title: string;
        description: string;
        body: string;
        tagList?: string[];
        createdAt: string;
        updatedAt: string;
        favorited: boolean;
        favoritesCount: number;
        author: {
            username: string;
            bio?: string;
            image?: string;
            following?: boolean;
        };
    };
}

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

        const article = await createArticle({
            title: reqArticle.title,
            description: reqArticle.description,
            body: reqArticle.body,
            authorId: userId,
            tagList: reqArticle.tagList,
        });
        if (article instanceof Error) {
            sendErrResponse(res, 500, Error);
            return;
        }
        console.log(JSON.stringify(article, undefined, 2));

        const favoritesCount = await getArticleFavoritesCount(
            article.article_id
        );
        if (favoritesCount instanceof Error) {
            sendErrResponse(res, 500, Error);
            return;
        }

        const favorited = await isArticledFavorited(userId, article.article_id);
        if (favorited instanceof Error) {
            sendErrResponse(res, 500, Error);
            return;
        }

        const author = await getUserById(userId);
        if (author instanceof Error) {
            sendErrResponse(res, 500, Error);
            return;
        }

        const followingAuthor = await isUserFollowing(
            userId,
            article.article_id
        );
        if (followingAuthor instanceof Error) {
            sendErrResponse(res, 500, Error);
            return;
        }

        const body: ArticleResponseBody = {
            article: {
                slug: article.slug,
                title: article.title,
                description: article.description,
                body: article.body,
                tagList: article.tag_list,
                createdAt: article.created_at,
                updatedAt: article.updated_at,
                favorited: favorited,
                favoritesCount: favoritesCount,
                author: {
                    username: author.username,
                    bio: author.bio,
                    image: author.bio,
                    following: followingAuthor,
                },
            },
        };

        res.send(body);
    }
);

export default router;
