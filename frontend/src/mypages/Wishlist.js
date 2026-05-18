import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProductList.css";

const Wishlist = () => {
  const [items, setItems] = useState([]);

  // Fetch wishlist
  const fetchWishlist = () => {
    axios.get("http://localhost:5000/wishlist")
      .then(res => setItems(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = (id) => {
  axios.delete(`http://localhost:5000/wishlist/${id}`)
    .then(() => {
      // remove item instantly from UI
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    })
    .catch(err => console.log(err));
};

const moveToCart = (id) => {
  // 1️⃣ Add to cart
  axios.post("http://localhost:5000/cart", {
    product_id: id,
    quantity: 1
  })
  .then(() => {
    // 2️⃣ Remove from wishlist
    return axios.delete(`http://localhost:5000/wishlist/${id}`);
  })
  .then(() => {
    // 3️⃣ Update UI instantly
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  })
  .catch(err => console.log(err));
};

  return (
    <div className="productlist">
      <h2>My Wishlist ❤️</h2>

      {/* ✅ Empty message */}
      {items.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Your wishlist is empty 😢
        </p>
      ) : (
        <div className="productlist-grid">
          {items.map((item) => (
            <div className="productlist-card" key={item.id}>
              <img src={item.image} alt="" />
              <h3>{item.name}</h3>
              <h4>₹{item.price}</h4>
              <p className="desc">{item.description}</p>

              <div className="btn-row">
                {/* ❌ Remove button */}
                <button 
                  className="wishlist-btn"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  ❌
                </button>

                {/* (Optional) Add to cart */}
                <button 
  className="cart-btn"
  onClick={() => moveToCart(item.id)}
>
  Add to Cart
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;