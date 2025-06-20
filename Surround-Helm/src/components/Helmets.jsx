import React, { useContext, useEffect, useState } from "react";
import productContext from "../context/ProductContext";
import { BsThreeDots } from "react-icons/bs";
import "./Helmets.css";
import EditProductModal from "./EditProductModal";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Helmet = () => {
  const context = useContext(productContext);
  const {
    state: { cart, products },
    dispatch,
    product,
    allProduct,
    editProduct,
    deleteProduct,
  } = context; //destructuring

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  const toggleMenu = (id) => {
    console.log("clicked id", id);
    setMenuVisible((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const openEditModal = (product) => {
    // console.log("edit product", product);
    setSelectedProduct(product);
    setModalVisible(true);
  };
  const closeEditModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };
  const savedEdit = (updateData) => {
    editProduct(updateData, selectedProduct._id);
  };
  const handleDelete = async (id) => {
    console.log("delete product", id);

    await deleteProduct(id);
  };
  useEffect(() => {
    allProduct();
  }, []);

  // Fetch products from backend database
  useEffect(() => {
    const fetchDbProducts = async () => {
      setDbLoading(true);
      setDbError(null);
      try {
        const token = localStorage.getItem("authToken");
        const url = searchQuery
          ? `http://localhost:5000/api/product/getallproduct?search=${encodeURIComponent(
              searchQuery
            )}`
          : "http://localhost:5000/api/product/getallproduct";
        const response = await axios.get(url, {
          headers: {
            "auth-token": token || "",
          },
        });
        setDbProducts(response.data);
      } catch (error) {
        setDbError("Failed to load marketplace helmets.");
      } finally {
        setDbLoading(false);
      }
    };
    fetchDbProducts();
  }, [searchQuery]);

  const renderHelmetCard = (
    item,
    allowEditDelete = false,
    isDbProduct = false
  ) => {
    if (!isDbProduct) {
      return (
        <div
          key={item._id}
          className={`glass-card${
            context.mode === "light" ? " glass-card-light" : ""
          }`}
        >
          <div className="glass-card-glow"></div>
          <img className="glass-card-img" src={item.image} alt={item.title} />
          <div className="glass-card-title">{item.title}</div>
          <div className="glass-card-desc">{item.description}</div>
          <div className="glass-card-price">NRP {item.price}</div>
          <button
            className="glass-card-btn"
            onClick={() => {
              dispatch({
                type:
                  cart && cart.some((p) => p._id === item._id)
                    ? "REMOVE_FROM_CART"
                    : "ADD_TO_CART",
                payload: item,
              });
            }}
          >
            {cart && cart.some((p) => p._id === item._id)
              ? "Remove from Cart"
              : "Add to Cart"}
          </button>
        </div>
      );
    }
    return (
      <div key={item._id}>
        <div className="card">
          <div className="badge">HOT SALE</div>
          <div className="tilt">
            <div className="img">
              <img
                src={
                  isDbProduct && item.image?.startsWith("/uploads/")
                    ? `http://localhost:5000${item.image}`
                    : item.image
                }
                alt={item.title}
              />
            </div>
          </div>
          <div className="info">
            <div className="cat">{item.category}</div>
            <div className="icon-title">
              <h2 className="title">{item.title}</h2>
              {allowEditDelete && (
                <BsThreeDots onClick={() => toggleMenu(item._id)} />
              )}
              {allowEditDelete && menuVisible[item._id] && (
                <div className="menu-option">
                  <button onClick={() => openEditModal(item)}>Edit</button>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              )}
            </div>
            <p className="desc">{item.description}</p>
            <div className="bottom">
              <div className="price">
                {item.oldPrice && (
                  <span className="old">NRP {item.oldPrice}</span>
                )}
                <span className="new">NRP {item.price}</span>
              </div>
              {cart && cart.some((p) => p._id === item._id) ? (
                <button
                  onClick={() => {
                    dispatch({
                      type: "REMOVE_FROM_CART",
                      payload: item,
                    });
                  }}
                  className="remove-btn"
                >
                  <span>
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch({
                      type: "ADD_TO_CART",
                      payload: item,
                    });
                  }}
                  className="cart-btn"
                >
                  <span>Add to Cart</span>
                  <svg
                    className="icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </button>
              )}
            </div>
            <div className="meta">
              {isDbProduct ? (
                <div className="seller">
                  Seller: {item.user?.name || "Unknown"}
                </div>
              ) : null}
              <div className="stock">In Stock :{item.instock}</div>
            </div>
          </div>
        </div>
        {modalVisible &&
          selectedProduct &&
          selectedProduct._id === item._id && (
            <EditProductModal
              product={selectedProduct}
              onClose={closeEditModal}
              onSave={savedEdit}
            />
          )}
      </div>
    );
  };

  return (
    <>
      <div className="helmets-page">
        <div className="container">
          <h2 className="section-title">
            <span className="section-accent">Featured</span> Helmets
          </h2>

          <div className="helmets-container">
            {products.map((item) => renderHelmetCard(item, true, false))}
          </div>

          <hr className="section-divider" />

          <h2 className="section-title">
            <span className="section-accent">Marketplace</span> Helmets
          </h2>
          {searchQuery && (
            <div className="db-search-info">
              Showing results for: <b>{searchQuery}</b>
            </div>
          )}
          {dbLoading ? (
            <div className="db-loading">Loading marketplace helmets...</div>
          ) : dbError ? (
            <div className="db-error">{dbError}</div>
          ) : dbProducts.length === 0 ? (
            <div className="db-empty">
              No marketplace helmets found
              {searchQuery ? ` for "${searchQuery}"` : "."}
            </div>
          ) : (
            <div className="helmets-container">
              {dbProducts.map((item) => renderHelmetCard(item, false, true))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Helmet;
