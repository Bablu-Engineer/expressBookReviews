const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// ✅ Task 6: Register new user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});


// ✅ Task 1: Get the book list
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// ✅ Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return books[isbn]
    ? res.status(200).json(books[isbn])
    : res.status(404).json({ message: "Book not found" });
});

// ✅ Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let result = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  return res.status(200).json(result);
});

// ✅ Task 4: Get book details based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  return res.status(200).json(result);
});

// ✅ Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return books[isbn]
    ? res.status(200).json(books[isbn].reviews)
    : res.status(404).json({ message: "Book not found" });
});


// -------------------------------------------------------------
// ✅ Task 10–13 (Async/Await)
// -------------------------------------------------------------

// ✅ Task 10: Get book list using async/await (local data)
public_users.get('/async/books', async (req, res) => {
    try {
      // Simulate async operation
      let getBooks = () => {
        return new Promise((resolve, reject) => {
          resolve(books);
        });
      };
      let result = await getBooks();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });
  
  // ✅ Task 11: Get book details by ISBN using Promises
  public_users.get('/async/isbn/:isbn', (req, res) => {
    let isbn = req.params.isbn;
  
    new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
  });
  
  // ✅ Task 12: Get books by author using async/await
  public_users.get('/async/author/:author', async (req, res) => {
    try {
      let author = req.params.author;
      let result = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
      );
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books by author" });
    }
  });
  
  // ✅ Task 13: Get books by title using async/await
  public_users.get('/async/title/:title', async (req, res) => {
    try {
      let title = req.params.title;
      let result = Object.values(books).filter(
        book => book.title.toLowerCase().includes(title.toLowerCase())
      );
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books by title" });
    }
  });
  

module.exports.general = public_users;
