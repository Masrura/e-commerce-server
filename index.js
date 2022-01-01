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
        const usersCollection = database.collection("users");

        app.get('/movies', async (req, res) => {
            const cursor = mainCollection.find({});
            const movies = await cursor.toArray();
            res.send(movies);
        })

        app.post('/movies', async (req, res) => {
            const order = req.body;
            const result = await mainCollection.insertOne(order);
            res.json(result);
        });

        app.get('/movie/:mId', async (req, res) => {
            const id = req.params.mId;
           // console.log(id);
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
            const query = { user: email };
            const cursor = await watchlistCollection.find(query);
            const result = await cursor.toArray();
            console.log('result is', result);
            const watchlist=[];
            for (r of result) {
                console.log('id is', r.movieId);
                const query2 = { _id: ObjectId(r.movieId) };
                const result2 = await mainCollection.findOne(query2);
                watchlist.push(result2);
            }
           // console.log('watchlist is ', watchlist)
            res.json(watchlist);

        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            // console.log(req.body);
            const result = await usersCollection.insertOne(user);
            console.log('user',result);
            res.json(result);
        });
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            console.log('role',user?.role);
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

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