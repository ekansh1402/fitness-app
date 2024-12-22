import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = "http://localhost:4000/api/v1/";
// Async thunks for calories
export const fetchCaloriesByDate = createAsyncThunk(
  "calories/fetchCaloriesByDate",
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/calorieintake/getcalorieintakebydate`,
        {
          withCredentials: true,
        },
        {
          date,
        }
      );
      return response.data.data; // Assuming `data` contains the relevant calorie info
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchCaloriesByLimit = createAsyncThunk(
  "calories/fetchCaloriesByLimit",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}calorieintake/getcalorieintakebylimit`,
        limit, // This should be the request body
        {
          withCredentials: true,
        }
      );
      // console.log(response);
      return response.data.data; // Assuming `data` contains the relevant calorie info
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
    // credentials = { email: "ekansh@gmail.com", password: "nanu2003" };

    // try {
    //   await axios
    //     .post(`http://localhost:4000/api/v1/signin`, credentials, {
    //       withCredentials: true,
    //     })
    //     .then((res) => {
    //       console.log(res);
    //       setUser(res.data.username);
    //       setShowPopup(!showPopup);
    //     })
    //     .catch((err) => console.log(err));
    // } catch (err) {
    //   setError(err.response?.data?.message || "Login failed");
    // }
  }
);

export const addCalorieEntry = createAsyncThunk(
  "calories/addCalorieEntry",
  async (calorieData, { rejectWithValue }) => {
    try {
      console.log(calorieData);
      const response = await axios.post(
        `${BASE_URL}calorieintake//addcalorieintake`,
        calorieData,
        {
          withCredentials: true,
        }
      );
      console.log("the response is", response);
      return response.data.data;
    } catch (error) {
      console.log("erro is ", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const caloriesSlice = createSlice({
  name: "calories",
  initialState: {
    calorieEntries: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaloriesByDate.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCaloriesByDate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.calorieEntries = action.payload;
      })
      .addCase(fetchCaloriesByDate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCaloriesByLimit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCaloriesByLimit.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("action", action);
        state.calorieEntries = action.payload;
      })
      .addCase(fetchCaloriesByLimit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addCalorieEntry.fulfilled, (state, action) => {
        state.calorieEntries.push(action.payload);
      })
      .addCase(addCalorieEntry.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default caloriesSlice.reducer;
