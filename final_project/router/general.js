const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios" });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Usuário já existe" });
  }

  users.push({ username: username, password: password });
  return res.status(201).json({ message: "Usuário registrado com sucesso" });
});

public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn]);
  } else {
    res.status(404).json({ message: "Livro não encontrado" });
  }
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);

  let result = [];
  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    res.json(result);
  } else {
    res.status(404).json({ message: "Nenhum livro encontrado para este autor" });
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);

  let result = [];
  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    res.json(result);
  } else {
    res.status(404).json({ message: "Nenhum livro encontrado com este título" });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Livro não encontrado" });
  }
});

public_users.get('/async-books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter livros", error: error.message });
  }
});

public_users.get('/promise-books', (req, res) => {
  axios.get('http://localhost:5000/')
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Erro ao obter livros", error: error.message });
    });
});

public_users.get('/async-isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter detalhes do livro", error: error.message });
  }
});

public_users.get('/promise-isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Erro ao obter detalhes do livro", error: error.message });
    });
});

public_users.get('/async-author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter livros por autor", error: error.message });
  }
});

public_users.get('/promise-author/:author', (req, res) => {
  const author = req.params.author;
  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Erro ao obter livros por autor", error: error.message });
    });
});

public_users.get('/async-title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter livros por título", error: error.message });
  }
});

public_users.get('/promise-title/:title', (req, res) => {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Erro ao obter livros por título", error: error.message });
    });
});



module.exports.general = public_users;