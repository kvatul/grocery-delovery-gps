"use client";
import React from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle, Package } from "lucide-react";
import Link from "next/link";

const OrderSuccess = () => {
  return (
    <div
      className="flex flex-col min-h-[80vh] justify-center items-center  text-center 
       bg-linear-to-b from-green-50 to-white relative "
    >
      <motion.div
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
        className="relative "
      >
        <CheckCircle className="text-green-700 h-15 w-15" />
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="w-full h-full rounded-full bg-green-300 blur-2xl" />
        </motion.div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl mt-5 text-green-700 font-bold"
      >
        Order Placed Successfully
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="test-gray-700 text-xs md:text-base max-w-md "
      >
        Thank your for shopping with us, Your order has been placed and is being
        processed you can track it progress{" "}
        <span className="font-semibold text-green-700">My Orders </span>section.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: [1], y: [0, -10, 0] }}
        transition={{
          delay: 1,
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        className=" mt-10 "
      >
        <Package className="text-green-700 h-15 w-15 md:w-20 md:h-20  " />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: [1], y: [0] }}
        transition={{
          duration: 0.5,
        }}
        className=" mt-5 "
      >
        <Link
          href={"/user/myorder"}
          className="flex justify-center items-center px-3 py-1 rounded-full bg-green-600 text-white hover:bg-green-700 hover:scale-0.9 transition-all duration--200 "
        >
          Go to My Order Page <ArrowRight />
        </Link>
      </motion.div>
      <motion.div>
        <div className="absolute top-20 left-[10%] h-2 w-2 rounded-full bg-green-400 animate-bounce "></div>
        <div className="absolute top-32 left-[30%] h-2 w-2 rounded-full bg-green-400 animate-pulse "></div>
        <div className="absolute top-24 left-[50%] h-2 w-2 rounded-full bg-green-400 animate-bounce "></div>
        <div className="absolute top-40 left-[70%] h-2 w-2 rounded-full bg-green-400 animate-pulse "></div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
