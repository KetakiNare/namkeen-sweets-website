const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);


const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        "uploads/"
      );

    },


    filename: (
      req,
      file,
      cb
    ) => {

      cb(

        null,

        Date.now() +
          path.extname(
            file.originalname
          )

      );

    }

  });


const upload =
  multer({
    storage: storage
  });

// ✅ DB Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ecommerce",
  port: 3306
});

db.connect((err) => {
  if (err) console.log("❌ DB ERROR:", err);
  else console.log("✅ MySQL Connected...");
});


// =============================
// 📦 GET PRODUCTS
// =============================
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


// =============================
// 🛒 ADD TO CART (NO DUPLICATES)
// =============================
app.post("/cart", (req, res) => {

  const {
    product_id,
    quantity
  } = req.body;



  // CHECK PRODUCT STOCK
  db.query(

    "SELECT quantity FROM products WHERE id=?",

    [product_id],

    (err, productResult) => {

      if (err) {

        return res
          .status(500)
          .send(err);

      }



      if (
        productResult.length === 0
      ) {

        return res
          .status(404)
          .send(
            "Product not found"
          );

      }



      const stock =

        productResult[0]
          .quantity;



      // OUT OF STOCK
      if (stock <= 0) {

        return res
          .status(400)
          .send(
            "Out of stock"
          );

      }




      // CHECK EXISTING CART
      db.query(

        `SELECT *
        FROM cart
        WHERE product_id=?`,

        [product_id],

        (
          err,
          cartResult
        ) => {

          if (err) {

            return res
              .status(500)
              .send(err);

          }



          let cartQty = 0;


          if (
            cartResult.length > 0
          ) {

            cartQty =

              cartResult[0]
                .quantity;

          }




          // LIMIT STOCK
          if (

            cartQty +
              quantity >

            stock

          ) {

            return res
              .status(400)
              .send(

                `Only ${stock} item(s) available`

              );

          }




          // UPDATE CART
          if (

            cartResult.length >
            0

          ) {

            db.query(

              `UPDATE cart
              SET quantity =
              quantity + ?
              WHERE product_id=?`,

              [
                quantity,
                product_id
              ],

              (err) => {

                if (err) {

                  return res
                    .status(500)
                    .send(err);

                }

                res.send(
                  "Quantity Updated"
                );

              }

            );

          }



          // INSERT CART
          else {

            db.query(

              `INSERT INTO cart
              (product_id, quantity)
              VALUES (?, ?)`,

              [
                product_id,
                quantity
              ],

              (err) => {

                if (err) {

                  return res
                    .status(500)
                    .send(err);

                }

                res.send(
                  "Added to cart"
                );

              }

            );

          }

        }

      );

    }

  );

});
// =============================
// ➖ DECREASE QUANTITY
// =============================
app.put("/cart/decrease", (req, res) => {
  const { product_id } = req.body;

  db.query(
    "UPDATE cart SET quantity = quantity - 1 WHERE product_id = ? AND quantity > 1",
    [product_id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Quantity decreased");
    }
  );
});


// =============================
// 📦 GET CART (NO DUPLICATES)
// =============================
app.get("/cart", (req, res) => {
  db.query(
    `SELECT 
      products.id, 
      products.name, 
      products.price, 
      products.image, 
      SUM(cart.quantity) AS quantity
     FROM cart
     JOIN products ON cart.product_id = products.id
     GROUP BY products.id`,
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});


// =============================
// ❌ DELETE ITEM
// =============================
app.delete("/cart/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM cart WHERE product_id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Item removed");
    }
  );
});

//===============Wishlist item================
app.post("/wishlist", (req, res) => {
  const { product_id } = req.body;

  db.query(
    "INSERT INTO wishlist (product_id) VALUES (?)",
    [product_id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Added to wishlist ❤️");
    }
  );
});
//================Get Wishlist Item=================
app.get("/wishlist", (req, res) => {
  db.query(
    `SELECT products.* 
     FROM wishlist 
     JOIN products ON wishlist.product_id = products.id`,
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

// =============================
// ❌ DELETE FROM WISHLIST
// =============================
app.delete("/wishlist/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM wishlist WHERE product_id = ?",
    [id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Removed from wishlist");
    }
  );
});

//===================================
// Signup
//=======================================
app.post("/signup", (req, res) => {

  const {
    name,
    address,
    phone,
    email,
    password
  } = req.body;


  db.query(

    "INSERT INTO users (name, address, phone, password, role, email) VALUES (?, ?, ?, ?, ?, ?)",

    [
      name,
      address,
      phone,
      password,
      "user",
      email
    ],

    (err) => {

      if (err) {
        return res.status(500).send(err);
      }

      res.send("Signup successful");

    }

  );

});
//===========================================
// LOGIN
//=============================================
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email=? AND password=?";

  db.query(
    sql,
    [email, password],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {

        return res.status(401).json({
          message: "Invalid credentials"
        });

      }

      const user = result[0];

      res.json({
      success: true,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
      });

    }
  );
});

