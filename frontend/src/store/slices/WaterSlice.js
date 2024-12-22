import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = "http://localhost:4000/api/v1/";
// Async thunks for water
export const fetchWaterByDate = createAsyncThunk(
  "water/fetchWaterByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/water/getwaterbydate`,
        {
          withCredentials: true,
        },
        { date }
      );
      return response.data.data; // Assuming `data` contains the relevant water entries
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchWaterByLimit = createAsyncThunk(
  "water/fetchWaterByLimit",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/water/getwaterbylimit`,
        {
          withCredentials: true,
        },
        { limit }
      );
      return response.data.data; // Assuming `data` contains the relevant water entries
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addWaterEntry = createAsyncThunk(
  "water/addWaterEntry",
  async (waterData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/water/addwaterentry`,
        {
          withCredentials: true,
        },
        waterData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const waterSlice = createSlice({
  name: "water",
  initialState: {
    waterEntries: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWaterByDate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWaterByDate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.waterEntries = action.payload;
      })
      .addCase(fetchWaterByDate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchWaterByLimit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWaterByLimit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.waterEntries = action.payload;
      })
      .addCase(fetchWaterByLimit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addWaterEntry.fulfilled, (state, action) => {
        state.waterEntries.push(action.payload);
      })
      .addCase(addWaterEntry.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default waterSlice.reducer;
