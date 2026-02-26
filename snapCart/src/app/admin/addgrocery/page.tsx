"use client";

import { Upload, ArrowLeft, PlusCircle, Loader2 } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const AddGrocery = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [preview, setPreview] = useState<string | null>("");
  const [backendImage, setBackendImage] = useState<Blob | null>();

  const [loading, setLoading] = useState<boolean>(false);

  const formValidation = (name !== "" &&
    category !== "" &&
    unit !== "" &&
    price !== "" &&
    preview !== "") as boolean;

  // const formValidation = (name !== "" && category !== "") as boolean;

  const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Rice, Atta & Grains",
    "Snacks & Biscuits",
    "Spices & Masalas",
    "Beverages & Drinks",
    "Personal Care",
    "Household Essentials",
    "Instant & Packaged Food",
    "Baby & Pet Care",
  ];
  const units = ["Kg", "g", "Piece", "Pack", "Dozen", "liter", "ml"];

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length == 0) return;
    const file = files[0];
    setBackendImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleAddGrocery(e: React.FormEvent) {
    setLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("unit", unit);
      formData.append("price", price);
      console.log(formData);

      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post("/api/admin/addgrocery", formData);
      setLoading(false);
      //router.push("/login");
      console.log(result);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  return (
    <div
      className=" min-h-screen flex justify-center items-center px-6 py-16 
       bg-linear-to-br from-white to-green-100 relative "
    >
      <Link
        href={"/"}
        className="absolute top-2 left-2 bg-white/70 rounded-full px-4 py-1 text-green-600 font-bold
         cursor-pointer flex item-center gap-2 shadow-md hover:scale-105 transition-all duration-200"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="hidden md:flex">Go to Home</span>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-2  "
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="mt-3 text-xl text-green-600 font-bold inline-flex items-center gap-1">
            <PlusCircle className="w-5 h-5 " />
            Add your grocery
          </h1>
          <p className="text-xs text-gray-500 text-center">
            Fill out details below to add a grocery
          </p>
        </div>

        <form
          className=" flex flex-col gap-3 w-full px-5 "
          onSubmit={handleAddGrocery}
        >
          <div className="  ">
            <label
              htmlFor="name"
              className="block  text-gray-700 font-medium mb-1"
            >
              Grocery Name<span className="text-red-500 font-bold">*</span>
            </label>

            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              value={name}
              type="text"
              placeholder="eg:sweets/milk "
              name=""
              id=""
              className=" border border-gray-300 rounded-lg w-full p-1 pl-4 focus:ring-2 focus:ring-green-500 focus:outline-none "
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
            <div className=" ">
              <label
                htmlFor="name"
                className="  text-gray-700 font-medium mb-1"
              >
                Select Category
              </label>
              <span className="text-red-500 font-bold">*</span>

              <select
                id="catg"
                value={category}
                className=" border border-gray-300 rounded-lg w-full p-1 pl-4 focus:ring-2 focus:ring-green-500 focus:outline-none "
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCategory(e.target.value)
                }
              >
                <option key={0} value="">
                  Select Category
                </option>
                {categories &&
                  categories.map((catg, index) => (
                    <option key={index} value={catg}>
                      {catg}
                    </option>
                  ))}
              </select>
            </div>
            <div className=" ">
              <label htmlFor="name" className=" text-gray-700 font-medium mb-1">
                Select Unit
              </label>
              <span className="text-red-500 font-bold">*</span>

              <select
                id="unit"
                value={unit}
                className=" border border-gray-300 rounded-lg w-full p-1 pl-4 focus:ring-2 focus:ring-green-500 focus:outline-none "
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setUnit(e.target.value)
                }
              >
                <option key={0} value="">
                  Select Unit
                </option>
                {units &&
                  units.map((unit, index) => (
                    <option key={index} value={unit}>
                      {unit}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className=" ">
            <label htmlFor="name" className=" text-gray-700 font-medium mb-1">
              Price
            </label>
            <span className="text-red-500 font-bold">*</span>

            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrice(e.target.value)
              }
              value={price}
              type="text"
              placeholder="eg.100 "
              name=""
              id=""
              className=" border border-gray-300 rounded-lg w-full p-1 pl-4 focus:ring-2 focus:ring-green-500 focus:outline-none "
            />
          </div>
          <div className="flex flex-col sm:flex-row ">
            <label
              htmlFor="image"
              className="cursor-pointer flex justify-center items-center gap-2 bg-green-50 text-green-700 
              rounded-xl border border-green-200 font-semibold py-3 px-6 hover:bg-green-100 transition-all duration-200 "
            >
              <Upload className="w-5 h-5" />
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="image"
              hidden
            />
            {preview && (
              <Image
                src={preview}
                width={100}
                height={100}
                alt="preview"
                className="rounded-xl shadow-md border border-gray-200 object-cover"
              />
            )}
          </div>
          <motion.button
            disabled={!formValidation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-[95%] rounded-full my-4 mx-auto  py-2 ${formValidation ? "bg-green-500" : "bg-gray-500 cursor-not-allowed"}`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Add Grocery"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGrocery;
