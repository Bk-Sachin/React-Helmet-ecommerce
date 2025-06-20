import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";
import productContext from "./ProductContext";
import { cartReducer } from "./Reducer";

const ProductState = (props) => {
  const products = [
    {
      _id: 1,
      title: "Bike Helmet x3eret",
      price: 10000,
      oldPrice: 12500,
      description:
        "Experience superior protection and comfort with our state-of-the-art bike helmet.",
      instock: 5,
      image: "/assets/h1.jpg",
      category: "Mountain Bike Helmets",
    },
    {
      _id: 2,
      title: "Scooter Helmet 1234et",
      price: 5000,
      oldPrice: 6000,
      description: "Stylish and secure, perfect for urban scooter riders.",
      instock: 3,
      image: "/assets//h2.jpg",
      category: "Urban Scooter Helmets",
    },
    {
      _id: 3,
      title: "Motorcycle Helmet 5678et",
      price: 15000,
      oldPrice: 18000,
      description:
        "Robust full-face helmet designed for maximum road safety and aerodynamics.",
      instock: 2,
      image: "/assets//h3.jpg",
      category: "Full-Face Motorcycle Helmets",
    },
  ];
  const [product, setProducts] = useState(products);
  const [state, dispatch] = useReducer(cartReducer, {
    products: product,
    cart: [],
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jsonApiData, setJsonApiData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      getUser();
    } else {
      setLoading(false);
    }
  }, []);

  const getUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem("authToken");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      let response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1"
      );
      let User = await response.json();
      console.log("this jsonplace user", User);
      setJsonApiData(User);
    } catch (error) {
      console.error("Error fetching JSON API data:", error);
    }
  };

  const allProduct = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products ", {
        method: "GET", //read
        headers: {
          "Content-Type": "application/json",
          "auth-token": "mytoken",
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      res.status(500).send("internal server error");
    }
  };
  //edit product
  const editProduct = async (id, updateData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://localhost:5000/api/product/updateproduct/${id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update product"
      );
    }
  };
  //delete product
  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `http://localhost:5000/api/product/deleteproduct/${id}`,
        {
          headers: {
            "auth-token": token,
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  };

  const addProduct = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await axios.post(
        "http://localhost:5000/api/product/addproduct",
        formData,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      const newProduct = response.data;
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      return { success: true, product: newProduct };
    } catch (error) {
      console.error("Error adding product:", error);

      if (error.response) {
        const errorData = error.response.data;

        if (errorData.errors) {
          const messages = errorData.errors.map((e) => e.msg).join(", ");
          return { success: false, error: messages };
        }
        return {
          success: false,
          error: errorData.message || "Failed to add product",
        };
      }

      return {
        success: false,
        error: error.message || "Network error occurred",
      };
    }
  };

  return (
    <productContext.Provider
      value={{
        products,
        user,
        jsonApiData,
        loading,
        getUser,
        logout,
        fetchUser,
        allProduct,
        editProduct,
        deleteProduct,
        state,
        dispatch,
        addProduct,
      }}
    >
      {props.children}
    </productContext.Provider>
  );
};

export default ProductState;
