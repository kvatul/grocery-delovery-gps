import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface Igrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image?: string;
}

// Define a type for the slice state
interface ICartState {
  cartData: Igrocery[];
  subTotal: number;
  deliverFee: number;
  finalTotal: number;
}

// Define the initial state using that type
const initialState: ICartState = {
  cartData: [],
  subTotal: 0,
  deliverFee: 40,
  finalTotal: 0,
};

const cartSlice = createSlice({
  name: "cart",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Igrocery>) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.getCartTotal(state);
    },
    incQuantity: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      const cartItem = state.cartData.find(
        (item) => item._id == action.payload,
      );
      if (cartItem) {
        cartItem.quantity = cartItem.quantity + 1;
      }
      cartSlice.caseReducers.getCartTotal(state);
    },
    decQuantity: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      const cartItem = state.cartData.find(
        (item) => item._id == action.payload,
      );
      if (cartItem?.quantity && cartItem.quantity > 1)
        cartItem.quantity = cartItem.quantity - 1;
      else
        state.cartData = state.cartData.filter(
          (item) => item._id !== action.payload,
        );
      cartSlice.caseReducers.getCartTotal(state);
    },
    removeItem: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData.filter(
        (item) => item._id !== action.payload,
      );
      cartSlice.caseReducers.getCartTotal(state);
    },

    removeCart: (state) => {
      state.cartData = [];
      cartSlice.caseReducers.getCartTotal(state);
    },

    getCartTotal: (state) => {
      /*       state.cartData.map((item) => {
        state.subTotal = state.subTotal + item.quantity * Number(item.price);
        state.finalTotal = state.subTotal + state.deliverFee;
      });
 */
      state.subTotal = state.cartData.reduce(
        (sum: number, item: Igrocery) =>
          (sum = sum + item.quantity * Number(item.price)),
        0,
      );
      state.deliverFee = state.subTotal > 100 ? 0 : 40;
      state.finalTotal = state.subTotal + state.deliverFee;
    },
  },
});

export const { addToCart, incQuantity, decQuantity, removeItem, removeCart } =
  cartSlice.actions;
export default cartSlice.reducer;
