import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  useNavigate
} from "react-router-dom";

import "../styles/MyAccount.css";


const MyAccount = () => {

  const navigate =
    useNavigate();


  const [user, setUser] =
    useState({});


  useEffect(() => {

    const userId =

      localStorage.getItem(
        "userId"
      );



    // not logged in
    if (!userId) {

      navigate("/");

      return;

    }



    axios.get(

      `http://localhost:5000/users/${userId}`

    )

    .then((res) => {

      setUser(
        res.data
      );

    })

    .catch((err) => {

      console.log(err);

    });


  }, [navigate]);




  return (

    <div className="account-page">

      <h2>
        My Account
      </h2>


      <div className="account-card">

        <p>
          <b>Name:</b>
          {user.name}
        </p>


        <p>
          <b>Address:</b>
          {user.address}
        </p>


        <p>
          <b>Contact:</b>
          {user.phone}
        </p>


        <p>
          <b>Email:</b>
          {user.email}
        </p>


        <p>
          <b>Password:</b>
          {user.password}
        </p>

      </div>

    </div>

  );

};


export default MyAccount;