import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    data: [],
    loading: false,
    error: null,
}


export const fetchVercelAnalyses = createAsyncThunk(
    'vercel/fetchVercelAnalyses',
    async () => {
        const res = await fetch('api/analyses')
        const data = await res.json();
        return data;
    }
)

const vercelSlice = createSlice({
    name: "vercelSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVercelAnalyses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVercelAnalyses.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchVercelAnalyses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }    
});

export const { } = vercelSlice.actions;
export default vercelSlice.reducer;