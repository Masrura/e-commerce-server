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

const uri = `mongodb+srv://mydbuser1:Masi_moni13@cluster0.bjnos.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log('uri', uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("connected to db");
        const database = client.db("boost_challenge");
        const mainCollection = database.collection("main_collection");
        const watchlistCollection = database.collection("watchlist");

        app.get('/movies', async (req, res) => {
            const cursor = mainCollection.find({});
            const movies = await cursor.toArray();
            res.send(movies);
        })

        app.get('/movie/:mId', async (req, res) => {
            const id = req.params.mId;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await mainCollection.findOne(query);
            res.send(result);
        });

        app.post('/watchlist', async (req, res) => {
            const order = req.body;
            const result = await watchlistCollection.insertOne(order);
            res.json(result);
        });
        app.get('/watchlist/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const cursor = await watchlistCollection.find(query);
            const result = await cursor.toArray();
            console.log(result);
            res.json(result);

        });
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