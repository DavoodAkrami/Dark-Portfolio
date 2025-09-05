import { configureStore } from "@reduxjs/toolkit";
import projectsSlice from "./slices/projectsSlice"


export const store = configureStore({
    reducer: {
        projectsSlice: projectsSlice
    }
})