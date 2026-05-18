import React, { useEffect, useState } from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
import "../styles/ProductList.css";

const ProductList = () => {

  const role =
    localStorage
      .getItem("role")
      ?.trim()
      .toLowerCase();


  const [products, setProducts] =
    useState([]);

  const [imageFile, setImageFile] =
    useState(null);

  const location =
  useLocation();


  const [newProduct, setNewProduct] =
    useState({
      name: "",
      price: "",
      quantity: "",
      description: ""
    });



  useEffect(() => {
    fetchProducts();
  }, []);

const searchTerm =

  new URLSearchParams(
    location.search
  )

  .get("search")

  ?.toLowerCase()

  || "";


  // GET PRODUCTS
  const fetchProducts = () => {

    axios
      .get(
        "http://localhost:5000/products"
      )

      .then((res) => {

        setProducts(
          res.data
        );

      })

      .catch(console.log);

  };


  // IMAGE
  const handleImage = (e) => {

    setImageFile(
      e.target.files[0]
    );

  };


  // USER
  const addToWishlist = (id) => {

    axios
      .post(
        "http://localhost:5000/wishlist",
        {
          product_id: id
        }
      )

      .then(() => {

        alert(
          "Added to wishlist ❤️"
        );

      })

      .catch(console.log);

  };



  const addToCart = (id) => {

    axios
      .post(
        "http://localhost:5000/cart",
        {
          product_id: id,
          quantity: 1
        }
      )

      .then(() => {

        alert(
          "Added to cart 🛒"
        );

      })

      .catch(console.log);

  };

  // ADMIN

  const addProduct = () => {

    const formData =
      new FormData();


    formData.append(
      "name",
      newProduct.name
    );

    formData.append(
      "price",
      newProduct.price
    );

    formData.append(
      "quantity",
      newProduct.quantity
    );

    formData.append(
      "description",
      newProduct.description
    );

    formData.append(
      "image",
      imageFile
    );



    axios
  .post(

    "http://localhost:5000/products",

    formData,

    {
      headers: {
        "Content-Type":
          "multipart/form-data"
      }
    }

  )
      .then(() => {

        alert(
          "Product Added"
        );


        setNewProduct({
          name: "",
          price: "",
          quantity: "",
          description: ""
        });


        setImageFile(
          null
        );


        fetchProducts();

      })

     .catch((err) => {

  console.log(err);

  alert(
    "Error adding product"
  );

});

  };


  const deleteProduct = (id) => {axios.delete(`http://localhost:5000/products/${id}`)
      .then(() => {
        alert(
          "Product Removed"
        );
        fetchProducts();
      })
      .catch(console.log);

  };

  const updateQuantity = (id,qty) => {axios.put(`http://localhost:5000/products/${id}`,
        {
          quantity: qty
        }
      )
      .then(() => {
       fetchProducts();
      })
        .catch(console.log);};

const filteredProducts =products.filter((item) =>item.name.toLowerCase().includes(searchTerm));

  return (
    <div className="productlist">
      <h2>
        All Products
      </h2>

      {/* ADMIN PANEL */}
      {role === "admin" && (
        <div className="admin-panel">
          <h3>
            Add Product
          </h3>

          <input placeholder="Product Name" value={newProduct.name} onChange={(e) =>
          setNewProduct({
                ...newProduct,
                name:
                  e.target
                    .value
              })
            }
          />

          <input placeholder="Price" value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct,price:e.target .value})}
            />

          <input
            placeholder="Quantity"
            value={
              newProduct.quantity
            }
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                quantity:
                  e.target
                    .value
              })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImage
            }
          />

          <input
            placeholder="Description"
            value={
              newProduct.description
            }
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                description:
                  e.target
                    .value
              })
            }
          />

          <button
            onClick={
              addProduct
            }
          >
            Add Product
          </button>

        </div>

      )}





      <div className="productlist-grid">

        {filteredProducts.map(
          (item) => (

           <div

  className={

    item.quantity === 0
      ? "productlist-card sold-out"
      : "productlist-card"
  }

  key={item.id}
>
              <img src={item.image}alt=""/>

{item.quantity === 0 && (

  <span className="sold-badge">Sold Out</span>
)}

              <h3>
                {item.name}
              </h3>


              <h4>
                ₹{item.price}
              </h4>


              <p>
             {item.quantity > 0 ? `Stock: ${item.quantity}` : "Sold Out"}
             </p>


              <p className="desc">
                {
                  item.description
                }
              </p>

              <div className="btn-row">
                {/* USER */}
                {role !==
                  "admin" && (
                  <>
                   <button className="cart-btn" disabled={ item.quantity === 0}
                    onClick={() =>
                   addToCart(item.id)
                   }>

                  {item.quantity > 0  ? "Add to Cart" : "Sold Out"}</button>

                    <button className="wishlist-btn"
                      onClick={() =>
                        addToWishlist(
                          item.id
                        )
                      }
                    >
                      ❤️
                    </button>
                  </>
                )}


                {/* ADMIN */}
                {role ===
                  "admin" && (
                  <>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,

                          item.quantity +
                            1
                        )
                      }
                    >
                      + Qty
                    </button>



                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,

                          Math.max(
                            0,
                            item.quantity -
                              1
                          )
                        )
                      }
                    >
                      - Qty
                    </button>



                    <button
                      onClick={() =>
                        deleteProduct(
                          item.id
                        )
                      }
                    >
                      Remove
                    </button>

                  </>
                )}


              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

};

export default ProductList;