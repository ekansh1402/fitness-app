import React, { useRef, useState } from "react";
import "../popup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const WaterIntakePopup = ({ setShowPopup, onSave }) => {
  const dateTimeRef = useRef(dayjs());
  const [showPicker, setShowPicker] = useState(true);
  const [waterIntake, setWaterIntake] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Handle OK button click
  const handleOKClick = () => {
    setShowPicker(false);
    setErrorMsg(""); // Clear any previous errors
  };

  // Allow editing the date and time
  const handleEditClick = () => {
    setShowPicker(true);
  };

  // Save water intake data
  const handleSaveAll = () => {
    const selectedDateTime = dateTimeRef.current;

    // Validate inputs
    if (!selectedDateTime) {
      setErrorMsg("Please select a valid date and time!");
      return;
    }

    if (!waterIntake.trim() || isNaN(waterIntake) || waterIntake <= 0) {
      setErrorMsg("Please enter a valid water intake amount (liters)!");
      return;
    }

    const waterData = {
      dateTime: selectedDateTime.format("MMMM D, YYYY h:mm A"),
      waterIntake: parseFloat(waterIntake),
    };

    onSave(waterData); // Call Redux or server save function
    setShowPopup(false); // Close the popup after saving
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        {/* Close button */}
        <button className="close" onClick={() => setShowPopup(false)}>
          <AiOutlineClose />
        </button>

        <h2>Water Intake</h2>

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

        {/* Water Intake Input */}
        <TextField
          label="Water Intake (liters)"
          variant="outlined"
          color="warning"
          fullWidth
          value={waterIntake}
          onChange={(e) => setWaterIntake(e.target.value)}
          style={{ marginTop: "10px" }}
        />

        {/* Save Button */}
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveAll}
          style={{ marginTop: "20px" }}
        >
          Save Water Intake
        </Button>
      </div>
    </div>
  );
};

export default WaterIntakePopup;
