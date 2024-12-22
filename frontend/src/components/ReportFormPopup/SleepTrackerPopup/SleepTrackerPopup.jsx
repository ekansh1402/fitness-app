import React, { useRef, useState } from "react";
import "../popup.css";
import Button from "@mui/material/Button";
import { AiOutlineClose } from "react-icons/ai";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const SleepTrackerPopup = ({ setShowPopup, saveSleepData }) => {
  const startTimeRef = useRef(dayjs());
  const endTimeRef = useRef(dayjs());
  const [editingStartTime, setEditingStartTime] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle confirmation of time selection
  const handleOKClick = (ref) => {
    setEditingStartTime(false);
    setErrorMsg(""); // Clear any errors
  };

  // Allow editing of the time again
  const handleEditClick = () => {
    setEditingStartTime(true);
  };

  // Save sleep data to the server or Redux
  const handleSaveAll = () => {
    const startTime = startTimeRef.current;
    const endTime = endTimeRef.current;

    // Validate inputs
    if (!startTime || !endTime) {
      setErrorMsg("Both start and end times must be selected!");
      return;
    }

    if (endTime.isBefore(startTime)) {
      setErrorMsg("End time must be after start time!");
      return;
    }

    const sleepData = {
      startTime: startTime.format("MMMM D, YYYY h:mm A"),
      endTime: endTime.format("MMMM D, YYYY h:mm A"),
    };

    saveSleepData(sleepData); // Call Redux or server save function
    setShowPopup(false); // Close the popup after saving
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        {/* Close button */}
        <button className="close" onClick={() => setShowPopup(false)}>
          <AiOutlineClose />
        </button>

        <h2>Sleep Tracker</h2>

        {/* Error Message */}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        {/* Start Time Picker */}
        {editingStartTime ? (
          <div className="datetimebox">
            <h3>Sleep Start Time:</h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                defaultValue={startTimeRef.current}
                onChange={(newValue) => {
                  startTimeRef.current = newValue;
                }}
                onAccept={() => handleOKClick(startTimeRef)}
              />
            </LocalizationProvider>
          </div>
        ) : (
          <div className="selectedDateTime">
            <h3>Sleep Start Time:</h3>
            <p>{startTimeRef.current.format("MMMM D, YYYY h:mm A")}</p>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </div>
        )}

        {/* End Time Picker */}
        {editingStartTime ? (
          <div className="datetimebox">
            <h3>Sleep End Time:</h3>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                defaultValue={endTimeRef.current}
                onChange={(newValue) => {
                  endTimeRef.current = newValue;
                }}
                onAccept={() => handleOKClick(endTimeRef)}
              />
            </LocalizationProvider>
          </div>
        ) : (
          <div className="selectedDateTime">
            <h3>Sleep End Time:</h3>
            <p>{endTimeRef.current.format("MMMM D, YYYY h:mm A")}</p>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </div>
        )}

        {/* Save Button */}
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveAll}
          style={{ marginTop: "20px" }}
        >
          Save Sleep Data
        </Button>
      </div>
    </div>
  );
};

export default SleepTrackerPopup;
