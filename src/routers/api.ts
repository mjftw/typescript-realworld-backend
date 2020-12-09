import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { loginUser } from '../common/auth';
import { UserLoginSchema } from '../json_schemas/user';
import { User, UserAuth, UserLogin } from '../common/types';
import { types } from 'util';

const router = Router();
const validator = new Validator({ allErrors: true });

router.post(
    '/users/login/',
    validator.validate({
        body: UserLoginSchema,
    }),
    async (req: Request, res: Response) => {
        // Valid user
        const userLogin: UserLogin = req.body.user;
        console.log(userLogin);

        const maybeUser: User | Error = await loginUser(userLogin);
        if (types.isNativeError(maybeUser)) {
            //NOTE: This could be invalid auth or nonexistent user
            res.status(401).send('Incorrect email address or password');
            return;
        }
        1;
        const user = maybeUser;

        const mockUser: UserAuth = {
            email: user.email,
            username: user.username,
            bio: user.bio,
            image: user.image,
            token: 'Not a real token',
        };

        res.send(mockUser);

        //TODO:
        // 1. Login user
        // 2. Generate JWT auth token
        // 3. Populate and return UserAuth
        // 4. Send response with new user
    }
);

export default router;
