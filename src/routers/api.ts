import { Request, Response, Router } from 'express';
import { Validator } from 'express-json-validator-middleware';
import { loginUser } from '../resources/users/db';
import { UserLoginSchema } from '../resources/users/schemas';
import { UserAuth, UserLogin } from '../resources/users/types';

const router = Router();
const validator = new Validator({ allErrors: true });

router.post(
    '/users/login/',
    validator.validate({
        body: UserLoginSchema,
    }),
    (req: Request, res: Response) => {
        // Valid user
        const userLogin: UserLogin = req.body;
        const userAuth: UserAuth = loginUser(userLogin);

        res.send(userAuth);

        //TODO:
        // DONE: 1. Validate request body
        // 2. Check if user no exists, error if so
        // 3. Generate hash of password
        // 4. Add new user to database (including hashed password)
        // 5. Generate JWT auth token
        // 6. Send response with new user
    }
);

export default router;
