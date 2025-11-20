const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username && typeof username === "string";
};

const authenticatedUser = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  return user !== undefined;
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const accessToken = jwt.sign(
    { username: username },
    "fingerprint_customer",
    { expiresIn: "1h" }
  );

  req.session.authorization = {
    username: username,
    accessToken
  };

  return res.status(200).json({ message: "Login realizado com sucesso", token: accessToken });
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  if (!username) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (!review) {
    return res.status(400).json({ message: "Resenha não pode ser vazia" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Resenha adicionada/atualizada com sucesso",
    reviews: books[isbn].reviews
  });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  if (!username) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Nenhuma resenha encontrada para este usuário" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Resenha deletada com sucesso",
    reviews: books[isbn].reviews
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;