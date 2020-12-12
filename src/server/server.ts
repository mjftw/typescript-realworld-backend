import express, { json, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import jwt from 'express-jwt';
import unless from 'express-unless';
import api_router from './routers/api';
import { schemaValidationError, unhandledErrors } from './routers/errors';
import { jtwHmacAlgorithm, jwtSecret } from '../config';
import { errResponse, getJwtFromRequest } from './utils';

class Server {
    private app;

    constructor() {
        this.app = express();
        this.authMiddleware();
        this.configMiddleware();
        this.routerMiddleware();
        this.errorHandlerMiddleware();
    }

    //TODO: Allow setting hostname from config (environment variable)
    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Express server running at http://localhost:${port}`);
        });
    }

    private configMiddleware() {
        const logger = morgan('dev');
        this.app.use(logger);
        this.app.use(json());
    }

    private authMiddleware() {
        // Do not require user auth JWT on these routes
        const skipAuthOn: unless.Options = {
            path: [
                { methods: ['GET'], url: '/' }, // For testing - Check server is up
                { methods: ['POST'], url: '/api/users/login' },
                { methods: ['POST'], url: '/api/users' },
            ],
        };

        // Verify user auth JWT and a user property to requests
        this.app.use(
            jwt({
                secret: jwtSecret,
                algorithms: [jtwHmacAlgorithm],
                requestProperty: 'auth',
                //TODO: issuer: <server_hostname> //Add when server can set hostname to ensure server signed JWT
                getToken: getJwtFromRequest,
            }).unless(skipAuthOn),
            (err: Error, _req: Request, res: Response, next: NextFunction) => {
                if (err.name === 'UnauthorizedError') {
                    res.status(401).send(
                        errResponse(`Unauthorized: ${err.message}`)
                    );
                    return;
                }
                next();
            }
        );
    }

    private routerMiddleware() {
        this.app.use('/api', api_router);
        this.app.use('/', (_req, res) => res.send('It lives!'));
    }

    private errorHandlerMiddleware() {
        this.app.use(schemaValidationError);
        this.app.use(unhandledErrors);
    }
}

export default Server;
