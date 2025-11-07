const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// This will store registered users
let users = [];

/**
 * Check if username already exists
 */
const isValid = (username) => {
  return users.some((user) => user.username === username);
};

/**
 * Check if username and password are correct
 */
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

/**
 * REGISTER NEW USER  (Task 6)
 * POST /customer/register moved to general.js (so ignore here)
 * Only LOGIN is done in this file.
 */


/**
 * LOGIN (Task 7)
 * Only registered users can log in
 */
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  // Generate JWT Token
  let accessToken = jwt.sign({ username }, "secret_key");

  // Store token in session
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "Login successful!", accessToken });
});


/**
 * ADD OR MODIFY REVIEW (Task 8)
 * PUT /customer/auth/review/:isbn
 * Only logged in users can do this
 */
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // If no reviews exist yet, create an empty object
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});


/**
 * DELETE REVIEW (Task 9)
 * DELETE /customer/auth/review/:isbn
 */
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user on this book" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
