"use client";

import {
  UserRound,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  Leaf,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import googleImage from "@/assets/google.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
type propType = {
  nextstep: (n: number) => void;
};
const RegisterForm = ({ nextstep }: propType) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showpasswd, setShowpasswd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  async function handleRegister(e: React.FormEvent) {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setLoading(false);
      router.push("/login");
      //console.log(result);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen px-6 py-10 relative bg-white ">
      <button
        className="absolute top-5 left-5  text-green-600 font-bold cursor-pointer"
        onClick={() => nextstep(1)}
      >
        &lt;- Back
      </button>
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 1 },
        }}
        className="ml-3 text-3xl text-green-600 font-bold inline-flex items-center gap-1"
      >
        Creat Account <Leaf className="w-5 h-5 " />
      </motion.h1>
      <p className="mt-[-5] italic">Join snapcart today</p>
      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 1 },
        }}
        className="flex flex-col w-full max-w-sm "
      >
        <div className=" relative mt-5  ">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            value={name}
            type="text"
            placeholder="Your Name"
            name=""
            id=""
            className=" border border-gray-300 rounded-lg w-full p-2 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none "
          />
          <UserRound className=" text-gray-400 absolute left-2  top-2.5  w-5 h-5" />
        </div>
        <div className=" relative mt-5  ">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            value={email}
            type="text"
            placeholder="Your Email"
            name=""
            id=""
            className=" border border-gray-300 rounded-lg w-full p-2 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none "
          />
          <Mail className=" text-gray-400 absolute left-2 top-2.5  w-5 h-5" />
        </div>
        <div className=" relative mt-5  ">
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            value={password}
            type={showpasswd ? "text" : "password"}
            placeholder="Your Password"
            name=""
            id=""
            autoComplete=""
            className=" border border-gray-300 rounded-lg w-full p-2 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none "
          />
          <Lock className=" text-gray-400 absolute left-2  top-2.5 w-5 h-5" />
          <span onClick={() => setShowpasswd((prev) => !prev)}>
            {showpasswd ? (
              <Eye className=" text-gray-400 absolute right-2 top-2.5 w-5 h-5" />
            ) : (
              <EyeOff className=" text-gray-400 absolute right-2 top-2.5 w-5 h-5" />
            )}
          </span>
        </div>
        {(() => {
          const formValidation = name !== "" && email !== "" && password !== "";
          return (
            <button
              disabled={!formValidation}
              className={`mt-5 py-2 w-full inline-flex justify-center items-center gap-1  rounded-lg  transition-all duration-200 shadow-md 
                ${formValidation ? "bg-green-500 hover:bg-green-700 text-white cursor-pointer" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing
                </>
              ) : (
                "Register"
              )}
            </button>
          );
        })()}
        <div className="flex items-center gap-[5px] justify-center mt-5">
          <span className="flex-1 h-px bg-gray-500" />{" "}
          {/* sample css span or hr tag */}
          Or
          <hr className="grow border-gray-500" />
        </div>
        <button
          className="mt-5 py-2 w-full flex justify-center items-center gap-3 border border-gray-300 rounded-lg 
                          hover:bg-gray-100 text-gray-700 cursor-pointer transition-all duration-200"
          onClick={async () => {
            await signIn("google", { callbackUrl: "/" });
          }}
        >
          <Image alt="google" src={googleImage} width={25} height={25} />
          Continue with Google
        </button>
      </motion.form>
      <p className="mt-5 py-2 w-full text-sm gap-1 inline-flex justify-center items-center  ">
        Already have account ? <LogIn className="w-5 h-5 text-green-500" />
        <span
          className="px-2 py-1 text-green-500 transition-all duration-200 hover:bg-gray-100
          cursor-pointer "
          onClick={() => router.push("/login")}
        >
          SignIn
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
