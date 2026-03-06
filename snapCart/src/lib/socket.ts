import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const getSocket = () => {
  if (!socket) {
    // socket = io(process.env.NEXT_PUBLIC_SOCKET_URL); //"https://socketioserver-at8m.onrender.com"
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
  }
  return socket;
};
