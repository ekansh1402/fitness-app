import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define initial state for workout data
const initialState = {
  entries: [],
  goal: null,
  status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

// Async Thunks for making API calls
const BASE_URL = "http://localhost:4000/api/v1/workouttrack";
// prefix will be usedc in redux debugging
export const addWorkoutEntry = createAsyncThunk(
  "workout/addWorkoutEntry",
  async (workoutData, { rejectWithValue }) => {
    try {
      console.log("hiiiiiii");
      const response = await axios.post(
        `${BASE_URL}/addworkoutentry`,
        workoutData,
        {
          withCredentials: true,
        }
      );
      console.log("response of add workout", response);
      return response.data.data;
    } catch (error) {
      console.log("error of add workout", error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getWorkoutsByDate = createAsyncThunk(
  "workout/getWorkoutsByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/getworkoutsbydate`,
        {
          date,
        },
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getWorkoutsByLimit = createAsyncThunk(
  "workout/getworkoutsbylimit",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/getworkoutsbylimit`,
        {
          limit,
        },
        {
          withCredentials: true,
        }
      );
      console.log("response of get workout", response);
      return response.data.data;
    } catch (error) {
      console.log("response of get workout", error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteWorkoutEntry = createAsyncThunk(
  "workout/deleteWorkoutEntry",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/deleteworkoutentry`,
        {
          withCredentials: true,
        },
        {
          data: { date },
        }
      );
      return date; // Return the date of the deleted entry
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserGoalWorkout = createAsyncThunk(
  "workout/getUserGoalWorkout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/workout/getusergoalworkout`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Create the slice
const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add workout entry
      .addCase(addWorkoutEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addWorkoutEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries.push(action.payload);
      })
      .addCase(addWorkoutEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get workouts by date
      .addCase(getWorkoutsByDate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWorkoutsByDate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries = action.payload;
        console.log("redus of workout", action.payload);
      })
      .addCase(getWorkoutsByDate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get workouts by limit
      .addCase(getWorkoutsByLimit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWorkoutsByLimit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries = action.payload;
      })
      .addCase(getWorkoutsByLimit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete workout entry
      .addCase(deleteWorkoutEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteWorkoutEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.entries = state.entries.filter(
          (entry) =>
            new Date(entry.date).getTime() !==
            new Date(action.payload).getTime()
        );
      })
      .addCase(deleteWorkoutEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get user goal workout
      .addCase(getUserGoalWorkout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserGoalWorkout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.goal = action.payload.goal;
      })
      .addCase(getUserGoalWorkout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default workoutSlice.reducer;
