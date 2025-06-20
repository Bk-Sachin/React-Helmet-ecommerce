import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productContext from "../context/ProductContext";
import "./AddProduct.css";
import { FiPackage, FiLogIn, FiUpload, FiXCircle } from "react-icons/fi";

const AddProduct = () => {
  const context = useContext(productContext);
  const { user, addProduct } = context;
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    instock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Create a preview whenever the imageFile state changes
    if (!imageFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreview(objectUrl);

    // Free memory when the component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("instock", product.instock);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const result = await addProduct(formData);

    if (result.success) {
      setSuccess("Product added successfully! Redirecting...");
      setProduct({ title: "", price: "", description: "", category: "", instock: "" });
      setImageFile(null);
      setPreview(null);
      setTimeout(() => navigate("/helmets"), 2000);
    } else {
      setError(result.error || "An unknown error occurred.");
    }
  };

  if (!user) {
    return (
      <div className="add-product-unauthorized">
        <div className="unauthorized-card">
          <FiLogIn className="unauthorized-icon" />
          <h2>Access Denied</h2>
          <p>You must be logged in to add a product.</p>
          <button onClick={() => navigate("/loginsignup")} className="login-redirect-btn">
            Login or Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <div className="add-product-header">
          <FiPackage />
          <h1>Add a New Product</h1>
        </div>
        
        {error && <div className="form-message error-message">{error}</div>}
        {success && <div className="form-message success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input type="text" name="title" value={product.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input type="text" name="category" value={product.category} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (NRP)</label>
              <input type="number" name="price" value={product.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="instock">In Stock (Quantity)</label>
              <input type="number" name="instock" value={product.instock} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea name="description" value={product.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <div className="image-upload-area">
              <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} className="image-input"/>
              <label htmlFor="image" className="image-upload-label">
                <FiUpload />
                <span>{imageFile ? imageFile.name : "Click to upload an image"}</span>
              </label>
              {preview && (
                <div className="image-preview-container">
                    <img src={preview} alt="Image Preview" className="image-preview" />
                    <button type="button" onClick={clearImage} className="clear-image-btn"><FiXCircle /></button>
                </div>
              )}
            </div>
          </div>
          
          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
