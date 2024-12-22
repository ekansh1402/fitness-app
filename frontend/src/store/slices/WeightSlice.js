import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api/v1/";

// Async thunk to add a weight entry
export const addWeightEntry = createAsyncThunk(
  "weight/addWeightEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/addweightentry`,
        {
          withCredentials: true,
        },
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch weight entries by date
export const fetchWeightByDate = createAsyncThunk(
  "weight/fetchWeightByDate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/getweightbydate`,
        {
          withCredentials: true,
        },
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch weight entries by limit
export const fetchWeightByLimit = createAsyncThunk(
  "weight/fetchWeightByLimit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/getweightbylimit`,
        {
          withCredentials: true,
        },
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a weight entry
export const deleteWeightEntry = createAsyncThunk(
  "weight/deleteWeightEntry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/deleteweightentry`,
        {
          withCredentials: true,
        },
        {
          data,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch user's goal weight
export const fetchUserGoalWeight = createAsyncThunk(
  "weight/fetchUserGoalWeight",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getusergoalweight`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const weightSlice = createSlice({
  name: "weight",
  initialState: {
    entries: [],
    goalWeight: null,
    currentWeight: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add weight entry
      .addCase(addWeightEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addWeightEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries.push(action.payload.data);
      })
      .addCase(addWeightEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch weight by date
      .addCase(fetchWeightByDate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWeightByDate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries = action.payload.data;
      })
      .addCase(fetchWeightByDate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch weight by limit
      .addCase(fetchWeightByLimit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWeightByLimit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries = action.payload.data;
      })
      .addCase(fetchWeightByLimit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete weight entry
      .addCase(deleteWeightEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteWeightEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries = state.entries.filter(
          (entry) => entry.date !== action.payload.data.date
        );
      })
      .addCase(deleteWeightEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch user's goal weight
      .addCase(fetchUserGoalWeight.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserGoalWeight.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goalWeight = action.payload.data.goalWeight;
        state.currentWeight = action.payload.data.currentWeight;
      })
      .addCase(fetchUserGoalWeight.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default weightSlice.reducer;
