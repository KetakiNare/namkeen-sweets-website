import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Checkout.css";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: ""
  });

const navigate = useNavigate();

const [orderPlaced, setOrderPlaced] =
  useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/cart")
      .then(res => setCart(res.data));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = () => {

  if (
    !form.name ||
    !form.address ||
    !form.phone
  ) {

    alert(
      "Please fill all details"
    );

    return;

  }


  axios.post(

    "http://localhost:5000/place-order",

    {

      ...form,

      cart

    }

  )

  .then(() => {

    alert(
      "Order placed successfully 🎉"
    );

    setCart([]);

    setOrderPlaced(true);

  })

  .catch((err) => {

    alert(

      err.response
        ?.data
        ?.message ||

      "Something went wrong"

    );

  });

};
  return (

  <>

    <div className="checkout-page">

      {/* LEFT */}
      <div className="checkout-left">

        <h2>
          Delivery Details
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Contact Number"
          onChange={handleChange}
        />

        <h3>
          Payment Method
        </h3>

        <p className="cod">
          Cash on Delivery
        </p>

        <button
          className="place-order-btn"
          onClick={placeOrder}
        >
          Place Order
        </button>

      </div>



      {/* RIGHT */}
      <div className="checkout-right">

        <h3>
          Order Summary
        </h3>

        {cart.map(item => (

          <div
            className="summary-item"
            key={item.id}
          >

            <p>
              {item.name} x {item.quantity}
            </p>

            <p>
              ₹{item.price * item.quantity}
            </p>

          </div>

        ))}

        <hr />

        <p>
          MRP: ₹{total}
        </p>

        <p>
          Delivery: ₹30
        </p>

        <h2>
          Total: ₹{total + 30}
        </h2>

      </div>

    </div>



    {orderPlaced && (

      <button

        className="shop-more-btn"

        onClick={() =>
          navigate("/homepage")
        }

      >

        Shop More 🛍️

      </button>

    )}

  </>

);
};

export default CheckoutPage;