import React from "react";
import bicycle from "../assets/h1.jpg";
import scooter from "../assets/h2.jpg";
import bike from "../assets/h3.jpg";
const Card = ({ mode }) => {
  return (
    <div className="container">
      <div className="tcard">
        <div className={`cards-${mode}`}>
          <div className={`card-${mode}`}>
            <img src={bicycle} alt="" />
            <h3>Bicycle</h3>
          </div>
          <div className={`card-${mode}`}>
            <img src={scooter} alt="" />
            <h3>Scooter</h3>
          </div>
          <div className={`card-${mode}`}>
            <img src={bike} alt="" />
            <h3>Bike</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
