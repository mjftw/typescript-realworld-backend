import express from 'express';
import test_router from './routers/test_router';

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

    private serverConfig() {}

    private routerConfig() {
        this.app.use('/db', test_router);
        this.app.use('/', (_req, res) => res.send('It lives!'));
    }

    private dbConnect() {}
}

export default Server;
