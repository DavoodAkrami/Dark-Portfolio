import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/configs/supabase";


const initialState = {
    id: "",
    title: "",
    description: "",
    url: "",
    technologies: [],
    gitHub: "",
    img: "",
    error: null,
    projectsLoading: false
}


export const addNewProject = createAsyncThunk(
    'projects/addNewProject',
    async (newProject) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase
            .from('projects')
            .insert(newProject)
            .select()
            .single()

            if (error) throw error;
            return data;
    }
);

export const editProject = createAsyncThunk(
    'projects/editProject',
    async ({projectId, editedProject}) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase
            .from('projects')
            .update(editedProject)
            .eq('id', projectId)
            .select()
            .single()

            if (error) throw error;
            return data;
    }
) 

export const deleteProject = createAsyncThunk(
    'projects/deleteProjects',
    async (id) => {
        if (!supabase) throw new Error('Supabase not configured');

        const { error } = await supabase 
            .from('projects')
            .delete()
            .eq('id', id)

            if (error) throw error;
            return id;
    }
)

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async () => {
        if (!supabase) throw new Error('Supabase not configured');

        const { data, error } = await supabase
            .from('projects')
            .select('*')

            if (error) throw error;
            return data;
    }
)


const projectsSlice = createSlice({
    name: "projectsSlice",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetProject: (state) => {
            state.id = "";
            state.title = "";
            state.description = "";
            state.url = "";
            state.technologies = [];
            state.gitHub = "";
            state.img = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Add New Project
            .addCase(addNewProject.pending, (state) => {
                state.projectsLoading = true;
                state.error = null;
            })
            .addCase(addNewProject.fulfilled, (state, action) => {
                state.projectsLoading = false;
                state.error = null;
            })
            .addCase(addNewProject.rejected, (state, action) => {
                state.projectsLoading = false;
                state.error = action.error.message;
            })
            // Edit Project
            .addCase(editProject.pending, (state) => {
                state.projectsLoading = true;
                state.error = null;
            })
            .addCase(editProject.fulfilled, (state, action) => {
                state.projectsLoading = false;
                state.error = null;
            })
            .addCase(editProject.rejected, (state, action) => {
                state.projectsLoading = false;
                state.error = action.error.message;
            })
            // Delete Project
            .addCase(deleteProject.pending, (state) => {
                state.projectsLoading = true;
                state.error = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projectsLoading = false;
                state.error = null;
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.projectsLoading = false;
                state.error = action.error.message;
            })
            // Fetch Projects
            .addCase(fetchProjects.pending, (state) => {
                state.projectsLoading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.projectsLoading = false;
                state.error = null;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.projectsLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearError, resetProject } = projectsSlice.actions;
export default projectsSlice.reducer;

