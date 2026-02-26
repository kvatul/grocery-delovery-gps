import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const getSocket = () => {
  //console.log("localhost", process.env.NEXT_SOCKET_URL);
  if (!socket) {
    socket = io("http://localhost:4000"); //process.env.NEXT_SOCKET_URL

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
  }
  return socket;
};
