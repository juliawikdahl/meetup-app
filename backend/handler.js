'use strict';

const express = require('express');
const serverless = require('serverless-http');

const app = express();


app.use(express.json());
app.use(require('cors')());


app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from the Serverless backend!' });
});


module.exports.handler = serverless(app);
