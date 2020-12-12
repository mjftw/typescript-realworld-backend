import { JwtAuth } from './common/types';

declare global {
    // Extend the Express Request interface to allow the 'user' property added
    // by the express-jwt middleware.
    namespace Express {
        interface Request {
            auth?: JwtAuth;
        }
    }
}
