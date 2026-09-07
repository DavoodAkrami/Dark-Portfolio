import { configureStore } from "@reduxjs/toolkit";
import vercelSlice from "./slices/vercelSlice";

export const store = configureStore({
    reducer: {
        vercelSlice: vercelSlice
    }
});
