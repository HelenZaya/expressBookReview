const express = require('express');
const axios = require('axios');
const books = require('../books.js');

const public_users = express.Router();

// Task 2: Get all books
public_users.get('/', function(req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 3: Get book by ISBN
public_users.get('/isbn/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 4: Get books by author
public_users.get('/author/:author', function(req, res) {
  const author = req.params.author.toLowerCase();
  const result = {};
  for (let key in books) {
    if (books[key].author.toLowerCase().includes(author)) {
      result[key] = books[key];
    }
  }
  if (Object.keys(result).length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// Task 5: Get books by title
public_users.get('/title/:title', function(req, res) {
  const title = req.params.title.toLowerCase();
  const result = {};
  for (let key in books) {
    if (books[key].title.toLowerCase().includes(title)) {
      result[key] = books[key];
    }
  }
  if (Object.keys(result).length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Task 6: Get book review
public_users.get('/review/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    if (Object.keys(book.reviews).length === 0) {
      return res.status(200).json({ message: "No reviews found for this book." });
    }
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 11a: Get all books using Promise callback
public_users.get('/promise/books', function(req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("Books not found"));
    }
  });

  getBooks
    .then((allBooks) => {
      res.status(200).send(JSON.stringify(allBooks, null, 4));
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

// Task 11b: Get book by ISBN using Promise callback
public_users.get('/promise/isbn/:isbn', function(req, res) {
  const isbn = req.params.isbn;

  const getBook = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });

  getBook
    .then((book) => {
      res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

// Task 11c: Get books by author using Promise callback
public_users.get('/promise/author/:author', function(req, res) {
  const author = req.params.author.toLowerCase();

  const getByAuthor = new Promise((resolve, reject) => {
    const result = {};
    for (let key in books) {
      if (books[key].author.toLowerCase().includes(author)) {
        result[key] = books[key];
      }
    }
    if (Object.keys(result).length > 0) {
      resolve(result);
    } else {
      reject(new Error("No books found for this author"));
    }
  });

  getByAuthor
    .then((result) => {
      res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

// Task 11d: Get books by title using Promise callback
public_users.get('/promise/title/:title', function(req, res) {
  const title = req.params.title.toLowerCase();

  const getByTitle = new Promise((resolve, reject) => {
    const result = {};
    for (let key in books) {
      if (books[key].title.toLowerCase().includes(title)) {
        result[key] = books[key];
      }
    }
    if (Object.keys(result).length > 0) {
      resolve(result);
    } else {
      reject(new Error("No books found with this title"));
    }
  });

  getByTitle
    .then((result) => {
      res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((err) => {
      res.status(404).json({ message: err.message });
    });
});

// Task 11e: Get all books using async/await with Axios
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 11f: Get book by ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 11g: Get books by author using async/await with Axios
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 11h: Get books by title using async/await with Axios
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports.general = public_users;
