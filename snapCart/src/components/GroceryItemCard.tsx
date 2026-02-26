"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { MinusCircle, PlusCircle, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decQuantity, incQuantity } from "@/redux/cartSlice";
import { RootState } from "@/redux/store";
import mongoose from "mongoose";

interface Igrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image?: string;
}
const GroceryItemCard = ({ item }: { item: Igrocery }) => {
  const dispatch = useDispatch();
  //console.log(item._id);
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((citem) => citem._id === item._id);

  //console.log(cartItem);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false, amount: 0.5 }}
      className="relative mt-5 bg-white rounded-lg  shadow-md hover:shadow-xl transition-all duration-200
                   overflow-hidden border border-gray-200  flex flex-col "
    >
      <div className="relative w-[95%] aspect-4/3 mx-auto mt-1 hover:scale-105 ">
        <Image
          src={item?.image as string}
          alt={item.name}
          fill
          className="rounded-lg w-[50%]"
        />
        <div
          className="absolute  inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 
        hover:opacity-100 transition-all duration-200 rounded-lg  "
        />
      </div>
      <div className="px-3">
        <p className="text-xs text-gray-500  font-medium mb-1">
          {item.category}
        </p>
        <h3 className="text-base text-gray-900  mt-2 "> {item.name} </h3>

        <div className="flex items-center justify-between">
          <span className="px-2 py-1 rounded-ful rounded-full bg-gray-100">
            {item.unit}
          </span>
          <span className="text-green-700 text-lg font-semibold">
            ₹{item.price}
          </span>
        </div>

        {!cartItem ? (
          <motion.button
            className={` py-1 mb-2 w-full font-semibold flex justify-center gap-1 bg-green-500 hover:bg-green-700
             text-white cursor-pointer rounded-full  transition-all duration-200 shadow-md `}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
          >
            <ShoppingCart className="" />
            Add to Cart
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-1 nb-2 flex justify-center items-center rounded-full bg-green-50 border 
            border-green-400 px-4  gap-10"
          >
            <PlusCircle
              className="w-6 h-6 font-extrabold bg-white text-green-700 cursor-pointer hover:scale-110 duration-200"
              onClick={() => dispatch(incQuantity(item._id))}
            />
            <span className="min-w-15 bg-green-600 text-white text-center rounded-full ">
              {cartItem.quantity}
            </span>
            <MinusCircle
              className="w-6 h-6 font-extrabold bg-white text-green-700 cursor-pointer hover:scale-110 duration-200"
              onClick={() => dispatch(decQuantity(item._id))}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GroceryItemCard;
