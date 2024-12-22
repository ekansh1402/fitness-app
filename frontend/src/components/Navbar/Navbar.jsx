import React from "react";
import logo from "../../assets/logo.png";
import { IoIosBody } from "react-icons/io";
import { Link } from "react-router-dom";
import "./Navbar.css";
import AuthPopup from "../AuthPopup/AuthPopup";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/AuthSlice";

export const Navbar = () => {
  const [showPopup, setShowPopup] = React.useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const notShow = true;
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="navbar-logo" />
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/profile">
        <IoIosBody />
      </Link>
      {!isAuthenticated ? (
        <button onClick={() => setShowPopup(true)}>Login</button>
      ) : (
        <button
          onClick={() => {
            dispatch(logout()); // Dispatch logout action
          }}
        >
          Logout
        </button>
      )}
      {showPopup && <AuthPopup setShowPopup={setShowPopup} notShow={notShow} />}
    </nav>
  );
};
