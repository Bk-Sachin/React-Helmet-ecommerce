import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductCarousel.css";

const ProductCarousel = ({ mode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/api/product/getallproduct");
        // Show the latest 5 products
        setProducts(response.data.slice(-5).reverse());
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="carousel-loading">Loading products...</div>;
  if (error) return <div className="carousel-error">{error}</div>;
  if (products.length === 0) return <div className="carousel-empty">No products to preview.</div>;

  return (
    <div className={`product-carousel-section${mode === "dark" ? " product-carousel-section-dark" : " product-carousel-section-light"}`}>
      <div className="carousel-title">Latest Products</div>
      <div className="carousel-row">
        {products.map((item) => (
          <div className={`carousel-card${mode === "dark" ? " carousel-card-dark" : " carousel-card-light"}`} key={item._id}>
            <div className="carousel-img-container">
              <img className="carousel-img" src={item.image?.startsWith("/uploads/") ? `http://localhost:5000${item.image}` : item.image} alt={item.title} />
            </div>
            <div className="carousel-info">
              <div className="carousel-cat">{item.category}</div>
              <div className="carousel-title">{item.title}</div>
              <div className="carousel-price">NRP {item.price}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-viewall-btn" onClick={() => navigate("/Helmets")}>View All</button>
    </div>
  );
};

export default ProductCarousel; 