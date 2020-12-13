import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import {
    createUserAuth,
    hashPassword,
    loginUser,
    newSalt,
} from '../../common/auth';
import { UserLoginSchema, UserRegisterSchema } from '../../json_schemas/user';
import { User, UserAuth } from '../../common/types';
import { saltLength } from '../../config';
import {
    addUser,
    getUserByEmail,
    getUserById,
    getUserByUsername,
} from '../../db/queries';
import { getCurrentUser, getJwtFromRequest, sendErrResponse } from '../utils';

const router = Router();
const validator = new Validator({ allErrors: true });

interface UserResponseBody {
    user: UserAuth;
}

// Register new user
interface UserRegisterReqBody {
    user: {
        email: string;
        password: string;
        username: string;
    };
}

router.post(
    '/users/',
    validator.validate({ body: UserRegisterSchema }),
    async (
        { body: { user: reqUser } }: { body: UserRegisterReqBody },
        res: Response
    ) => {
        // Valid user register data at this point
        if ((await getUserByEmail(reqUser.email)) !== null) {
            sendErrResponse(res, 403, 'Email address taken');
            return;
        }
        if ((await getUserByUsername(reqUser.username)) !== null) {
            sendErrResponse(res, 403, 'Username taken');
            return;
        }

        const salt = newSalt(saltLength);
        const hashedPassword = hashPassword(reqUser.password, salt);

        const maybeUser = await addUser(
            reqUser.username,
            reqUser.email,
            hashedPassword,
            salt
        );
        if (maybeUser === null) {
            throw Error('Failed to create user');
        }

        const auth = createUserAuth(maybeUser);
        res.send({ user: auth });
    }
);

// Log user in
interface UserLoginReqBody {
    user: {
        email: string;
        password: string;
    };
}
router.post(
    '/users/login/',
    validator.validate({
        body: UserLoginSchema,
    }),
    async (
        { body: { user: reqUser } }: { body: UserLoginReqBody },
        res: Response
    ): Promise<void> => {
        // Valid user at this point
        const maybeUser: User | null = await loginUser(
            reqUser.email,
            reqUser.password
        );
        if (maybeUser === null) {
            //NOTE: This could be invalid auth or nonexistent user
            sendErrResponse(res, 401, 'Incorrect email address or password');
            return;
        }

        const responseBody: UserResponseBody = {
            user: createUserAuth(maybeUser),
        };
        res.send(responseBody);
    }
);

router.get(
    '/user/',
    async (req: Request, res: Response): Promise<void> => {
        const userId = getCurrentUser(req);
        if (!userId) {
            console.log('Auth: ' + JSON.stringify(req.auth, undefined, 2));
            sendErrResponse(res, 500, 'Invalid JWT format: missing user ID');
            return;
        }

        const maybeUser = await getUserById(userId);
        if (!maybeUser) {
            sendErrResponse(res, 404, 'No user matching JWT user auth');
            return;
        }

        const maybeToken = getJwtFromRequest(req);
        if (!maybeToken) {
            sendErrResponse(res, 500, 'Unable to get token from request');
            return;
        }

        const responseBody: UserResponseBody = {
            user: {
                email: maybeUser.email,
                username: maybeUser.username,
                bio: maybeUser.bio,
                image: maybeUser.image,
                token: maybeToken,
            },
        };
        res.send(responseBody);
    }
);

export default router;
