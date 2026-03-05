import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
export const getSocket = () => {
  //console.log("localhost", process.env.NEXT_SOCKET_URL);
  if (!socket) {
    //socket = io("http://localhost:4000"); //process.env.NEXT_SOCKET_URL
    // socket = io(process.env.NEXT_SOCKET_URL); //process.env.NEXT_SOCKET_URL
    const socket = io("https://socketioserver-at8m.onrender.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
  }
  return socket;
};
