"use client";

import { getSocket } from "@/lib/socket";
import { IMessage } from "@/model/message.model";
import axios from "axios";
import { Send } from "lucide-react";
import { Schema } from "mongoose";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
type props = {
  orderId: Schema.Types.ObjectId;
  deliveryBoyId: Schema.Types.ObjectId;
  role: string;
};

const DeliveryChat = ({ orderId, deliveryBoyId, role }: props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-chatroom", orderId);
  }, []);

  const sendMsg = () => {
    const socket = getSocket();
    const message = {
      orderId,
      senderId: deliveryBoyId,
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);
    socket.on("send-message", (message) => {
      if (message.orderId == orderId) setMessages((prev) => [...prev, message]);
    });

    setNewMessage("");
  };
  useEffect(() => {
    async function getMessages() {
      try {
        const result = await axios.post("api/chat-message/get", { orderId });
        console.log(result.data);
        setMessages(result.data);
      } catch (error) {}
    }
    getMessages();
  }, [orderId]);

  return (
    <div className="bg-white rounded-3x1 shadow-1g border p-4 h-[430px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        <AnimatePresence>
          {messages?.map((msg: IMessage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.senderId === deliveryBoyId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                  ${
                    msg.senderId === deliveryBoyId
                      ? "bg-green-600 text-white rounded-br-none "
                      : "bg-gray-100 text-gray-900 rounded-bl-none "
                  } `}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          type="text"
          placeholder="Type a Message..."
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-green-600 p-3 hover:bg-green-700 rounded-full text-white"
          onClick={sendMsg}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
export default DeliveryChat;
