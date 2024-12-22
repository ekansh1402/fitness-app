import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage for persistence
import { combineReducers } from "redux";

import calorieReducer from "./slices/CalorieSlice";
import waterReducer from "./slices/WaterSlice";
import stepsReducer from "./slices/StepsSlice";
import sleepReducer from "./slices/SleepSlice";
import weightReducer from "./slices/WeightSlice";
import workoutReducer from "./slices/WorkoutSlice";
import userReducer from "./slices/userSlice";
import authReducer from "./slices/AuthSlice";

// Combine reducers
const rootReducer = combineReducers({
  calorie: calorieReducer,
  water: waterReducer,
  steps: stepsReducer,
  sleep: sleepReducer,
  weight: weightReducer,
  workout: workoutReducer,
  user: userReducer,
  auth: authReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  // Remove whitelist to persist all slices
  // Optionally, use `blacklist` to exclude slices, e.g. `blacklist: ['someSlice']`
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production", // Enables Redux DevTools
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Export persistor and store
export const persistor = persistStore(store);
export default store;
