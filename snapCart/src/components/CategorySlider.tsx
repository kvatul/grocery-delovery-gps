"use client";
import { useEffect, useRef, useState } from "react";
import {
  Apple,
  Milk,
  Wheat,
  Cookie,
  Flame,
  Coffee,
  Heart,
  Home,
  Box,
  Baby,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

const CategorySlider = () => {
  const categories = [
    { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
    { id: 2, name: "Dairy & Eggs", icon: Milk, color: "bg-yellow-100" },
    { id: 3, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },
    { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },
    { id: 5, name: "Spices & Masalas", icon: Flame, color: "bg-red-100" },
    { id: 6, name: "Beverages & Drinks", icon: Coffee, color: "bg-blue-100" },
    { id: 7, name: "Personal Care", icon: Heart, color: "bg-purple-100" },
    { id: 8, name: "Household Essentials", icon: Home, color: "bg-li-100" },
    { id: 9, name: "Instant & Packaged Food", icon: Box, color: "bg-teal-100" },
    { id: 10, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100" },
  ];
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction == "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const checkScroll = () => {
    //alert("1");
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    //alert("1");
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", checkScroll);
    return () => removeEventListener("scroll", checkScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 5)
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      else scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false, amount: 0.5 }}
      className="w-[90%] md:w-[75%] mx-auto mt-10 relative "
    >
      <h2 className="ml-3 text-2xl text-green-600 font-bold text-center shadow-md rounded-xl p-1  ">
        🛒 Shop by Category
      </h2>
      {showLeft && (
        <button
          className="absolute left-0 top-1/2 -translate-y1/2 bg-white shadow-lg  hover:bg-green-100
            w-10 h-10 rounded-full  flex justify-center items-center z-10 "
          onClick={() => scroll("left")}
        >
          <ChevronLeft className=" w-5 h-5 text-green-700" />
        </button>
      )}
      <div
        className="flex gap-6 overflow-x-auto mt-5 px-10 pb-4 scrollbar-hide scroll-smooth "
        ref={scrollRef}
      >
        {categories.map((catg) => {
          const Icon = catg.icon;
          return (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              key={catg.id}
              className={` min-w-[130px] md:min-w-[160px]  flex flex-col 
                justify-center gap-3 items-center rounded-2xl  transition-all shadow-md hover:shadow-xl
                cursor-pointer ${catg.color} }`}
            >
              <div className={`flex flex-col justify-center items-center p-4 `}>
                <Icon className=" h-5 w-5 text-green-700 mb-3" />
                <p className=" text-center text-sm md:text-base font-semibold text-gray-700">
                  {catg.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {showRight && (
        <button
          className="absolute right-0 top-1/2 -translate-y1/2 bg-white shadow-lg  hover:bg-green-100
            w-10 h-10 rounded-full  flex justify-center items-center z-11 "
          onClick={() => scroll("right")}
        >
          <ChevronRight className=" w-5 h-5 text-green-700" />
        </button>
      )}
    </motion.div>
  );
};

export default CategorySlider;
