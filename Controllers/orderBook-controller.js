const Orders = require("../Models/orderModel");
const OrderBook = require("../Models/orderBookModel");

// Put book to a cart
exports.AddToCart = async (req, res) => {
  try {
    const { bookid, userid } = req.headers;

    let order = await Orders.findOne({ users: userid, books: bookid});

    if (!order) {
      order = new Orders({ users: userid, books: bookid });
      await order.save();
       res.status(200).json({ message: "Book added to cart", data: order });
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//remove book from cart
exports.RemoveFromCart = async (req, res) => {
  try {
    const  {bookid}   = req.params;
    const { id } = req.headers;

    if (!bookid || !id) {
      return res
        .status(400)
        .json({ error: "Book ID and User ID are required" });
    }

    let order = await Orders.findOne({ users: id });

    if (!order) {
      res.status(200).json({ message: "USER NOT FOUND" });
    }
    // Check if the book is already in the orderBook
    let orderBookEntry = await OrderBook.findOne({
      orders: order._id,
      books: bookid,
    });

    if (orderBookEntry) {
await OrderBook.findOneAndUpdate(
  { orders: order._id, books: bookid },
  { $pull: { books: bookid } }
);      return res.status(201).json({ message: "Book removed from cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


