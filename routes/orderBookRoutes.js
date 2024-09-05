const express = require("express");
const orderBookControllers = require("../Controllers/orderBook-controller.js");
const { authenticateToken } = require("../routes/userAuth.js");

const routerOrderBook = express.Router();

// routerOrderBook.post(
//   "/AddToCart",
//   authenticateToken,
//   orderBookControllers.AddToCart
// );
routerOrderBook.put(
  "/RemoveFromCart/:bookid",
  authenticateToken,
  orderBookControllers.RemoveFromCart
);

module.exports = routerOrderBook;
