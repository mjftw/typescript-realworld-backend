import Server from './server/server';
import { appPort } from './config';

const server = new Server();

server.start(appPort);
