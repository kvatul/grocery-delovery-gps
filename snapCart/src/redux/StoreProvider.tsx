"use client";
import { Provider } from "react-redux";
import { store } from "./store";
function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Provider store={store}>{children}</Provider>
    </div>
  );
}

export default StoreProvider;
