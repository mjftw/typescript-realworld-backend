import Server from "./server";

const port = parseInt(process.env.SERVER_PORT || "4000");

const server = new Server();

server.start(port);
