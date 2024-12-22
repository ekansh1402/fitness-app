import React, { useState } from "react";
import "./AuthPopup.css";
import logo from "../../assets/logo.png"; // Ensure this path is correct
import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../store/slices/authSlice"; // Import Redux actions

const AuthPopup = (props) => {
  const dispatch = useDispatch();

  const [showSignup, setShowSignup] = useState(false);

  const [signupFormData, setSignupFormData] = useState({
    name: "",
    email: "",
    password: "",
    weightInKg: 0.0,
    heightInCm: 0.0,
    goal: "",
    gender: "",
    dob: dayjs(), // Initialize with Dayjs object
    activityLevel: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const handleSignupChange = (field, value) => {
    setSignupFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoginChange = (field, value) => {
    setLoginFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = () => {
    dispatch(loginUser(loginFormData)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Login successful!");
        props.setShowPopup(false);
      } else {
        toast.error(response.payload.message || "Login failed.");
      }
    });
  };

  const handleSignup = () => {
    const formattedData = {
      ...signupFormData,
      dob: signupFormData.dob.toISOString(), // Convert Dayjs object to ISO format
    };

    dispatch(registerUser(formattedData)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Signup successful!");
        setShowSignup(false);
      } else {
        console.log(response);
        toast.error(response.payload.message || "Signup failed.");
      }
    });
  };

  return (
    <div className="popup">
      {props.notShow && (
        <button className="close" onClick={() => props.setShowPopup(false)}>
          <AiOutlineClose />
        </button>
      )}
      {showSignup ? (
        <div className="authform">
          <div className="left">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "150px", height: "auto" }}
            />
          </div>
          <div className="right">
            <h1>Signup to become a freak</h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <TextField
                fullWidth
                color="warning"
                margin="normal"
                label="Name"
                variant="outlined"
                value={signupFormData.name}
                onChange={(e) => handleSignupChange("name", e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                type="email"
                value={signupFormData.email}
                onChange={(e) => handleSignupChange("email", e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                variant="outlined"
                type="password"
                value={signupFormData.password}
                onChange={(e) => handleSignupChange("password", e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Weight (kg)"
                variant="outlined"
                type="number"
                value={signupFormData.weightInKg}
                onChange={(e) =>
                  handleSignupChange("weightInKg", parseFloat(e.target.value))
                }
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="activity-level-label">
                  Activity Level
                </InputLabel>
                <Select
                  labelId="activity-level-label"
                  value={signupFormData.activityLevel}
                  onChange={(e) =>
                    handleSignupChange("activityLevel", e.target.value)
                  }
                >
                  <MenuItem value="sedentary">Sedentary</MenuItem>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="veryActive">Very Active</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="goal-label">Goal</InputLabel>
                <Select
                  labelId="goal-label"
                  value={signupFormData.goal}
                  onChange={(e) => handleSignupChange("goal", e.target.value)}
                >
                  <MenuItem value="weightLoss">Lose</MenuItem>
                  <MenuItem value="weightMaintain">Maintain</MenuItem>
                  <MenuItem value="weightGain">Gain</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  value={signupFormData.gender}
                  onChange={(e) => handleSignupChange("gender", e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                label="Height (cm)"
                variant="outlined"
                type="number"
                value={signupFormData.heightInCm}
                onChange={(e) =>
                  handleSignupChange("heightInCm", parseFloat(e.target.value))
                }
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date of Birth"
                  inputFormat="MM/DD/YYYY"
                  value={signupFormData.dob}
                  onChange={(newValue) => handleSignupChange("dob", newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" />
                  )}
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleSignup}
                sx={{ marginTop: "16px" }}
              >
                Signup
              </Button>
            </form>
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setShowSignup(false);
                }}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div className="authform">
          <div className="left">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "150px", height: "auto" }}
            />
          </div>
          <div className="right">
            <h1>Login to become a freak</h1>
            <form>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={loginFormData.email}
                onChange={(e) => handleLoginChange("email", e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type="password"
                value={loginFormData.password}
                onChange={(e) => handleLoginChange("password", e.target.value)}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                Login
              </button>
            </form>
            <p>
              Don't have an account?{" "}
              <button onClick={() => setShowSignup(true)}>Signup</button>
            </p>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AuthPopup;
