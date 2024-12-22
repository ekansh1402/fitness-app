import React, { useRef, useState } from "react";
import "../popup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const WeightTrackerPopup = ({ setShowPopup, onSave }) => {
  const dateTimeRef = useRef(dayjs());
  const [showPicker, setShowPicker] = useState(true);
  const [weight, setWeight] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleOKClick = () => {
    setShowPicker(false);
    setErrorMsg(""); // Clear any previous errors
  };

  const handleEditClick = () => {
    setShowPicker(true);
  };

  const handleSaveAll = () => {
    const selectedDateTime = dateTimeRef.current;

    // Validate inputs
    if (!selectedDateTime) {
      setErrorMsg("Please select a valid date and time!");
      return;
    }

    if (!weight.trim() || isNaN(weight) || weight <= 0) {
      setErrorMsg("Please enter a valid weight (kg)!");
      return;
    }

    const weightData = {
      dateTime: selectedDateTime.format("MMMM D, YYYY h:mm A"),
      weight: parseFloat(weight),
    };

    onSave(weightData); // Call Redux or server save function
    setShowPopup(false); // Close the popup after saving
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        {/* Close button */}
        <button className="close" onClick={() => setShowPopup(false)}>
          <AiOutlineClose />
        </button>

        <h2>Weight Tracker</h2>

        {/* Error Message */}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        {/* DateTime Picker */}
        {showPicker ? (
          <div className="datetimebox">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                defaultValue={dateTimeRef.current}
                onChange={(newValue) => {
                  dateTimeRef.current = newValue;
                }}
                onAccept={handleOKClick}
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
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </div>
        )}

        {/* Weight Input */}
        <TextField
          label="Weight (kg)"
          variant="outlined"
          color="warning"
          fullWidth
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{ marginTop: "10px" }}
        />

        {/* Save Button */}
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveAll}
          style={{ marginTop: "20px" }}
        >
          Save Weight Data
        </Button>
      </div>
    </div>
  );
};

export default WeightTrackerPopup;
