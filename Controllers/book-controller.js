const mongoose = require("mongoose");
const Books = require("../Models/BookModel");
const Users = require("../Models/userModel");

//add book --admin
exports.Createbook = async (req, res) => {
  const { title, author, price, desc, category, language, stock } = req.body;
  const image = req.file.filename 

  // console.log("Request body:", req.body );
  try {
    //  console.log("Uploaded file:", req.file);

    // if (!title || typeof title !== "string" || title.trim().length === 0) {
    //   return res.status(400).json({
    //     message: "Title is required and should be a non-empty string",
    //     field: "title",
    //   });
    // }

    // if (!author || typeof author !== "string" || author.trim().length < 3) {
    //   return res.status(400).json({
    //     message: "Author is required and should be at least 3 characters long",
    //     field: "author",
    //   });
    // }

    // if (!price || isNaN(price) || parseFloat(price) <= 0) {
    //   return res.status(400).json({
    //     message: "Price is required and should be a positive number",
    //     field: "price",
    //   });
    // }


    // const validCategories = [
    //   "Crime",
    //   "Romantic",
    //   "Dramatic",
    //   "Adventure",
    //   "Horror",
    //   "Philosophical",
    //   "Science fiction",
    //   "Historical",
    //   "Political",
    // ];
    // if (!category || !validCategories.includes(category)) {
    //   return res.status(400).json({
    //     message:
    //       "Category is required and should be one of the predefined categories",
    //     field: "category",
    //   });
    // }

    // if (
    //   !language ||
    //   typeof language !== "string" ||
    //   language.trim().length === 0
    // ) {
    //   return res.status(400).json({
    //     message: "Language is required and should be a non-empty string",
    //     field: "language",
    //   });
    // }

    // if (
    //   !stock ||
    //   isNaN(stock) ||
    //   parseInt(stock, 10) < 0 ||
    //   !Number.isInteger(parseFloat(stock))
    // ) {
    //   return res.status(400).json({
    //     message: "Stock is required and should be a non-negative integer",
    //     field: "stock",
    //   });
    // }

    // Create book
    const newBook = new Books({
      title,
      author,
      price: parseFloat(price),
      desc,
      category,
      language,
      image,
      stock: parseInt(stock, 10),
    });
    

    const book = await newBook.save();    

    return res.status(201).json({ book, message: "Book added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};




//searching by title, author, or category
exports.getBookByCriteria = async (req, res) => {

   const { title, author, category } = req.body;

   if (!title && !author && !category) {
     return res
       .status(400)
       .json({ message: "At least one search parameter is required" });
   }

   try {
     const query = {};
     if (title) query.title = title;
     if (author) query.author = author;
     if (category) query.category = category;

     const books = await Books.find(query);
      if (books.length === 0) {
        return res
          .status(404)
          .json({ message: "No books found matching the criteria" });
      }

     return res.status(200).json(books);
   } catch (error) {
     return res.status(500).json({ message: error.message });
   }
};

//filter by category
exports.getBookByCategory = async(req, res) =>{
      try {
     const books = await Books.find({ category: req.params.category });
     res.status(200).json({
      data:books
    });
   } catch (error) {
     res.status(500).json({ message: "Error fetching books", error });
   }
}


//get book by id
exports.getBookId= async(req,res)=>{
    try{
        const {id} = req.params;

        const bookFind = await Books.findById(id);
        return res.json({
          status: "Success",
          data: bookFind,
        });
    }catch(error){
         return res
           .status(500)
           .json({ message: error.message });

    }
};

//get recently added books limit 4
exports.getRecentBook = async (req, res) => {
  try {
    const bookFind = await Books.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json({
      status: "Success",
      data: bookFind,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(500).json({ message: error.message });
  }
};

//get all books
exports.getBooks = async (req, res) => {
  try {
    const bookFind = await Books.find().sort({ createdAt: -1 }).limit(50);
    return res.status(200).json({
      status: "Success",
      data: bookFind,
    });
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(500).json({ message: error.message });
  }
};

//update book --admin
exports.editBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Books.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updateData = {
      title: req.body.title || book.title,
      author: req.body.author || book.author,
      price: req.body.price || book.price,
      desc: req.body.desc || book.desc,
      category: req.body.category || book.category,
      language: req.body.language || book.language,
      stock: req.body.stock || book.stock,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedBook = await Books.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({ message: "Book updated successfully!", book: updatedBook });
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(500).json({ message: error.message });
  }
};

//delete book --admin
exports.deleteBook = async (req, res) =>{
    try{
         const { id } = req.params;
         const book = await Books.findByIdAndDelete(id);
         if (!book) {
           return res
             .status(404)
             .json({ message: "Cannot find this book" });
         }
         return res.status(200).json({ message: "Book deleted successfully!" });

        }catch (error){
        console.log(JSON.stringify(error));
        return res.status(500).json({message: error.message});
    }
};


//get book by title "search"
// exports.getBookBytitle = async (req, res) => {
//   try {
//     const {title}= req.params;
//      if (!title) {
//        return res.status(400).json({ message: "Title parameter is required" });
//      }
//     const bookFindtitle = await Books.findOne({
//       title: title,
//     });
//     if (!bookFindtitle) {
//       return res.status(404).json({ message: "Book not found" });
//     }
//     // console.log(bookFindtitle);
//     return res.status(200).json(bookFindtitle);
//   } catch (error) {
//     console.log(JSON.stringify(error));
//     return res.status(500).json({ message: error.message });
//   }
// };