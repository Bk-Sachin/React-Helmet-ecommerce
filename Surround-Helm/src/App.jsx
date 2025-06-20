import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Helmets from "./components/Helmets.jsx";
import Accessories from "./components/Accessories.jsx";
import LoginSignup from "./components/LoginSignup.jsx";
import Footer from "./components/Footer.jsx";
import ProductState from "./context/ProductState.jsx";
import JsonApi from "./components/JsonApi.jsx";
import Cart from "./components/Cart.jsx";
import AddProduct from "./components/AddProduct.jsx";
import MyProducts from "./components/MyProducts.jsx";

function App() {
  const [text, setText] = useState("Light Mode");
  const [mode, setMode] = useState("light");
  let brandName = "Helmet";

  let toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
      setText("Light Mode");
    } else {
      setMode("light");
      setText("Dark mode");
    }
  };

  return (
    <>
      <ProductState>
        <Router>
          <Navbar
            mode={mode}
            text={text}
            brandName={brandName}
            toggleMode={toggleMode}
          />

          <Routes>
            <Route
              path="/"
              element={<Hero mode={mode} toggleMode={toggleMode} />}
            />
            <Route path="/Helmets" element={<Helmets />} />
            <Route path="/LoginSignup" element={<LoginSignup mode={mode} />} />
            <Route path="/JsonApi" element={<JsonApi />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/AddProduct" element={<AddProduct />} />
            <Route path="/myproducts" element={<MyProducts />} />
          </Routes>
          <Footer mode={mode} />
        </Router>
      </ProductState>
    </>
  );
}

export default App;
