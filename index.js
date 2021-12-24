const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjnos.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log('uri', uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("connected to db");
        const database = client.db("boost_challenge");

    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running Server");
})

app.listen(port, () => {
    console.log('Running Genius Server on port ', port);
});


//future update
//1. git add, commit, push
//2. save everything and check locally
//3. git push heroku main