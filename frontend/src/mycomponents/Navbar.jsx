import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaHeart,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/Navbar.css";

const Navbar = ({ cartCount }) => {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef();

  const [search, setSearch] =
  useState("");

  const handleSearch = () => {

  if (!search.trim()) {

    return;

  }


  navigate(

    `/ProductList?search=${search}`

  );

};

  // LOGOUT
  const handleLogout = () => {

    localStorage.clear();

    setOpen(false);

    navigate("/");

  };


  // OUTSIDE CLICK
  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);



  return (

    <div className="navbar">

      <div className="top-bar">
        Free shipping over ₹499 🎉
      </div>


      <div className="main-nav">

        {/* SEARCH */}
       <div className="search">

  <input

    type="text"

    placeholder="Search sweets..."

    value={search}

    onChange={(e) =>

      setSearch(
        e.target.value
      )

    }

    onKeyDown={(e) => {

      if (
        e.key === "Enter"
      ) {

        handleSearch();

      }

    }}

  />


  <FaSearch

    className="search-icon"

    onClick={
      handleSearch
    }

  />

</div>


        {/* LOGO */}
        <div className="logo">
          <Link to="/">
            Sweets & Namkeens
          </Link>
        </div>


        {/* ICONS */}
        <div className="icons">

          <Link
            to="/homepage"
            className="icon"
          >
            <FaHome />
          </Link>


          <Link
            to="/wishlist"
            className="icon"
          >
            <FaHeart />
          </Link>


          {/* CART */}
          <Link
            to="/cart"
            className="cart"
          >
            🛒

            <span className="cart-count">
              {cartCount}
            </span>

          </Link>



          {/* USER MENU */}
          <div
            className="user-menu"
            ref={menuRef}
          >

            <div
              className="user-icon"
              onClick={() =>
                setOpen(!open)
              }
            >
              <FaUser />
            </div>



            {open && (

              <div className="dropdown">

                <Link to="/profile">
                  My Account
                </Link>

                <Link to="/orders">
                  Orders
                </Link>

                <div
                  className="logout"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Logout
                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};

export default Navbar;