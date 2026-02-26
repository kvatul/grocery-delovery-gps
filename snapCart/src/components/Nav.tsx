"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart,
  CircleUserRound,
  Search,
  Package,
  LogOut,
  X,
  PlusCircle,
  Boxes,
  ClipboardCheck,
  SquareMenu,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
interface Iuser {
  id: string;
  name?: string;
  email: string;
  password?: string;
  mobile?: string;
  image?: string;
  role?: "user" | "admin" | "deliveryman";
}
const Nav = ({ user }: { user: Iuser }) => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileDropDown = useRef<HTMLDivElement>(null);
  const { cartData } = useSelector((state: RootState) => state.cart);
  const { userData } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    function handledClickOutside(e: MouseEvent) {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      )
        setOpen(false);
    }

    document.addEventListener("mousedown", handledClickOutside);
    return () => document.removeEventListener("mousedown", handledClickOutside);
  }, [profileDropDown]);

  const Sidebar = sidebarOpen
    ? createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="fixed inset-0 rounded h-full w-[50%] md:w-[30%] bg-linear-to-b from-green-800/90
             to-green-700/80 shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)] backdrop-blur-xl border border-black
             flex flex-col p-6 gap-5 text-white z-200 "
          >
            <div className="flex justify-center items-center gap-10 ">
              <h1 className="font-extrabold text-2xl  text-white/90   ">
                Admin Panel
              </h1>
              <X
                className="ml-10 h-7 w-7 text-red-600 cursor-pointer"
                onClick={() => setSidebarOpen((prev) => !prev)}
              />
            </div>
            <div className="flex items-center gap-5 border-gray-200 px-3 py-3">
              <div
                className="bg-green-100 rounded-full h-10 w-10 flex items-center justify-center 
                    shadow-md over-flow-hidden relative"
              >
                {user?.image ? (
                  <Image
                    alt="user"
                    src={user?.image}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <CircleUserRound />
                )}
              </div>
              <div>
                <div className="text-gray-100 font-semibold ">{user?.name}</div>
                <div className="text-gray-300 -mt-1 text-[12px] capitalize ">
                  {user.role}
                </div>
              </div>
            </div>

            <div className=" flex flex-col justify-center text-center gap-6 ">
              <Link
                href="/admin/addgrocery"
                className=" text-sm font-semibold bg-white text-green-600 rounded-full py-2 px-3 flex gap-2 items-center justify-center 
              shadow-lg shadow-black/70 hover:scale-105 hover:bg-green-100 transition-transform "
              >
                <PlusCircle className=" text-green-600 w-6 h-6 " />
                Add Groceries
              </Link>
              <Link
                href="/"
                className=" text-sm font-semibold bg-white text-green-600 rounded-full py-2 px-3 flex gap-2 items-center justify-center 
              shadow-lg shadow-black/70 hover:scale-105 hover:bg-green-100 transition-transform "
              >
                <Boxes className=" text-green-600 w-6 h-6 " />
                View Groceries
              </Link>
              <Link
                href="/admin/manage-orders"
                className=" text-sm font-semibold bg-white text-green-600 rounded-full py-2 px-3 flex gap-2 items-center justify-center 
              shadow-lg shadow-black/70 hover:scale-105 hover:bg-green-100 transition-transform "
              >
                <ClipboardCheck className=" text-green-600 w-6 h-6 " />
                Manage Orders
              </Link>
            </div>

            <div
              className="  text-sm font-semibold bg-white text-green-600 rounded-full py-2 px-3 flex gap-2 items-center justify-center 
                shadow-lg shadow-black/70 hover:scale-105 hover:bg-green-100 transition-transform "
            >
              <LogOut className="h-5 w-5" />
              LogOut
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <div
      className="w-[95%] fixed top-2 left-1/2 -translate-x-1/2 bg-linear-to-r  from-green-500  to-green-700 green-600
          rounded-2xl shadow-lg shadow-black/30 flex items-center justify-between h-20 px-4 md:px-8 z-50 "
    >
      <Link
        href="/"
        className="text-white font-extrabold text-2xl sm:text-3xl hover:scale-105 transition-transform tracking-wide"
      >
        SnapCart
      </Link>

      {user.role == "user" && (
        <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md">
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            placeholder="Search groceries ..."
            className="w-full text-gray-700 outline-none placeholder-gray-300 "
            type="search"
          />
        </form>
      )}
      <div className="flex gap-3 md:gap-6 items-center justify-center relative">
        {user.role == "user" && (
          <div
            className=" bg-white rounded-full w-11 h-11 flex justify-center items-center md:hidden"
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <Search className="text-green-500 h-5 w-5" />
          </div>
        )}

        {user.role == "admin" ? (
          <div
            className=" bg-white rounded-full w-11 h-11 flex justify-center items-center md:hidden"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <SquareMenu className="w-5 h-5  text-green-500" />
          </div>
        ) : (
          ""
        )}

        {user.role == "admin" && (
          <>
            <div className=" hidden md:flex justify-center text-center gap-4 ">
              <Link
                href="/admin/addgrocery"
                className=" text-sm font-semibold bg-white text-green-600 rounded-full py-2 px-3 flex gap-2 items-center justify-center 
              shadow-lg shadow-black/70 hover:scale-105 hover:bg-green-100 transition-transform "
              >
                <PlusCircle className=" text-green-600 w-6 h-6 " />
                Add Groceries
              </Link>
              <Link
                href="/"
                className=" text-sm font-semibold bg-white text-green-600 rounded-full py-2 px-3 flex gap-2 items-center justify-center 
              shadow-lg shadow-black/70 hover:scale-105 hover:bg-green-100 transition-transform "
              >
                <Boxes className=" text-green-600 w-6 h-6 " />
                View Groceries
              </Link>
              <Link
                href="/admin/manage-orders"
                className=" text-sm font-semibold bg-white text-green-600 rounded-full py-2 px-3 flex gap-2 items-center justify-center 
              shadow-lg shadow-black/70 hover:scale-105 hover:bg-green-100 transition-transform "
              >
                <ClipboardCheck className=" text-green-600 w-6 h-6 " />
                Manage Orders
              </Link>
            </div>
          </>
        )}

        {user.role == "user" && (
          <Link
            href="/user/cart"
            className="relative bg-white rounded-full h-11 w-11 flex items-center justify-center shadow-md hover:scale-105 transition-transform "
          >
            <ShoppingCart className=" text-green-600 w-6 h-6" />
            <span
              className="absolute bg-red-600 text-white text-xs font-semibold shadow w-5 h-5 
                           rounded-full -top-1.5 -right-1 flex items-center justify-center"
            >
              {cartData.length}
            </span>
          </Link>
        )}

        <div ref={profileDropDown}>
          <div
            className="bg-white rounded-full h-11 w-11 flex items-center justify-center shadow-md 
            over-flow-hidden hover:scale-105 transition-transform relative"
            onClick={() => setOpen((prev) => !prev)}
          >
            {user?.image ? (
              <Image
                alt="user"
                src={user?.image}
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <CircleUserRound />
            )}

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 1 },
                  }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute bg-white border border-gray-200 rounded-2xl shadow-md w-50 mt-3 top-8 right-0 p-3 z-999  "
                >
                  <div className="flex items-center gap-5 border-gray-200 px-3 py-3">
                    <div
                      className="bg-green-100 rounded-full h-10 w-10 flex items-center justify-center 
                    shadow-md over-flow-hidden relative"
                    >
                      {user?.image ? (
                        <Image
                          alt="user"
                          src={user?.image}
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <CircleUserRound />
                      )}
                    </div>
                    <div>
                      <div className="text-gray-800 font-semibold ">
                        {user?.name}
                      </div>
                      <div className="text-gray-400 -mt-2 text-[12px] capitalize ">
                        {user.role}
                      </div>
                    </div>
                  </div>
                  {user.role == "user" && (
                    <Link
                      href="/user/myorder"
                      className="flex items-center gap-2 px-3 py-3 text-gray-700 hover:bg-green-50 rounded-lg
                   font-medium  "
                      onClick={() => setOpen(false)}
                    >
                      <Package className="text-green-500 w-5 h-5 " />
                      My orders
                    </Link>
                  )}
                  <button
                    className="flex items-center gap-2 px-3 py-3 text-gray-700 w-full hover:bg-red-50 rounded-lg
                   font-medium"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 1 },
                  }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="fixed top-24 w-[90%] left-1/2 -translate-x-1/2 border border-green-200  bg-white rounded-full z-40 flex items-center
                  shadow-lg px-2 py-2 "
                >
                  <Search className="w-5 h-5 text-gray-500 mr-2" />
                  <form action="" className="grow">
                    <input
                      type="text"
                      placeholder="Search groceries.."
                      className="  text-gray-500  placeholder-gray-300 px-1 outline-none "
                    />
                  </form>
                  <button
                    className="w-5 h-5 text-red-500 -mt-1"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X className="h-5 w-5 text-red-700" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {Sidebar}
      </div>
    </div>
  );
};

export default Nav;
