import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  sleepEntries: [],
  loading: false,
  error: null,
};
const BASE_URL = "http://localhost:4000/api/v1/";
// Async thunks
export const fetchSleepEntries = createAsyncThunk(
  "sleep/fetchSleepEntries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/sleep/getSleepByLimit`,
        {
          withCredentials: true,
        },
        {
          limit: "all",
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sleep entries"
      );
    }
  }
);

export const addSleepEntry = createAsyncThunk(
  "sleep/addSleepEntry",
  async ({ date, durationInHours }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/sleep/addSleepEntry`,
        {
          withCredentials: true,
        },
        {
          date,
          durationInHours,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add sleep entry"
      );
    }
  }
);

export const deleteSleepEntry = createAsyncThunk(
  "sleep/deleteSleepEntry",
  async ({ date }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/sleep/deleteSleepEntry`,
        {
          withCredentials: true,
        },
        {
          data: { date },
        }
      );
      return { date, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete sleep entry"
      );
    }
  }
);

// Slice
const sleepSlice = createSlice({
  name: "sleep",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch sleep entries
      .addCase(fetchSleepEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSleepEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.sleepEntries = action.payload;
      })
      .addCase(fetchSleepEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add sleep entry
      .addCase(addSleepEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSleepEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.sleepEntries.push(action.payload.data);
      })
      .addCase(addSleepEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete sleep entry
      .addCase(deleteSleepEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSleepEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.sleepEntries = state.sleepEntries.filter(
          (entry) => entry.date !== action.payload.date
        );
      })
      .addCase(deleteSleepEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sleepSlice.reducer;
