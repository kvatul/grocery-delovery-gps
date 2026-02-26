"use client";
import { ShoppingBasket, Bike } from "lucide-react";
import { motion } from "motion/react";
type propType = {
  nextstep: (n: number) => void;
};

const Welcome = ({ nextstep }: propType) => {
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen p-6 ">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 1 },
        }}
      >
        <div className="flex justify-center items-center ">
          <ShoppingBasket size={30} className="text-green-600 " />
          <h1 className="ml-3 text-3xl text-green-600 font-bold">Snapcart</h1>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 1, delay: 0.3 },
        }}
        className="w-100 mt-10 text-gray-400"
      >
        Your one-stop destination for fresh groceries , organic products, and
        daily essential delivered right to your doorstep
      </motion.p>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 1, delay: 0.5 },
        }}
        className="mt-5 flex justify-center items-center gap-10"
      >
        <ShoppingBasket size={100} className="text-green-600 " />
        <Bike size={100} className="text-orange-600 " />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 1, delay: 0.7 },
        }}
      >
        <button
          className="bg-green-300 w-25 p-1 mt-10 rounded-lg "
          onClick={() => nextstep(2)}
        >
          Next -&gt;
        </button>
      </motion.div>
    </div>
  );
};

export default Welcome;
