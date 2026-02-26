import { Schema, model, models } from "mongoose";

interface Igrocery {
  _id?: Schema.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image?: string;
}

const grocerySchema = new Schema<Igrocery>(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,

      enum: [
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
      ],
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["Kg", "g", "Piece", "Pack", "Dozen", "liter", "ml"],
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Grocery = models?.Grocery || model<Igrocery>("Grocery", grocerySchema);
export default Grocery;
