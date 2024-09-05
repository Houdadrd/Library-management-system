const mongoose = require("mongoose");
const FavListes = require("../Models/favListModel");

//add book to favorite
exports.CreateFavList = async (req, res) => {
  try {
    const { bookid, id } = req.headers; 

     const isBookFavorite = await FavListes.findOne({ users: id, books: bookid})

    if (isBookFavorite) {
      return res.status(200).json({ message: "Book is already in favorites" });
    }

    // Add the book to the favorite list
    await FavListes.findOneAndUpdate(
      { users: id },
      { $push: { books: bookid } },
      { new: true, upsert: true } 
    );

    return res.status(201).json({ message: "Book added to favorites" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFavoriteBooks = async (req, res) => {
  try {
     const { id } = req.headers;

     // Find the user's favorite list
     const userFavorites = await FavListes.findOne({ users: id }).populate("books");

    const favoriteBooks = userFavorites.books;

    return res.json({status: "sucess", data: favoriteBooks});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// remove book from favorite 
exports.deletelist = async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    // Find the user's favorite list
    const userFavorites = await FavListes.findOne({ users: id });

    // if (!userFavorites) {
    //   return res.status(404).json({ message: "User's favorite list not found" });
    // }

    // Check if the book is already in the favorite list
    const isBookFavorite = userFavorites.books.some(
      (book) => book.toString() === bookid.toString()
    );

    if (isBookFavorite) {
      await FavListes.findOneAndUpdate({ users: id },{ $pull: { books: bookid } },);
    }

    return res.status(201).json({ message: "Book removed from favorites" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
