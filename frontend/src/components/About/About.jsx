import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserPerformanceAnalysis,
  fetchUserDetails,
} from "../../store/slices/userSlice";
import "./About.css"; // Include a CSS file for styling

const About = () => {
  const dispatch = useDispatch();

  const { details } = useSelector((state) => state.user); // Profile details
  const { performanceData, status, error } = useSelector((state) => state.user);

  // Fetch profile details and performance analysis on mount
  useEffect(() => {
    dispatch(fetchUserDetails());
    dispatch(fetchUserPerformanceAnalysis());
  }, [dispatch]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message || "Something went wrong."}</p>;
  }

  return (
    <div className="about-container">
      <h1 className="about-title">Welcome, {details.name}!</h1>
      <div className="profile-summary">
        <p>
          <strong>Email:</strong> {details.email}
        </p>
        <p>
          <strong>Weight:</strong> {details.weight?.[0]?.weight || "N/A"} kg
        </p>
        <p>
          <strong>Height:</strong> {details.height?.[0]?.height || "N/A"} cm
        </p>
        <p>
          <strong>Goal:</strong> {details.goal}
        </p>
        <p>
          <strong>Activity Level:</strong> {details.activityLevel}
        </p>
      </div>

      <h2 className="performance-title">Your Performance Summary</h2>
      <div className="performance-summary">
        {performanceData ? (
          <>
            <p>
              <strong>Total Steps:</strong> {performanceData.totalSteps}
            </p>
            <p>
              <strong>Total Workouts:</strong> {performanceData.totalWorkouts}
            </p>
            <p>
              <strong>Average Sleep:</strong> {performanceData.averageSleep} hrs
            </p>
            <p>
              <strong>Water Intake:</strong> {performanceData.totalWater} liters
            </p>
            <p>
              <strong>Calories Consumed:</strong>{" "}
              {performanceData.totalCalories} kcal
            </p>
          </>
        ) : (
          <p>No performance data available.</p>
        )}
      </div>
    </div>
  );
};

export default About;
