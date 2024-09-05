const express = require("express");
const booksControllers = require("../Controllers/book-controller");
const { authenticateToken , verifyAdmin} = require("../routes/userAuth.js");
const multer = require('multer');


const routerBook = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

routerBook.post("/Books", upload.single("image"), authenticateToken , verifyAdmin, booksControllers.Createbook);

routerBook.get("/GetBookId/:id", booksControllers.getBookId);

routerBook.get("/AllBooks", booksControllers.getBooks);

routerBook.get("/RecentBooks", booksControllers.getRecentBook);
routerBook.get(
  "/FilterByCategory/:category",
  booksControllers.getBookByCategory
);

routerBook.get("/searchBooks",authenticateToken, booksControllers.getBookByCriteria);

routerBook.put("/Books",authenticateToken , booksControllers.editBook);
routerBook.delete("/Books", authenticateToken , booksControllers.deleteBook);

module.exports = routerBook;
