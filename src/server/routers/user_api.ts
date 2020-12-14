import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import {
    createUserAuth,
    hashPassword,
    loginUser,
    newSalt,
} from '../../common/auth';
import {
    UserLoginSchema,
    UserRegisterSchema,
    UserUpdateSchema,
} from '../../json_schemas/user';
import { UserAuth } from '../../common/types';
import { saltLength } from '../../config';
import {
    createUser,
    getUserByEmail,
    getUserById,
    getUserByUsername,
    updateUser,
} from '../../db/queries';
import { getCurrentUserId, getJwtFromRequest, sendErrResponse } from '../utils';
import { UserDbSchema } from '../../db/schemaTypes';

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
    async (req: Request, res: Response): Promise<void> => {
        // Valid user at this point
        const { user: reqUser }: UserRegisterReqBody = req.body;

        if (!((await getUserByEmail(reqUser.email)) instanceof Error)) {
            sendErrResponse(res, 403, 'Email address taken');
            return;
        }
        if (!((await getUserByUsername(reqUser.username)) instanceof Error)) {
            sendErrResponse(res, 403, 'Username taken');
            return;
        }

        const salt = newSalt(saltLength);
        const hashedPassword = hashPassword(reqUser.password, salt);

        const user = await createUser(
            reqUser.username,
            reqUser.email,
            hashedPassword,
            salt
        );
        if (user instanceof Error) {
            sendErrResponse(res, 500, 'Failed to create user');
            return;
        }

        const auth = createUserAuth(user);
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
    async (req: Request, res: Response): Promise<void> => {
        // Valid user at this point
        const { user: reqUser }: UserLoginReqBody = req.body;
        const user = await loginUser(reqUser.email, reqUser.password);
        if (user instanceof Error) {
            //NOTE: This could be invalid auth or nonexistent user
            sendErrResponse(res, 401, 'Incorrect email address or password');
            return;
        }

        const responseBody: UserResponseBody = {
            user: createUserAuth(user),
        };
        res.send(responseBody);
    }
);

// Get current user
router.get(
    '/user/',
    async (req: Request, res: Response): Promise<void> => {
        const userId = getCurrentUserId(req);
        if (!userId) {
            sendErrResponse(res, 500, 'Invalid JWT format: missing user ID');
            return;
        }

        const user = await getUserById(userId);
        if (user instanceof Error) {
            sendErrResponse(res, 404, 'User not found');
            return;
        }

        const token = getJwtFromRequest(req);
        if (token === undefined) {
            sendErrResponse(res, 500, 'Unable to get token from request');
            return;
        }

        const responseBody: UserResponseBody = {
            user: {
                email: user.email,
                username: user.username,
                bio: user.bio,
                image: user.image,
                token: token,
            },
        };
        res.send(responseBody);
    }
);

// Update current user
interface UserUpdateReqBody {
    user: {
        email?: string;
        username?: string;
        password?: string;
        image?: string;
        bio?: string;
    };
}
router.put(
    '/user/',
    validator.validate({ body: UserUpdateSchema }),
    async (req: Request, res: Response): Promise<void> => {
        const userId = getCurrentUserId(req);
        if (userId === undefined) {
            sendErrResponse(res, 500, 'Could not get user ID');
            return;
        }
        const token = getJwtFromRequest(req);
        if (token === undefined) {
            sendErrResponse(res, 500, 'Could not get token');
            return;
        }

        const { user: reqUser }: UserUpdateReqBody = req.body;

        let { password, ...others } = reqUser;
        let updates: Partial<UserDbSchema> = others;

        // If password, add new hashed password and salt to update
        if (password) {
            const salt = newSalt(saltLength);
            const hashedPassword = hashPassword(password, salt);
            updates = {
                ...others,
                password_salt: salt,
                password_hash: hashedPassword,
            };
        }

        const updatedUser = await updateUser(userId, updates);
        if (updatedUser instanceof Error) {
            sendErrResponse(res, 500, updatedUser);
            return;
        }

        const body: UserResponseBody = {
            user: {
                email: updatedUser.email,
                username: updatedUser.username,
                bio: updatedUser.bio,
                image: updatedUser.image,
                token,
            },
        };

        res.send(body);
    }
);

export default router;
