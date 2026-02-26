"use client";
import { User, Bike, ShieldUser, TabletSmartphone } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { useSession } from "next-auth/react";

const EditRoleMobile = () => {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: ShieldUser },
    { id: "user", label: "User", icon: User },
    { id: "deliveryman", label: "Delivery Man", icon: Bike },
  ]);
  const [roleselected, setRoleselected] = useState("");
  const [mobile, setMobile] = useState<string>("");
  const formValidation = (roleselected && mobile.length === 10) as boolean;
  const router = useRouter();
  const { update } = useSession();
  useEffect(() => {
    const checkAdmin = async () => {
      const result = await axios.get("/api/checkadmin");
      if (result.data.adminExist) {
        setRoles((prev) => prev.filter((role) => role.id != "admin"));
      }
    };
    checkAdmin();
  }, []);

  const handleEdit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const result = await axios.put("/api/user/update", {
        role: roleselected,
        mobile,
      });
      await update({ role: roleselected }); // updatin on sopt role
      router.push("/");
      //console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col  items-center min-h-screen px-6 py-10 relative bg-white ">
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
        Select Your Role
      </motion.h1>
      <motion.form
        onSubmit={handleEdit}
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 1 },
        }}
        className="flex flex-col w-full max-w-md  "
      >
        <div className="w-full flex flex-col justify-center items-center md:flex-row  gap-12 mt-10 ">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                key={role.id}
                className={`shadow-lg w-30 h-30 flex flex-col justify-center items-center rounded-lg transition-all
                            duration-200 border ${
                              roleselected == role.id
                                ? "bg-green-100 border-green-600"
                                : "bg-white border-gray-300 hover:border-green-300"
                            }`}
                onClick={() => setRoleselected(role.id)}
              >
                <Icon className="text-gray-500" />
                <p className="font-sm text-gray-500">{role.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-15 flex flex-col justify-center items-center mb-20 ">
          <label htmlFor="">Enter Your Mobile No</label>
          <div className=" relative mt-1 w-2/3  ">
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMobile(e.target.value)
              }
              value={mobile}
              type="tel"
              placeholder="00000000000"
              name=""
              id="mobile"
              className=" border border-gray-300 rounded-lg w-full p-1 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none "
            />
            <TabletSmartphone className=" text-gray-400 absolute left-2 top-1.5  w-5 h-5" />
          </div>
        </div>

        <button
          disabled={!formValidation}
          className={`mt-5 py-2 w-full inline-flex justify-center items-center gap-1  rounded-lg  transition-all duration-200 shadow-md 
                ${formValidation ? "bg-green-500 hover:bg-green-700 text-white cursor-pointer" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
        >
          Go to Home -&gt;
        </button>
      </motion.form>
    </div>
  );
};

export default EditRoleMobile;
