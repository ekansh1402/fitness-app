import React, { useState, useRef } from "react";
import "../popup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
const ExerciseTrackerPopup = ({ setShowPopup, onSave }) => {
  const dateTimeRef = useRef(dayjs());
  const [showPicker, setShowPicker] = useState(true);
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("");
  const [sets, setSets] = useState([]);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const dispatch = useDispatch();
  const workoutTypes = [
    "Chest",
    "Back",
    "Abs",
    "Legs",
    "Cardio",
    "Forearms",
    "Biceps",
    "Triceps",
    "Shoulders",
  ];

  const handleAddSet = () => {
    if (weight && reps) {
      setSets((prevSets) => [...prevSets, { weight, reps }]);
      setWeight("");
      setReps("");
    } else {
      alert("Please fill out both weight and reps before adding a set.");
    }
  };

  const handleDeleteSet = (index) => {
    setSets((prevSets) => prevSets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const workoutData = {
      dateTime: dateTimeRef.current.format(),
      workoutType,
      duration,
      sets,
    };
    dispatch(onSave(workoutData)); // Trigger Redux function here
    setShowPopup(false);
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        <button className="close" onClick={() => setShowPopup(false)}>
          <AiOutlineClose />
        </button>

        <h2>Workout Tracker</h2>

        {showPicker ? (
          <div className="datetimebox">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                defaultValue={dateTimeRef.current}
                onChange={(newValue) => {
                  dateTimeRef.current = newValue;
                }}
                onAccept={() => setShowPicker(false)}
              />
            </LocalizationProvider>
          </div>
        ) : (
          <div className="selectedDateTime">
            <h3>Selected Date and Time:</h3>
            <p>{dateTimeRef.current.format("MMMM D, YYYY h:mm A")}</p>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => setShowPicker(true)}
            >
              Edit
            </Button>
          </div>
        )}

        <TextField
          select
          label="Workout Type"
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          color="warning"
        >
          {workoutTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Duration (in minutes)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          color="warning"
        />

        <div className="setInputs">
          <TextField
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            variant="outlined"
            color="warning"
            style={{ marginRight: "10px" }}
          />
          <TextField
            label="Reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            variant="outlined"
            color="warning"
            style={{ marginRight: "10px" }}
          />
          <Button variant="contained" color="warning" onClick={handleAddSet}>
            Add Set
          </Button>
        </div>

        <div className="setsList">
          {sets.map((set, index) => (
            <div key={index} className="setItem">
              <h4>
                Set {index + 1}: {set.weight} kg, {set.reps} reps
              </h4>
              <button onClick={() => handleDeleteSet(index)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>

        <Button
          variant="contained"
          color="warning"
          onClick={handleSave}
          style={{ marginTop: "20px" }}
        >
          Save Workout
        </Button>
      </div>
    </div>
  );
};

export default ExerciseTrackerPopup;