// =============================
// GET USER PROFILE
// =============================
app.get(

  "/users/:id",

  (req, res) => {

    const id =
      req.params.id;


    db.query(

      `SELECT
        name,
        address,
        phone,
        email,
        password

       FROM users

       WHERE id=?`,

      [id],

      (err, result) => {

        if (err) {

          return res
            .status(500)
            .send(err);

        }

        res.json(
          result[0]
        );

      }

    );

  }

);
//==============ADD PRODUCTS==========
app.post(

  "/products",

  upload.single(
    "image"
  ),

  (req, res) => {

    const {
      name,
      price,
      quantity,
      description
    } = req.body;



    const image =

  req.file

    ? `http://localhost:5000/uploads/${req.file.filename}`

    : null;

    db.query(

      `INSERT INTO products
      (name, price, quantity, image, description)
      VALUES (?, ?, ?, ?, ?)`,

      [
        name,
        price,
        quantity,
        image,
        description
      ],

      (err) => {

        if (err) {

          return res
            .status(500)
            .send(err);

        }

        res.send(
          "Product added"
        );

      }

    );

  }

);
//=======================
app.put("/products/:id", (req, res) => {

  const id = req.params.id;

  const { quantity } = req.body;


  db.query(

    "UPDATE products SET quantity=? WHERE id=?",

    [
      quantity,
      id
    ],

    (err) => {

      if (err) {
        return res.status(500).send(err);
      }

      res.send("Quantity updated");

    }

  );

});
//=================================
app.delete("/products/:id", (req, res) => {

  const id = req.params.id;


  db.query(

    "DELETE FROM products WHERE id=?",

    [id],

    (err) => {

      if (err) {
        return res.status(500).send(err);
      }

      res.send("Product removed");

    }

  );

});
// =============================
// PLACE ORDER
// =============================
app.post(
  "/place-order",

  (req, res) => {

    const {

      name,
      address,
      phone,
      cart

    } = req.body;



    if (
      !cart ||
      cart.length === 0
    ) {

      return res
        .status(400)
        .json({
          message:
          "Cart is empty"
        });

    }



    let processed = 0;



    cart.forEach(
      (item) => {


        // CHECK STOCK
        db.query(

          "SELECT quantity FROM products WHERE id=?",

          [item.id],

          (
            err,
            stockResult
          ) => {

            if (err) {

              return res
                .status(500)
                .send(err);

            }



            const stock =

              stockResult[0]
                .quantity;



            // OUT OF STOCK
            if (

              stock <
              item.quantity

            ) {

              return res
                .status(400)
                .json({

                  message:

                  `${item.name} is sold out`

                });

            }



            // SAVE ORDER
            db.query(

              `INSERT INTO orders
              (
                customer_name,
                address,
                phone,
                payment_method,
                product_id,
                product_name,
                quantity,
                price
              )

              VALUES
              (?, ?, ?, ?, ?, ?, ?, ?)
              `,

              [

                name,
                address,
                phone,

                "Cash on Delivery",

                item.id,
                item.name,

                item.quantity,
                item.price

              ]

            );



            // REDUCE STOCK
            db.query(

              `UPDATE products
               SET quantity =
               quantity - ?
               WHERE id=?`,

              [

                item.quantity,
                item.id

              ]

            );



            // REMOVE FROM CART
            db.query(

              "DELETE FROM cart WHERE product_id=?",

              [item.id]

            );



            processed++;


            if (

              processed ===
              cart.length

            ) {

              res.json({

                message:

                "Order placed successfully 🎉"

              });

            }

          }

        );

      }

    );

  }

);
// =============================
app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});