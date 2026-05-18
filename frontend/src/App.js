import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import React, {
  useEffect,
  useState
} from "react";

import ProductPage from "./mypages/ProductPage";
import ProductList from "./mypages/ProductList";
import CartPage from "./mypages/CartPage";
import CheckoutPage from "./mypages/CheckoutPage";
import HomePage from "./mypages/HomePage";
import MyAccount from "./mypages/MyAccount";

import Navbar from "./mycomponents/Navbar";

import Wishlist from "./mypages/Wishlist";
import Login from "./mypages/Login";
import Signup from "./mypages/Signup";


function AppWrapper() {

  const location = useLocation();

  const [cartCount, setCartCount] =
    useState(0);


  useEffect(() => {

    fetch("http://127.0.0.1:5000/cart")
      .then((res) => res.json())
      .then((data) =>
        setCartCount(data.length)
      );

  }, []);



  // HIDE NAVBAR ON LOGIN + SIGNUP
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/signup";



  return (
    <>

      {!hideNavbar && (
        <Navbar
          cartCount={cartCount}
        />
      )}



      <Routes>

        {/* AUTH */}
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* MAIN */}
        <Route
          path="/homepage"
          element={<HomePage />}
        />

        <Route
          path="/ProductList"
          element={<ProductList />}
        />

        <Route
          path="/product/:id"
          element={<ProductPage />}
        />

        <Route
           path="/profile"
           element={<MyAccount />}
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />

        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

      </Routes>

    </>
  );

}


function App() {

  return (

    <BrowserRouter>

      <AppWrapper />

    </BrowserRouter>

  );

}

export default App;