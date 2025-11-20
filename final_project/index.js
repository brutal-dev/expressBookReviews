const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const auth_users = require("./router/auth_users.js").authenticated;
const public_users = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session && req.session.authorization) {
        const token = req.session.authorization.accessToken;
        jwt.verify(token, "fingerprint_customer", (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token inválido" });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
});

const PORT = 5000;

app.use("/", public_users);

app.use("/customer", auth_users);

app.listen(PORT, () => console.log("Server is running on port " + PORT));