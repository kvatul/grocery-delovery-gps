"use client";

import { getSocket } from "@/lib/socket";
import { IMessage } from "@/model/message.model";
import axios from "axios";
import { Loader, Send, Sparkle } from "lucide-react";
import { Schema } from "mongoose";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
type props = {
  orderId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  role: string;
};

const DeliveryChat = ({ orderId, senderId, role }: props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "hello",
    "thank you..",
    "Hi....",
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect((): any => {
    //if (role == "user") return;
    const socket = getSocket();
    socket.emit("join-chatroom", orderId);
    socket.on("send-message", (message) => {
      if (message.orderId == orderId) setMessages((prev) => [...prev, message]);
      //console.log(messages);
    });
    return () => socket.off("send-message");
  }, []);

  const sendMsg = () => {
    const socket = getSocket();
    const message = {
      orderId,
      senderId, //: deliveryBoyId,
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);

    setNewMessage("");
  };
  useEffect(() => {
    async function getMessages() {
      try {
        const result = await axios.post("/api/chat-message/get", { orderId });
        //console.log(result.data);
        setMessages(result.data);
      } catch (error) {}
    }
    getMessages();
  }, [orderId]);

  useEffect(() => {
    /*   if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } */
    //above cose same working
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const getSuggestions = async () => {
    try {
      // getting last message in case of delivery or user
      //const lastMessage = messages.filter((m) => m.senderId != senderId).at(-1);
      setLoading(true);
      const lastMessage = messages.at(-1);
      const result = await axios.post("/api/chat-message/ai-suggestions", {
        message: lastMessage?.text,
        role: role == "deliveryman" ? "delivery_boy" : "user",
      });
      console.log(result.data);
      setSuggestions(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3x1 shadow-1g border p-4 h-[430px] flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-gray-700 text-sm">
          Quick Replies
        </span>
        <motion.button
          disabled={loading}
          whileTap={{ scale: 0.9 }}
          className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200"
          onClick={getSuggestions}
        >
          <Sparkle size={14} />
          {loading ? (
            <Loader size={14} className="animate-spin" />
          ) : (
            "AI suggest"
          )}
        </motion.button>
      </div>
      <div className="flex gap-2 flex-wrap mb-3">
        {suggestions.map((s, i) => (
          <motion.div
            key={s}
            whileTap={{ scale: 0.92 }}
            className="px-3 py-1 text-xs bg-green-50 border border-green-2 rounded-full"
            onClick={() => setNewMessage(s)}
          >
            {s}
          </motion.div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3 " ref={scrollRef}>
        <AnimatePresence>
          {messages?.map((msg: IMessage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.senderId === senderId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-[75%] rounded-2xl shadow 
                  ${
                    msg.senderId === senderId
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
