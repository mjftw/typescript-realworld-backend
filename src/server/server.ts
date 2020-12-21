import express, { json, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import jwt from 'express-jwt';
import unless from 'express-unless';
import api_router from './routers/api';
import { schemaValidationError, unhandledErrors } from './routers/errors';
import { jtwHmacAlgorithm, jwtSecret } from '../config';
import { getJwtFromRequest, sendErrResponse } from './utils';

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
                { methods: ['GET'], url: '/' },
                { methods: ['POST'], url: '/api/users/login' },
                { methods: ['POST'], url: '/api/users' },
                { methods: ['GET'], url: /api\/profiles\/.+\//g },
                { methods: ['GET'], url: /api\/articles\/.+\//g },
            ],
        };

        const jwtOptions = {
            secret: jwtSecret,
            algorithms: [jtwHmacAlgorithm],
            requestProperty: 'auth',
            //TODO: issuer: <server_hostname> //Add when server can set hostname to ensure server signed JWT
            getToken: getJwtFromRequest,
        };

        // Verify user auth JWT and only continue if valid
        this.app.use(
            jwt(jwtOptions).unless(skipAuthOn),
            (err: Error, _req: Request, res: Response, next: NextFunction) => {
                if (err.name === 'UnauthorizedError') {
                    sendErrResponse(res, 401, `Unauthorized: ${err.message}`);
                    return;
                }
                next();
            }
        );

        // Parse user Id from JWT and add to request "auth" property even for
        // routes that don't require auth (specified in previous unless,
        // skipAuthOn). This is skipped if auth has already been parsed to
        // prevent unneeded operations.
        this.app.use(
            jwt({
                ...jwtOptions,
                credentialsRequired: false,
            }).unless((req) => req?.auth !== undefined)
        );
    }

    private routerMiddleware() {
        this.app.use('/api', api_router);
        this.app.get(/^\/$/, (_req, res) => res.send('It lives!')); // For testing - Check server is up
    }

    private errorHandlerMiddleware() {
        this.app.use(schemaValidationError);
        this.app.use(unhandledErrors);
    }
}

export default Server;
