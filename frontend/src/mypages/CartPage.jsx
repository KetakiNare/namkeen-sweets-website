import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  // 🔄 Fetch cart
  const fetchCart = () => {
    axios.get("http://127.0.0.1:5000/cart")
      .then(res => setCart(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const navigate = useNavigate();

  // ➕ Increase
  const increaseQty = (id) => {

  axios.post(

    "http://127.0.0.1:5000/cart",

    {
      product_id: id,
      quantity: 1
    }

  )

  .then(() => {

    fetchCart();

  })

  .catch((err) => {

    alert(
      err.response.data
    );

  });

};
  // ➖ Decrease
  const decreaseQty = (id, qty) => {
    if (qty === 1) {
      removeItem(id);
    } else {
      axios.put("http://127.0.0.1:5000/cart/decrease", {
        product_id: id
      }).then(() => fetchCart());
    }
  };

  // ❌ Remove
  const removeItem = (id) => {
    axios.delete(`http://127.0.0.1:5000/cart/${id}`)
      .then(() => fetchCart());
  };

  // ❤️ Save for later (move to wishlist)
  const saveForLater = (id) => {
    axios.post("http://127.0.0.1:5000/wishlist", {
      product_id: id
    })
    .then(() => axios.delete(`http://127.0.0.1:5000/cart/${id}`))
    .then(() => fetchCart())
    .catch(err => console.log(err));
  };

  // ⚡ Buy now
  const buyNow = (item) => {
    alert(`Proceeding to buy ${item.name}`);
  };

  // 📅 Delivery date
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toDateString();
  };

  // 🧮 Totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">

      {/* LEFT */}
      <div className="cart-left">
        <h2>Shopping Cart</h2>

        {cart.length === 0 ? (
          <p className="empty">Your cart is empty 😢</p>
        ) : (
          cart.map(item => (
            <div className="cart-item" key={item.id}>

              <img src={item.image} alt="" />

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="stock">In stock</p>

                <p className="delivery">
                  Deliver by <b>{getDeliveryDate()}</b>
                </p>

                <div className="qty-box">
                  <button onClick={() => decreaseQty(item.id, item.quantity)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>

                <div className="action-buttons">
                  <button 
                    className="delete-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>

                  <button 
                    className="save-btn"
                    onClick={() => saveForLater(item.id)}
                  >
                    Save for later ❤️
                  </button>

                  <button 
                    className="buy-btn"
                    onClick={() => buyNow(item)}
                  >
                    Buy this now ⚡
                  </button>
                </div>
              </div>

              <div className="price">
                ₹{item.price}
                <p>₹{item.price * item.quantity}</p>
              </div>

            </div>
          ))
        )}

        {/* 🟡 Place Order Button */}
        {cart.length > 0 && (
          <button 
  className="place-order-btn"
  onClick={() => navigate("/checkout")}
>
  Place Order 🛒
</button>
        )}
      </div>

      {/* RIGHT */}
      <div className="cart-right">
        <h3>Subtotal ({totalItems} items)</h3>

        <div className="price-break">
          <p>MRP: ₹{total}</p>
          <p>Delivery Fee: ₹30</p>
          <hr />
          <h2>Total Amount: ₹{total + 30}</h2>
        </div>

        <button 
  className="checkout-btn"
  onClick={() => navigate("/checkout")}
>
  Proceed to Buy
</button>
      </div>

    </div>
  );
};

export default CartPage;