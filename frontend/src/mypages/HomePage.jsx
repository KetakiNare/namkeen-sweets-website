import React from "react";
import axios from "axios";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";



const HomePage = () => {

  const addToCart = (id) => {
    axios.post("http://127.0.0.1:5000/cart", {
      product_id: id,
      quantity: 1
    })
    .then(() => alert("Added to cart 🛒"))
    .catch(err => console.log(err));
  };
const navigate = useNavigate();
  const addToWishlist = (id) => {
    axios.post("http://127.0.0.1:5000/wishlist", {
      product_id: id
    })
    .then(() => alert("Added to wishlist ❤️"))
    .catch(err => console.log(err));
  };

  return (
    <div className="home">

      {/* HERO */}
      <div className="hero">
        <img src={process.env.PUBLIC_URL + "/images/homesweet.jpg"} alt="Hero" />
        <div className="hero-text">
          <h1>Sweets & Namkeens 😍</h1>
          <p>Fresh | Authentic | Homemade Taste</p>
          <button onClick={() => navigate("/ProductList") }>  Shop Now  </button>
        </div>
      </div>

      {/* NEW ARRIVALS */}
      <div className="categories">
        <h2>New Arrivals</h2>

        <div className="category-grid">
          <div className="cat-card">
            <img src={process.env.PUBLIC_URL + "/images/kesar-peda.jpg"} alt="" />
            <p>Kesar Peda</p>
          </div>

          <div className="cat-card">
           <img src={process.env.PUBLIC_URL + "/images/ladoo.jpg"} alt="" />
            <p>Ladoo</p>
          </div>

          <div className="cat-card">
            <img src={process.env.PUBLIC_URL + "/images/bhel.jpg"} alt="" />
            <p>Bhel</p>
          </div>

          <div className="cat-card">
           <img src={process.env.PUBLIC_URL + "/images/Kaju-Katli.jpg"} alt="" />
            <p>Barfi</p>
          </div>

          <div className="cat-card">
           <img src={process.env.PUBLIC_URL + "/images/namkeen-mix.jpg"} alt="" />
            <p>Namkeen Mix</p>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="featured">
        <h2>Popular Products</h2>

        <div className="product-grid">

          {/* PRODUCT CARD */}
          <div className="product-card">
            <img src={process.env.PUBLIC_URL + "/images/black-raisins.jpg"} alt="" />
            <h3>Black Raisins Delight</h3>
            <h4>₹682.00</h4>
            <p className="desc">Premium black raisins sweet delight</p>

            <div className="btn-row">
              <button className="cart-btn" onClick={() => addToCart(2)}>
                Add to Cart
              </button>

              <button className="wishlist-btn" onClick={() => addToWishlist(2)}>
                ❤️
              </button>
            </div>
          </div>

          <div className="product-card">
           <img src={process.env.PUBLIC_URL + "/images/anjeer-rose.jpg"} alt="" />
            <h3>Anjeer Rose Delight</h3>
            <h4>₹1,217.00</h4>
            <p className="desc">Delicious anjeer sweet with rose flavor</p>

            <div className="btn-row">
              <button className="cart-btn" onClick={() => addToCart(3)}>
                Add to Cart
              </button>

              <button className="wishlist-btn" onClick={() => addToWishlist(3)}>
                ❤️
              </button>
            </div>
          </div>

          <div className="product-card">
            <img src={process.env.PUBLIC_URL + "/images/Dried-mango.jpg"} alt="" />
            <h3>Dried Mango Delight</h3>
            <h4>₹764.00</h4>
            <p className="desc">Tasty dried mango sweet treat</p>

            <div className="btn-row">
              <button className="cart-btn" onClick={() => addToCart(4)}>
                Add to Cart
              </button>

              <button className="wishlist-btn" onClick={() => addToWishlist(4)}>
                ❤️
              </button>
            </div>
          </div>

        </div>

        <div className="view-more">
  <button onClick={() => navigate("/ProductList")}>
    View More
  </button>
  </div>
</div>

      {/* OFFER */}
      <div className="offer">
        <h2>🎉 Flat 20% OFF on First Order</h2>
      </div>

    </div>
  );
};

export default HomePage;