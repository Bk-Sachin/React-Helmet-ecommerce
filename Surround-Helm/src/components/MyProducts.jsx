import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import productContext from "../context/ProductContext";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./Helmets.css";
import EditProductModal from "./EditProductModal";

const MyProducts = () => {
  const { state: { cart }, dispatch, editProduct, deleteProduct, user } = useContext(productContext);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/api/product/getproduct", {
          headers: {
            "auth-token": token || "",
          },
        });
        setMyProducts(response.data);
      } catch (err) {
        setError("Failed to load your products.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };
  const closeEditModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };
  const savedEdit = async (updateData) => {
    try {
      const updated = await editProduct(selectedProduct._id, updateData);
      setMyProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      closeEditModal();
    } catch (err) {
      alert(err.message || "Failed to update product");
    }
  };
  const handleDelete = async (id) => {
    await deleteProduct(id);
    setMyProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const renderHelmetCard = (item) => (
    <div key={item._id}>
      <div className="card">
        <div className="badge">MY PRODUCT</div>
        <div className="tilt">
          <div className="img">
            <img
              src={
                item.image?.startsWith('/uploads/')
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
          </div>

          <p className="desc">{item.description}</p>

          <div className="bottom">
            <div className="price">
              {item.oldPrice && (
                <span className="old">${item.oldPrice}</span>
              )}
              <span className="new">${item.price}</span>
            </div>
            <button className="edit-btn" onClick={() => openEditModal(item)}>
              <FiEdit2 /> Edit
            </button>
            <button className="delete-btn" onClick={() => handleDelete(item._id)}>
              <FiTrash2 /> Delete
            </button>
          </div>
          <div className="meta">
            <div className="stock">In Stock :{item.instock}</div>
          </div>
        </div>
      </div>
      {modalVisible && selectedProduct && selectedProduct._id === item._id && (
        <EditProductModal
          product={selectedProduct}
          onClose={closeEditModal}
          onSave={savedEdit}
        />
      )}
    </div>
  );

  return (
    <div className="helmets-page">
      <div className="container">
        <h2 className="section-title">My Products</h2>
        {loading ? (
          <div className="db-loading">Loading your products...</div>
        ) : error ? (
          <div className="db-error">{error}</div>
        ) : myProducts.length === 0 ? (
          <div className="db-empty">You have not added any products yet.</div>
        ) : (
          <div className="helmets-container">
            {myProducts.map((item) => renderHelmetCard(item))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts; 