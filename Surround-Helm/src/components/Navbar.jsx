// Navbar.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaCartShopping } from "react-icons/fa6";
import { WiDaySunny, WiMoonAltWaxingCrescent3 } from "react-icons/wi";
import { FaUser, FaSignOutAlt, FaPlus, FaBoxOpen } from "react-icons/fa";
import productContext from "../context/ProductContext";

const Navbar = (props) => {
  const context = useContext(productContext);
  const {
    state: { cart },
    user,
    logout,
  } = context;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className={`navbar-${props.mode}`}>
        <div className="container">
          <h1 className="logo">{props.brandName} </h1>
          <nav className="nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/Helmets" className="nav-link">
              Helmets
            </Link>
            <Link to="/Accessories" className="nav-link">
              Accessories
            </Link>
            <Link to="/JsonApi" className="nav-link">
              JsonAPI:hit
            </Link>
          </nav>

          <div className="nav-controls">
            <Link to={"/Cart"}>
              <div className="cart-icon-container">
                <FaCartShopping className="cart-icon" />
                {cart && cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
                )}
              </div>
            </Link>
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-bar" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  navigate(`/Helmets?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery("");
                }
              }}
            />

            {user ? (
              <div className="user-menu-container" ref={userMenuRef}>
                <button 
                  className="user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <FaUser className="user-icon" />
                  <span>{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link to="/myproducts" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <FaBoxOpen />
                      <span>My Products</span>
                    </Link>
                    <Link to="/addproduct" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <FaPlus />
                      <span>Add Product</span>
                    </Link>
                    <button className="logout-button" onClick={handleLogout}>
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="super-button">
                <Link to="/LoginSignup" className="nav-link">
                  <span>Login/Signup</span>
                  <svg fill="none" viewBox="0 0 24 24" className="arrow">
                    <path
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2"
                      stroke="currentColor"
                      d="M5 12h14M13 6l6 6-6 6"
                    ></path>
                  </svg>
                </Link>
              </button>
            )}
            
            <div
              className={`theme-toggle-switch ${
                props.mode === "dark" ? "dark-mode" : "light-mode"
              }`}
              onClick={props.toggleMode}
            >
              <div className="slider">
                <WiDaySunny className="icon sun-icon" />
                <WiMoonAltWaxingCrescent3 className="icon moon-icon" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
