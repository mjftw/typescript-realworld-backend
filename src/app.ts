import Server from "./server";

// Change port mapping in docker to present on different port
const port = 4000;

const server = new Server();

server.start(port);
