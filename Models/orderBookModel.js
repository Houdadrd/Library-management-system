const mongoose = require("mongoose");

const orderBookSchema = mongoose.Schema(
  {
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
        // required: true,
      },
    ],
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        // required: true,
      },
    ],
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const orderBook = mongoose.model("orderBook", orderBookSchema);

module.exports = orderBook;