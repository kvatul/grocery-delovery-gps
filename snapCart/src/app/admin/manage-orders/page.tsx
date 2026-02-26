"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { IOrder } from "@/model/order.model";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, PackageSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserOrderCard from "@/components/UserOrderCard";
import { getSocket } from "@/lib/socket";

const ManagerOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    async function getOrder() {
      setLoading(true);
      try {
        const result = await axios.get("/api/admin/getorders");
        console.log(result.data);
        setOrders(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getOrder();
  }, []);

  useEffect((): any => {
    try {
      const socket = getSocket();
      socket?.on("new-order", (order) => {
        setOrders((prev) => [order, ...prev]);
      });
      return () => socket.off("new-order");
    } catch (error) {}
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[90vh] ">
        <h1 className=" text-center  p-5 px-20  text-gray-700  text-3xl shadow-lg border border-gray-400 rounded-full ">
          {" "}
          Loading Your Order...
        </h1>
      </div>
    );

  return (
    <div className="bg-linear-to-b from-white to-gray-100 min-h-screen w-full">
      <div className="max-w-3x1 mx-auto px-4 pt-16 pb-10 relative">
        <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
          <div className="max-w-3x1 mx-auto flex items-center gap-4 px-10 py-3">
            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
              onClick={() => router.push("/")}
            >
              <ArrowLeft size={24} className="text-green-700" />
            </button>
            <h1 className="text-center text-xl font-bold text-gray-800">
              Manage Orders
            </h1>
          </div>
        </div>
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-20 flex flex-col justify-center items-center text-center"
          >
            <PackageSearch />
            <h2 className="text-xl font-bold text-gray-700 ">No Order Found</h2>
            <p>Start Shopping to view your orders here</p>
            <Link
              href={"/"}
              className=" top-5 left-5 bg-green-600 rounded-full px-4 py-1 text-white font-bold
               cursor-pointer flex item-center gap-2 shadow-md hover:scale-105 transition-all duration-200 "
            >
              <span className="hidden md:flex">Continue Shopping</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center items-center w-full px-10 "
          >
            {orders.length > 0 &&
              orders.map((order, index) => (
                <UserOrderCard key={index} order={order} role="admin" />
              ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ManagerOrders;
