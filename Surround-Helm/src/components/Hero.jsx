import React from "react";
import heroDark from "../assets/hero-dark.png";
import heroLight from "../assets/hero-light.png";
import Card from "./Card.jsx";
import ProductCarousel from "./ProductCarousel.jsx";
import { useNavigate } from "react-router-dom";

export function Hero({ mode }) {
  const banner = mode === "dark" ? heroDark : heroLight;
  const navigate = useNavigate();
  return (
    <>
      <div className={`hero-section-${mode}`}>
        <div className="image">
          <img src={banner} alt="Helmet Banner" />

          <div className={`hero-${mode}`}>
            <h1>Best Helmet</h1>
            <p>
              best Helmet in the town, all the official brands with authentic
              accessories
            </p>
            <div className={`hero-${mode}-buttons`}>
              <button className={`btn primary-${mode}`}>Overview</button>
              <button
                className={`btn secondary-${mode}`}
                onClick={() => navigate("/Helmets")}
              >
                Start your passion
              </button>
            </div>
          </div>
        </div>
        <ProductCarousel mode={mode} />
        <Card mode={mode} />
      </div>
    </>
  );
}

export default Hero;
