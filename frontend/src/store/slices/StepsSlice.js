import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  stepsData: [],
  loading: false,
  error: null,
  userGoalSteps: null,
};
const BASE_URL = "http://localhost:4000/api/v1/";
// Async thunks
export const addStepEntry = createAsyncThunk(
  "steps/addStepEntry",
  async (stepEntry, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/steps/addstepentry`,
        {
          withCredentials: true,
        },
        stepEntry
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStepsByDate = createAsyncThunk(
  "steps/getStepsByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/steps/getstepsbydate`,
        {
          withCredentials: true,
        },
        { date }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStepsByLimit = createAsyncThunk(
  "steps/getStepsByLimit",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/steps/getstepsbylimit`,
        {
          withCredentials: true,
        },
        {
          limit,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteStepEntry = createAsyncThunk(
  "steps/deleteStepEntry",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/steps/deletestepentry`,
        {
          withCredentials: true,
        },
        {
          data: { date },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserGoalSteps = createAsyncThunk(
  "steps/getUserGoalSteps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/steps/getusergoalsteps`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const stepsSlice = createSlice({
  name: "steps",
  initialState,
  reducers: {
    clearStepsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addStepEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStepEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.stepsData.push(action.payload.data);
      })
      .addCase(addStepEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStepsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStepsByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.stepsData = action.payload.data;
      })
      .addCase(getStepsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStepsByLimit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStepsByLimit.fulfilled, (state, action) => {
        state.loading = false;
        state.stepsData = action.payload.data;
      })
      .addCase(getStepsByLimit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteStepEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStepEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.stepsData = state.stepsData.filter(
          (entry) => entry.date !== action.meta.arg
        );
      })
      .addCase(deleteStepEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserGoalSteps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserGoalSteps.fulfilled, (state, action) => {
        state.loading = false;
        state.userGoalSteps = action.payload.data.totalSteps;
      })
      .addCase(getUserGoalSteps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStepsError } = stepsSlice.actions;
export default stepsSlice.reducer;
