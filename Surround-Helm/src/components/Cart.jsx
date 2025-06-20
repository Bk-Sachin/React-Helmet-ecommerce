import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productContext from "../context/ProductContext";
import "./Cart.css";
import { AiFillDelete, AiOutlineShoppingCart, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaTruck, FaShieldAlt, FaCreditCard } from "react-icons/fa";

const Cart = () => {
  const context = useContext(productContext);
  const {
    state: { cart },
    dispatch,
    user,
  } = context;
  const navigate = useNavigate();

  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    let timer;
    if (showCountdown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      navigate("/LoginSignup");
    }
    return () => clearTimeout(timer);
  }, [showCountdown, countdown, navigate]);

  const Total = cart.reduce((acc, cur) => acc + cur.price * cur.qty, 0);
  const shipping = Total > 5000 ? 0 : 500;
  const finalTotal = Total + shipping;

  const updateQuantity = (item, newQty) => {
    if (newQty > 0 && newQty <= item.instock) {
      dispatch({
        type: "UPDATE_CART_ITEM",
        payload: { _id: item._id, qty: newQty },
      });
    }
  };

  const removeFromCart = (item) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: item,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-container">
          <AiOutlineShoppingCart className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button className="continue-shopping-btn">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {showCountdown && (
        <div className="countdown-modal-overlay">
          <div className="countdown-modal-card">
            <h2>Please Login to Checkout</h2>
            <p className="countdown-message">
              You need to be logged in to proceed to checkout.
            </p>
            <div className="countdown-timer">
              Redirecting to login/signup in <b>{countdown}</b> seconds...
            </div>
            <button
              className="countdown-login-btn"
              onClick={() => {
                setShowCountdown(false);
                navigate("/LoginSignup");
              }}
            >
              Login Now
            </button>
          </div>
        </div>
      )}
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={
                      item.image?.startsWith('/uploads/')
                        ? `http://localhost:5000${item.image}`
                        : item.image
                    }
                    alt={item.title} 
                  />
                </div>
                
                <div className="item-details">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-category">{item.category}</p>
                  <div className="item-price">NRP {item.price.toLocaleString()}</div>
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item, item.qty - 1)}
                      disabled={item.qty <= 1}
                    >
                      <AiOutlineMinus />
                    </button>
                    <span className="qty-display">{item.qty}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item, item.qty + 1)}
                      disabled={item.qty >= item.instock}
                    >
                      <AiOutlinePlus />
                    </button>
                  </div>
                  <p className="stock-info">In stock: {item.instock}</p>
                </div>

                <div className="item-total">
                  <div className="total-amount">NRP {(item.price * item.qty).toLocaleString()}</div>
                </div>

                <div className="item-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item)}
                    title="Remove from cart"
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-items">
                <div className="summary-item">
                  <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                  <span>NRP {Total.toLocaleString()}</span>
                </div>
                
                <div className="summary-item">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `NRP ${shipping.toLocaleString()}`}</span>
                </div>
                
                <div className="summary-item total">
                  <span>Total</span>
                  <span>NRP {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="shipping-info">
                <FaTruck className="info-icon" />
                <span>Free shipping on orders over NRP 5,000</span>
              </div>

              <button 
                className="checkout-btn"
                onClick={() => {
                  if (!user) {
                    setCountdown(7);
                    setShowCountdown(true);
                  } else {
                    // Proceed with checkout logic here
                  }
                }}
              >
                <FaCreditCard />
                Proceed to Checkout
              </button>

              <div className="security-info">
                <FaShieldAlt className="security-icon" />
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
