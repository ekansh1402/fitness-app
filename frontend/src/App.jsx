import { useState } from "react";
import { Navbar } from "./components/Navbar/Navbar.jsx";
import "./App.css";
import Home from "./components/Home/Home.jsx";
import Report from "./components/Report/Report.jsx";
import Workout from "./components/Workout/Workout.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile/Profile.jsx";
import About from "./components/About/About.jsx";
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="/workout/:id" element={<Workout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
