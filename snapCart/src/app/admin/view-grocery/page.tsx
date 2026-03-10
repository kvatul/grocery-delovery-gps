"use client";
import { Igrocery } from "@/model/grocery.model";
import axios from "axios";
import { ArrowLeft, Package, Pencil, Search, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
function page() {
  const [groceries, setGroceries] = useState<Igrocery[]>([]);
  const [editProd, setEditProd] = useState<Igrocery | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [backendImage, setBackendImage] = useState<Blob | null>();
  const [loading, setLoading] = useState(true);
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

  const router = useRouter();
  useEffect(() => {
    async function getGrocery() {
      try {
        const result = await axios.get("/api/admin/grocery");
        setGroceries(result.data);
      } catch (error) {
        console.log(error);
      }
    }
    getGrocery();
  }, []);

  useEffect(() => {
    if (editProd) setImagePreview(editProd.image!);
  }, [editProd]);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackendImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function updateProduct() {
    //e: React.FormEvent) {
    if (!editProd) return;
    setLoading(true);
    //e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editProd.name);
      formData.append("category", editProd.category);
      formData.append("unit", editProd.unit);
      formData.append("price", editProd.price);
      formData.append("id", editProd?._id?.toString()!);
      console.log(formData);

      if (backendImage) formData.append("image", backendImage);
      const result = await axios.post("/api/admin/grocery", formData);
      setLoading(false);
      //console.log(result);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function deleteProduct() {
    if (!editProd) return;
    setLoading(true);
    //e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("id", editProd?._id?.toString()!);
      console.log(formData);
      const result = await axios.post("/api/admin/grocery", formData);
      setLoading(false);
      //console.log(result);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="pt-4 pb-20 w-[90%] md:w-[80%] mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center
                      sm:text-left"
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 bg-green-100 text-green-700 
             font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto hover:bg-green-200"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2">
          <Package size={22} className="text-green-600" />
          Manage Groceries
        </h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-s
              mb-10 hover:shadow-lg transition-all max-w-1g mx-auto w-full"
      >
        <Search className="text-gray-500 w-5 h-5 mr-2" />
        <input
          type="text"
          className="w-full outline-none text-gray-700 placeholder-gray-400"
          placeholder="Search by name or category..."
        />
      </motion.form>

      <div className="space-y-4">
        {groceries?.map((g, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-50
             flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all"
          >
            <div className="relative w-full sm:w-44 aspect-square rounded-xl  overflow-hidden border border-gray-200">
              <Image
                src={g.image!}
                alt={g.image!}
                fill
                className="object-cover hover:scale-105 transition-all duration-300 "
              />
            </div>

            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {g.name}
                </h3>
                <p className="text-gray-500 text-sm capitalize">{g.category}</p>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-green-700 font-bold text-lg">
                  {g.price}/{" "}
                  <span className="text-gray-500 text-ml-1">{g.unit}</span>
                </p>

                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-
                    font-semibold flex items-center justify-center gap-2 hover:bg-green-706 transition-all"
                  onClick={() => setEditProd(g)}
                >
                  <Pencil size={15} /> Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editProd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50
                      backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2x1 shadow-2x1 w-full max-w-md p-7 relative"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2x1 font-bold text-green-700 ">
                  Edit Grocery
                </h2>
                <button
                  className="text-gray-600 hover:text-red-600"
                  onClick={() => setEditProd(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative w-full aspect-square rounded-xl mb-4 overflow-hidden border border-gray-200 group mx-auto">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt={editProd.name}
                    fill
                    className="object-fill  "
                  />
                )}

                <label
                  htmlFor="imageUpload"
                  className="absolute  inset-0 bg-black/40 opacity-6 
                  group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                >
                  <Upload size={28} className="text-green-500" />
                </label>

                <input
                  type="file"
                  accept=" image/*"
                  hidden
                  id="imageUpload"
                  onChange={handleImageChange}
                />
              </div>

              <div className="space-y-2">
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditProd({ ...editProd, name: e.target.value })
                  }
                  value={editProd.name}
                  type="text"
                  placeholder="eg:sweets/milk "
                  name=""
                  id=""
                  className=" border border-gray-300 rounded-lg w-full p-1 pl-4 focus:ring-2 focus:ring-green-500 focus:outline-none "
                />

                <select
                  value={editProd.category}
                  className=" border border-gray-300 rounded-lg w-full p-1 pl-4 focus:ring-2 focus:ring-green-500 focus:outline-none "
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditProd({ ...editProd, category: e.target.value })
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

                <select
                  id="unit"
                  value={editProd.unit}
                  className=" border border-gray-300 rounded-lg w-full p-1 pl-4 focus:ring-2 focus:ring-green-500 focus:outline-none "
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditProd({ ...editProd, unit: e.target.value })
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
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditProd({ ...editProd, price: e.target.value })
                  }
                  value={editProd.price}
                  type="text"
                  placeholder="eg:sweets/milk "
                  name=""
                  id=""
                  className=" border border-gray-300 rounded-lg w-full p-1 pl-4 focus:ring-2 focus:ring-green-500 focus:outline-none "
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2
                           hover:scale-105 transition-all duration-200"
                  onClick={updateProduct}
                >
                  Update Grocery
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white flex items-center gap-2 
                  hover:scale-105 transition-all duration-200 "
                  onClick={deleteProduct}
                >
                  Delete Grocery
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default page;
