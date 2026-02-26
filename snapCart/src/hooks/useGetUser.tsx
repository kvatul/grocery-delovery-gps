"use client";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/userSlice";

function useGetUser() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get("/api/user/getuser");
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);
}

export default useGetUser;
