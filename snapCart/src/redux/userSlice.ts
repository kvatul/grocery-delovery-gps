import { createSlice } from "@reduxjs/toolkit";
import { Schema } from "mongoose";
//import type { PayloadAction } from "@reduxjs/toolkit";
//import type { RootState } from '../../app/store'

interface Iuser {
  _id?: Schema.Types.ObjectId;
  name?: string;
  email: string;
  password?: string;
  mobile?: string;
  image?: string;
  role?: "user" | "admin" | "deliveryman";
}

// Define a type for the slice state
interface IUserState {
  userData: Iuser | null;
}

// Define the initial state using that type
const initialState: IUserState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value;
