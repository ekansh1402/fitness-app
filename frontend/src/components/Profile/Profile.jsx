import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserDetails,
  updateUserProfile,
} from "../../store/slices/userSlice"; // Adjust path as needed
import "./Profile.css";
const Profile = () => {
  const dispatch = useDispatch();

  // State from Redux store
  const { details, status, error } = useSelector((state) => state.user);

  // Local state for editable fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    weight: "",
    height: "",
    gender: "",
    dob: "",
    goal: "",
    activityLevel: "",
  });

  // Fetch user details on component mount
  useEffect(() => {
    dispatch(fetchUserDetails())
      .unwrap()
      .then((data) => {
        // Populate form fields with fetched user details
        setFormData({
          name: data.data.name,
          email: data.data.email,
          weight: data.data.weight[0]?.weight || "",
          height: data.data.height[0]?.height || "",
          gender: data.data.gender,
          dob: data.data.dob,
          goal: data.data.goal,
          activityLevel: data.data.activityLevel,
        });
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }, [dispatch]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData))
      .unwrap()
      .then(() => {
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Failed to update profile. Please try again.");
      });
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message || "Something went wrong."}</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} readOnly />
        </div>
        <div>
          <label>Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Height (cm):</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Goal:</label>
          <input
            type="text"
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Activity Level:</label>
          <input
            type="text"
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
