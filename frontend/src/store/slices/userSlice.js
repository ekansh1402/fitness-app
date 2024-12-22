import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api/v1/user";

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    console.log("inside fetchuser");
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      });
      console.log("response of user", response);
      return response.data;
    } catch (error) {
      console.log("error in profile", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/profile`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch user statistics
export const fetchUserStats = createAsyncThunk(
  "user/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/stats`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update user goals
export const updateUserGoal = createAsyncThunk(
  "user/updateUserGoal",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/goal`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch user performance analysis
export const fetchUserPerformanceAnalysis = createAsyncThunk(
  "user/fetchUserPerformanceAnalysis",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/analyze`, {
        withCredentials: true,
      });
      return response.data; // Assuming this returns the analysis data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    details: {},
    stats: {},
    goals: {},
    performanceAnalysis: {}, // New state for the performance analysis
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload.data;
        state.error = null;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload.data;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch user statistics
      .addCase(fetchUserStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload.data;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update user goal
      .addCase(updateUserGoal.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserGoal.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goals = action.payload.data;
      })
      .addCase(updateUserGoal.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch performance analysis
      .addCase(fetchUserPerformanceAnalysis.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserPerformanceAnalysis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.performanceAnalysis = action.payload.data; // Storing the analysis result
      })
      .addCase(fetchUserPerformanceAnalysis.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
