import { configureStore } from "@reduxjs/toolkit";
import projectsSlice from "./slices/projectsSlice";
import vercelSlice from "./slices/vercelSlice";

export const store = configureStore({
    reducer: {
        projectsSlice: projectsSlice,
        vercelSlice: vercelSlice
    }
});
