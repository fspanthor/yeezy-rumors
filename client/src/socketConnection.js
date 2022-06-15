import { serverAddress } from "./serverAddress";
const { io } = require("socket.io-client");

export const socket = io(serverAddress, { transports: ["websocket"] });
