import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/products")
      .then(res => {
       const selected = res.data.find(p => p.id === Number(id));
        setProduct(selected);
      });
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="product-page">
      <img src={product.image} alt="" />

      <div>
        <h1>{product.name}</h1>
        <h2>₹{product.price}</h2>
        <p>{product.description}</p>

        <button onClick={() => {
          axios.post("http://127.0.0.1:5000/cart", {
            product_id: product.id,
            quantity: 1
          }).then(() => navigate("/cart"));
        }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductPage;