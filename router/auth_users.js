const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('../books.js');

const regd_users = express.Router();
let users = [];

const SECRET_KEY = "secret_key_2024";

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Task 7: Register new user
regd_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered. Now you can login." });
});

// Task 8: Login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  req.session.token = token;
  req.session.username = username;
  return res.status(200).json({ message: "User successfully logged in", token });
});

// Task 9: Add or modify a book review (authenticated)
regd_users.put('/auth/review/:isbn', (req, res) => {
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;
    const isbn = req.params.isbn;
    const review = req.query.review;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: `Review added/updated for ISBN ${isbn}`, reviews: books[isbn].reviews });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Task 10: Delete a book review (authenticated)
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;
    const isbn = req.params.isbn;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: `Review deleted for ISBN ${isbn} by ${username}` });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
