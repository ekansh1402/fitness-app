import React from "react";
import CaloriIntakePopup from "../ReportFormPopup/CalorieIntake/CalorieIntake";
import SleepTrackerPopup from "../ReportFormPopup/SleepTrackerPopup/SleepTrackerPopup";
import StepsTrackerPopup from "../ReportFormPopup/StepsTrackerPopup/StepsTrackerPopup";
import WaterIntakePopup from "../ReportFormPopup/WaterIntakePopup/WaterIntakePopup";
import WeightTrackerPopup from "../ReportFormPopup/WeightTrackerPopup/WeightTrackerPopup";
import ExerciseTrackerPopup from "../ReportFormPopup/ExerciseTrackerPopup/ExerciseTrackerPopup";
import { addCalorieEntry } from "../../store/slices/CalorieSlice";
import { addSleepEntry } from "../../store/slices/SleepSlice";
import { addStepEntry } from "../../store/slices/StepsSlice";
import { addWeightEntry } from "../../store/slices/WeightSlice";
import { addWorkoutEntry } from "../../store/slices/WorkoutSlice";
import { addWaterEntry } from "../../store/slices/WaterSlice";
const onSave = (data) => {
  console.log(data);
};
const ReportPopup = ({ id, setShowPopup }) => {
  switch (id) {
    case "calories":
      return (
        <CaloriIntakePopup
          setShowPopup={setShowPopup}
          onSave={addCalorieEntry}
        />
      );
    case "water":
      return <WaterIntakePopup setShowPopup={setShowPopup} />;
    case "sleep":
      return (
        <SleepTrackerPopup setShowPopup={setShowPopup} onSave={addSleepEntry} />
      );

    case "steps":
      return (
        <StepsTrackerPopup setShowPopup={setShowPopup} onSave={addStepEntry} />
      );

    case "weight":
      return (
        <WeightTrackerPopup
          setShowPopup={setShowPopup}
          onSave={addWeightEntry}
        />
      );

    case "workout":
      return (
        <ExerciseTrackerPopup
          setShowPopup={setShowPopup}
          onSave={addWorkoutEntry}
        />
      );

    default:
      return <h1>Hello!</h1>;
  }
};

export default ReportPopup;
