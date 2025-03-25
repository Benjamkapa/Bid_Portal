import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

// Define API URL
const API_URL = "http://197.248.122.31:3000/api";



// Define types for the user and state
interface User {
  id: string;
  name: string;
  email: string;
  role:string;
  instituion:{
    institution_id:number;
      institution_name:string;
  }
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  stats: Record<string, any>;
}


interface formData {
  email: string;
  password: string;
}

// Authentication using the stored token
export const token = (): { headers: Record<string, string> } => {
  const token = localStorage.getItem("token");
  const config: { headers: Record<string, string> } = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

// Async Thunk for Login
interface LoginResponse {
  token: string;
  user: User;
}

export const loginUser = createAsyncThunk<LoginResponse, formData, { rejectValue: string }>(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });
    //   console.log("Axios resp",response)
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get user Profile
export const getUserProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<User>(`${API_URL}/profile`, token());
// console.log("Profile res",response)
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || "Auth failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


const initialState: AuthState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
  stats: {},
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.isAuthenticated = false;
      toast.success("Logged out successfully");
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        toast.success("Successfully logged in")
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

    //   Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Auth failed";
      })
  },
});
export const { logout } = authSlice.actions; // Export logout action
export default authSlice.reducer;
