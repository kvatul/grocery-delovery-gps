"use client";
import { motion } from "motion/react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  MinusCircle,
  Trash2,
  ShoppingCart,
  ShoppingBasket,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCart,
  decQuantity,
  incQuantity,
  removeItem,
} from "@/redux/cartSlice";
import { RootState } from "@/redux/store";
import Link from "next/link";

import mongoose from "mongoose";
import { useRouter } from "next/navigation";

interface Igrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image?: string;
}

const UseCart = () => {
  const { cartData, subTotal, deliverFee, finalTotal } = useSelector(
    (state: RootState) => state.cart,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <div className="w-[95%] sm:w-[90%] md:w-[75%] mx-auto mb-24 mt-10  ">
      <Link
        href={"/"}
        className="absolute top-5 left-5 bg-white/70 rounded-full px-4 py-1 text-green-600 font-bold
         cursor-pointer flex item-center gap-2 shadow-md hover:scale-105 transition-all duration-200 "
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="hidden md:flex">Back to Home</span>
      </Link>
      <motion.h2
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className=" ml-3 text-2xl text-green-600 font-bold text-center shadow-md rounded-xl mt-20 p-1 mb-10 "
      >
        🛒 Your Shopping Cart
      </motion.h2>

      {cartData.length == 0 ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-center gap-5 py-10 mt-20 bg-white rounded-2xl shadow-lg"
        >
          <ShoppingBasket />
          <p>Your Cart is empty, Add some groceries to continue shopping</p>
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
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 "
        >
          <div className=" bg-white sm:col-span-2">
            {cartData.map((item: Igrocery) => (
              <div
                key={item._id.toString()}
                className="flex justify-between px-5 py-2 items-center mb-2 gap-2 border border-black shadow-md rounded-lg"
              >
                <div className="flex items-center gap-5 ">
                  <Image
                    src={item.image as string}
                    alt="item"
                    width={75}
                    height={75}
                    className="rounded-lg"
                  />
                  <div className="flex flex-col">
                    <p className="text-xl font-bold">{item.name}</p>
                    <p className="text-xs text-gray-600 -mt-1">{item.unit}</p>
                    <p className=" text-lg text-green-700 mt-4 font-semibold">
                      {" "}
                      ₹{item.price}
                    </p>
                  </div>
                </div>
                <div className="flex  items-center gap-3 ">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="py-1 nb-2 flex justify-center items-center rounded-full bg-green-50 border 
            border-green-400 px-2 gap-2"
                  >
                    <PlusCircle
                      className="w-6 h-6 font-extrabold bg-white text-green-700 cursor-pointer hover:scale-110 duration-200"
                      onClick={() => dispatch(incQuantity(item._id))}
                    />
                    <span className="min-w-12 bg-green-600 text-white text-center rounded-full ">
                      {item.quantity}
                    </span>
                    <MinusCircle
                      className="w-6 h-6 font-extrabold bg-white text-green-700 cursor-pointer hover:scale-110 duration-200"
                      onClick={() => dispatch(decQuantity(item._id))}
                    />
                  </motion.div>
                  <Trash2
                    className="w-7 h-7 text-red-400"
                    onClick={() => dispatch(removeItem(item._id))}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white  col-span-1 p-5 rounded-xl shadow-lg">
            <div className="flex flex-col  ">
              <p className="text-xl font-bold mb-3">Order Summary</p>
              <div className="flex justify-between text-xs text-gray-600 mb-1 ">
                <span className=" ">Subtotal:</span>
                <span className=" ">₹{subTotal}</span>
              </div>

              <div className="flex justify-between text-xs text-gray-600 mb-1 ">
                <span className=" ">Delivery Fee:</span>
                <span className=" ">₹{deliverFee}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg text-green-500 font-bold mt-1  ">
                <span className=" ">Total:</span>
                <span className=" ">₹{finalTotal}</span>
              </div>
              <motion.button
                className={` py-1 my-3 w-full font-semibold flex justify-center gap-1 bg-green-500 hover:bg-green-700
             text-white cursor-pointer rounded-full  transition-all duration-200 shadow-md `}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push("/user/checkout")}
              >
                <ShoppingCart className="" />
                Proceed to Checkout
              </motion.button>
              <button
                className="text-red-300 cursor-pointer rounded-full bg-gray-200 shadow-md py-1 mb-3"
                onClick={() => {
                  dispatch(removeCart());
                  router.push("/");
                }}
              >
                Delete Cart
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UseCart;
