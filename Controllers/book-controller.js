const mongoose = require("mongoose");
const Books = require("../Models/BookModel");
const Users = require("../Models/userModel");

//add bok --admin
exports.Createbook = async (req, res) => {
  try {
    const newBook = new Books({title :req.body.title,
       author: req.body.author, 
       price: req.body.price,
       desc: req.body.desc, 
       category: req.body.category, 
       language: req.body.language,
       image: req.file.filename, 
       stock: req.body.stock} );
    const books = await Books.find(newBook);
    
      const book = await newBook.save();
      return res
        .status(201)
        .json({ book: book, message: "Book addes successfully" });
    
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(400).json({ error: "Something went wrong" });

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

//get recently added books limit 5
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
exports.editBook = async (req,res)=>{
    try{
        const { id } = req.headers;
        const book = await Books.findByIdAndUpdate(id, req.body,{ new: true });
        if (!book){
            return res.status(404).json({message: 'Cannot find this book'})
        }
         return res.status(200).json({ message: "Book updated successfully!" });
    }catch (error){
        console.log(JSON.stringify(error));
        return res.status(500).json({ message: error.message });
    }
};

//delete book --admin
exports.deleteBook = async (req, res) =>{
    try{
         const { id } = req.headers;
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