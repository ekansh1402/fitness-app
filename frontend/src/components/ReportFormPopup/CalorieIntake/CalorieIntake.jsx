import React, { useRef, useState } from "react";
import "../popup.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { addCalorieEntry } from "../../../store/slices/CalorieSlice";
import { useDispatch } from "react-redux";
const CalorieIntakePopup = ({ setShowPopup }) => {
  const dateTimeRef = useRef(null); // Ref for date and time picker
  const [showPicker, setShowPicker] = useState(true);
  const dispatch = useDispatch();
  // State for input fields, items list, and error messages
  const [foodName, setFoodName] = useState("");
  const [foodAmount, setFoodAmount] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle confirmation of date and time selection
  const handleOKClick = () => {
    if (dateTimeRef.current) {
      setShowPicker(false);
      setErrorMsg(""); // Clear any previous errors
    } else {
      setErrorMsg("Please select a valid date and time!");
    }
  };

  // Allow editing the selected date and time
  const handleEditClick = () => {
    setShowPicker(true);
  };

  // Handle saving the food item
  const handleAddItem = () => {
    // Validate date
    if (!dateTimeRef.current) {
      setErrorMsg("Please select a valid date and time!");
      return;
    }

    // Validate input fields
    if (!foodName.trim() || !foodAmount.trim()) {
      setErrorMsg("Both fields are required!");
      return;
    }

    const newItem = {
      id: Date.now(),
      dateTime: dateTimeRef.current.format("MMMM D, YYYY h:mm A"),
      name: foodName,
      amount: foodAmount,
    };

    // Add new item to the list
    setFoodItems((prevItems) => [...prevItems, newItem]);
    setFoodName(""); // Clear input fields
    setFoodAmount("");
    setErrorMsg(""); // Clear any previous errors
  };

  // Handle deleting a specific item
  const handleDelete = (id) => {
    setFoodItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Save all data (send to server or Redux)
  const handleSaveAll = () => {
    if (foodItems.length === 0) {
      setErrorMsg("Please add at least one food item before saving.");
      return;
    }

    const dataToSave = {
      dateTime: dateTimeRef.current
        ? dateTimeRef.current.format("MMMM D, YYYY h:mm A")
        : null,
      foodItems,
    };
    console.log("hi");
    dispatch(addCalorieEntry(dataToSave)); // Call Redux or server save function
    setShowPopup(false); // Close popup after saving
  };

  return (
    <div className="popupout">
      <div className="popupbox">
        {/* Close button */}
        <button className="close" onClick={() => setShowPopup(false)}>
          <AiOutlineClose />
        </button>

        {/* Conditionally render DateTimePicker or selected value */}
        {showPicker ? (
          <div className="datetimebox">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                defaultValue={dayjs()}
                onChange={(newValue) => {
                  dateTimeRef.current = newValue; // Set date-time in ref
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
              color="primary"
              onClick={handleEditClick}
            >
              Edit
            </Button>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        {/* Text Fields */}
        <TextField
          label="Food item name"
          variant="outlined"
          color="warning"
          fullWidth
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />
        <TextField
          label="Food item amount (in gms)"
          variant="outlined"
          color="warning"
          fullWidth
          value={foodAmount}
          onChange={(e) => setFoodAmount(e.target.value)}
          style={{ marginTop: "10px" }}
        />

        {/* Add Button */}
        <Button
          variant="contained"
          color="warning"
          onClick={handleAddItem}
          style={{ marginTop: "10px" }}
        >
          Add Item
        </Button>

        <div className="hrline"></div>

        {/* Items List */}
        <div className="items">
          {foodItems.map((item) => (
            <div className="item" key={item.id}>
              <h3>{item.name}</h3>
              <h3>{item.amount} gms</h3>
              <p style={{ fontSize: "0.8rem" }}>{item.dateTime}</p>
              <button onClick={() => handleDelete(item.id)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>

        {/* Save All Button */}
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveAll}
          style={{ marginTop: "20px" }}
        >
          Save All
        </Button>
      </div>
    </div>
  );
};

export default CalorieIntakePopup;
