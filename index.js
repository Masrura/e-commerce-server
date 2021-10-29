const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Running Server");
})


app.listen(port, () => {
    console.log('Running Genius Server on port ', port);
});