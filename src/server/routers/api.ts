import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import {
    createUserAuth,
    hashPassword,
    loginUser,
    newSalt,
} from '../../common/auth';
import { UserLoginSchema, UserRegisterSchema } from '../../json_schemas/user';
import { User, UserLogin, UserRegister } from '../../common/types';
import { saltLength } from '../../config';
import { addUser, getUserByEmail, getUserByUsername } from '../../db/queries';
import { errResponse } from '../utils';

const router = Router();
const validator = new Validator({ allErrors: true });

// Register new user
router.post(
    '/users/',
    validator.validate({ body: UserRegisterSchema }),
    async (req: Request, res: Response) => {
        // Valid user register data at this point
        const signupRequest: UserRegister = req.body.user;

        if ((await getUserByEmail(signupRequest.email)) !== null) {
            res.status(403).send(errResponse('Email address taken'));
            return;
        }
        if ((await getUserByUsername(signupRequest.username)) !== null) {
            res.status(403).send(errResponse('Username taken'));
            return;
        }

        const salt = newSalt(saltLength);
        const hashedPassword = hashPassword(signupRequest.password, salt);

        const maybeUser = await addUser(
            signupRequest.username,
            signupRequest.email,
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
router.post(
    '/users/login/',
    validator.validate({
        body: UserLoginSchema,
    }),
    async (req: Request, res: Response): Promise<void> => {
        // Valid user at this point
        const userLogin: UserLogin = req.body.user;

        const maybeUser: User | null = await loginUser(userLogin);
        if (maybeUser === null) {
            //NOTE: This could be invalid auth or nonexistent user
            res.status(401).send(
                errResponse('Incorrect email address or password')
            );
            return;
        }

        const auth = createUserAuth(maybeUser);
        res.send({ user: auth });
    }
);

export default router;
