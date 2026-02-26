import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import axios from "axios";

const app = express();
app.use(express.json()); // for parsing request data
dotenv.config();
const port = process.env.PORT || 5000;
const server = http.createServer(app);

const socketIo = new Server(server, {
  cors: { origin: process.env.NEXT_BASE_URL },
});

socketIo.on("connection", (socket) => {
  //console.log("user connected", socket.id);
  //socket.on("identity", (userId) => console.log(userId));
  socket.on("identity", async (userId) => {
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {
      userId,
      socketId: socket.id,
    });
    console.log(userId);
  });

  socket.on("update-location", async ({ userId, latitude, longitude }) => {
    //console.log(userId, latitude, longitude);
    const location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/updatelocation`, {
      userId,
      location,
    });
    socketIo.emit("update-deliveryBoy-location", {
      userId,
      location,
    });
  });

  socket.on("join-chatroom", (orderId) => {
    console.log("join-chatroom", orderId);
    socket.join(orderId);
  });

  socket.on("send-message", async (message) => {
    //console.log("message", message);
    await axios.post(
      `${process.env.NEXT_BASE_URL}/api/chat-message/save`,
      message,
    );
    socketIo.to(message.orderId).emit("send-message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.post("/notify", (req, res) => {
  const { event, data, socketId } = req.body;
  // console.log("event, data,socketId:", event, data, socketId);
  if (socketId) {
    socketIo.to(socketId).emit(event, data);
  } else {
    socketIo.emit(event, data);
  }
  return res.status(200).json({ success: true });
});

server.listen(port, () => {
  console.log(`server is running port ${port} `);
});
