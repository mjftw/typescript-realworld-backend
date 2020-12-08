import express, { json } from 'express';
import api_router from './routers/api';
import schemaValidationError from './routers/errors';

class Server {
    private app;

    constructor() {
        this.app = express();
        this.serverConfig();
        this.routerConfig();
        this.dbConnect();
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Express server running at http://localhost:${port}`);
        });
    }

    private serverConfig() {
        this.app.use(json());
    }

    private routerConfig() {
        this.app.use('/api', api_router);
        this.app.use('/', (_req, res) => res.send('It lives!'));
        this.app.use(schemaValidationError);
    }

    private dbConnect() {}
}

export default Server;
