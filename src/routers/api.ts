import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { loginUser, newAuthJwt } from '../common/auth';
import { UserLoginSchema, UserRegisterSchema } from '../json_schemas/user';
import { User, UserAuth, UserLogin } from '../common/types';
import { jwtSecret } from '../config';

const router = Router();
const validator = new Validator({ allErrors: true });

router.post(
    '/users/',
    validator.validate({ body: UserRegisterSchema }),
    async (_req: Request, _res: Response) => {
        console.log('Valid');
    }
);

router.post(
    '/users/login/',
    validator.validate({
        body: UserLoginSchema,
    }),
    async (req: Request, res: Response): Promise<void> => {
        // Valid user
        const userLogin: UserLogin = req.body.user;
        console.log(userLogin);

        const maybeUser: User | null = await loginUser(userLogin);
        if (maybeUser === null) {
            //NOTE: This could be invalid auth or nonexistent user
            res.status(401).send({
                errors: 'Incorrect email address or password',
            });
            return;
        }
        const user = maybeUser;
        const token = newAuthJwt(user.id, jwtSecret);

        const mockUser: UserAuth = {
            email: user.email,
            username: user.username,
            bio: user.bio,
            image: user.image,
            token: token,
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
