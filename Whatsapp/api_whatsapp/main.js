const express = require('express');
const path = require('path');
const authRoute = require('./routes/auth.route.js');

const APP = express();

// Permite requisições de qualquer origem (CORS)
APP.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

APP.use(express.json());
APP.use(express.static(path.join(__dirname, "../front_whatsapp"))); // Serve os ficheiros do front
APP.use(authRoute);

const PORT = 3000; // Certifica-te de qual porta estás a usar[cite: 2]
const SERVER = "localhost";

APP.listen(PORT, () => console.log(`Servidor Online em ${SERVER}:${PORT}`)); //[cite: 2]