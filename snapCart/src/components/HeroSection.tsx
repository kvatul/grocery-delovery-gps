"use client";
import { useState, useEffect } from "react";
import { Leaf, Truck, Smartphone, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
//import { useSelector } from "react-redux";
//import { RootState } from "@/redux/store";
//import { getSocket } from "@/lib/socket";

const HeroSection = () => {
  // accessing date from store
  // const { userData } = useSelector((state: RootState) => state.user);
  //console.log("userData", userData);

  const sliders = [
    {
      id: 1,
      Icon: (
        <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg " />
      ),
      title: "Fresh Organic Groceries🍅 ",
      subtitle:
        "Farm-fresh fruits, vegitables, and daily essentials delivered to you",
      btntext: "Shop Now",
      bg: "https://plus.unsplash.com/premium_photo-1663012860167-220d9d9c8aca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      Icon: (
        <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-lg " />
      ),
      title: "Fast and Reliable Delivery🏍️ ",
      subtitle:
        "We ensure your groceries will delivered at your doorstep in no time",
      btntext: "Order Now",
      bg: "https://images.unsplash.com/photo-1648394794449-5dbe63f6a8b5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      Icon: (
        <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg " />
      ),
      title: "Shop Anytime Anywhere📱 ",
      subtitle: "Easy and seamlees online grocery shopping exprrience",
      btntext: "Get Started",
      bg: "https://plus.unsplash.com/premium_photo-1742244034661-ca8541f64626?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      //setCurrent((prev) => (prev < sliders.length - 1 ? prev + 1 : 0));
      setCurrent((prev) => (prev + 1) % sliders.length); // same as above logic for curerent value
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[98%] mx-auto h-[80vh] mt-26 rounded-3xl overflow-hidden shadow-2xl   ">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          exit={{ opacity: 0 }}
          className=" absolute inset-0"
        >
          <Image
            src={sliders[current].bg}
            fill
            alt="slide"
            priority
            className="oject-cover"
          />
          <div className="absolute inset-0 bg-black/40 back-blur-[1px]" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 flex text-center justify-center items-center text-white">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center gap-4 max-w-3xl"
        >
          <div className="bg-white/10 rounded-full p-6 shadow-lg backdrop-blur-md">
            {sliders[current].Icon}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg  ">
            {sliders[current].title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl -mt-4">
            {sliders[current].subtitle}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white text-green-700 rounded-full font-bold shadow-lg py-3 px-8 
          flex items-center gap-2 hover:bg-green-200 transition-all duration-200"
          >
            <ShoppingBasket className=" w-5 h-5 " />
            {sliders[current].btntext}
          </motion.button>
        </motion.div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {sliders.map((slide, index) => (
            <button
              key={index}
              className={`bg-gray rounded-full w-3 h-3
              ${slide.id === sliders[current].id ? "bg-white w-6" : "bg-white/50"}`}
              onClick={() => {
                setCurrent(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
