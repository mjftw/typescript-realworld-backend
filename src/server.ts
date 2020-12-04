import express from "express";
import test_router from "./routers/test_router";

class Server {
    private app;

    constructor() {
        this.app = express();
        this.serverConfig();
        this.routerConfig();
        this.dbConnect();
    }

    public start(port: number) {
        this.app.listen(port, () => {
            console.log(`Express server running at http://localhost:${port}`);
        });
    }

    private serverConfig() {}

    private routerConfig() {
        this.app.use("/", (_req, res) => res.send("It lives!"));
        this.app.use("/api", test_router);
    }

    private dbConnect() {}
}

export default Server;
