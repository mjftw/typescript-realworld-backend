import { Response, Router } from 'express';
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
import { addUser, getUserByEmail, getUserByUsername } from '../../db/queries';
import { sendErrResponse } from '../utils';

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

export default router;
