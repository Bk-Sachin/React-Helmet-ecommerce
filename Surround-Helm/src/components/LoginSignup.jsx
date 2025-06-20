import React, { useState, useContext } from "react";
import "./LoginSignup.css";
import { useNavigate } from "react-router-dom";
import productContext from "../context/ProductContext";

const LoginSignup = ({ mode }) => {
  const navigate = useNavigate();
  const context = useContext(productContext);
  const { getUser } = context;
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  const toggleSignUpPasswordVisibility = () => {
    setShowSignUpPassword((prevState) => !prevState);
  };

  const toggleSignInPasswordVisibility = () => {
    setShowSignInPassword((prevState) => !prevState);
  };

  const [credential, setCredential] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url = "";
    let body = {};

    if (isRightPanelActive) {
      url = "http://localhost:5000/api/auth/createuser";
      const { name, email, password } = credential;
      body = JSON.stringify({ name, email, password });
    } else {
      url = "http://localhost:5000/api/auth/login";
      const { email, password } = credential;
      body = JSON.stringify({ email, password });
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      const data = await response.json();

      if (response.ok) {
        if (isRightPanelActive) {
          // If signup is successful, navigate to the login panel
          setIsRightPanelActive(false);
          alert("Account created successfully! Please log in.");
        } else {
          // If login is successful
          if (data.authToken) {
            localStorage.setItem("authToken", data.authToken);
            await getUser();
            navigate("/");
          }
        }
      } else {
        console.error(
          "API Error:",
          data.message || (data.errors && data.errors[0].msg)
        );
        alert(
          data.message ||
            (data.errors && data.errors[0].msg) ||
            "An unknown error occurred."
        );
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Could not connect to the server. Please try again.");
    }
  };

  const onChange = (e) => {
    setCredential({ ...credential, [e.target.name]: e.target.value });
  };

  return (
    <div className="losign-body">
      <div
        className={`losign-container ${
          isRightPanelActive ? "losign-right-panel-active" : ""
        }`}
        id="losign-container"
      >
        <div className="losign-form-container losign-sign-up-container">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <div className="losign-social-container">
              <a href="#" className="losign-social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="losign-social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="losign-social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={credential.name}
              onChange={onChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={credential.email}
              onChange={onChange}
              required
            />
            <div className="losign-password-input-wrapper">
              <input
                type={showSignUpPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={credential.password}
                onChange={onChange}
                required
              />
              <span
                className="losign-password-toggle-icon"
                onClick={toggleSignUpPasswordVisibility}
              >
                <i
                  className={`fa ${
                    showSignUpPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </span>
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="losign-form-container losign-sign-in-container">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="losign-social-container">
              <a href="#" className="losign-social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="losign-social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="losign-social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={credential.email}
              onChange={onChange}
              required
            />
            <div className="losign-password-input-wrapper">
              <input
                type={showSignInPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={credential.password}
                onChange={onChange}
                required
              />
              <span
                className="losign-password-toggle-icon"
                onClick={toggleSignInPasswordVisibility}
              >
                <i
                  className={`fa ${
                    showSignInPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </span>
            </div>
            <a href="#">Forgot your password?</a>
            <button type="submit">Login</button>
          </form>
        </div>
        <div className="losign-overlay-container">
          <div className="losign-overlay">
            <div className="losign-overlay-panel losign-overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="losign-ghost"
                id="signIn"
                onClick={handleSignInClick}
              >
                Login
              </button>
            </div>
            <div className="losign-overlay-panel losign-overlay-right">
              <h1>Hello!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="losign-ghost"
                id="signUp"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
