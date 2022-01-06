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
        const database = client.db("e-commerce");
        const clothCollection = database.collection("cloths");
        const gadgetCollection = database.collection("gadgets");
        //const usersCollection = database.collection("users");

        app.get('/shirts', async (req, res) => {
            const cursor = clothCollection.find({});
            const shirts = await cursor.toArray();
            res.send(shirts);
        })
        app.get('/gadgets', async (req, res) => {
            const cursor = gadgetCollection.find({});
            const gadgets = await cursor.toArray();
            res.send(gadgets);
        })

        // app.post('/movies', async (req, res) => {
        //     const order = req.body;
        //     const result = await mainCollection.insertOne(order);
        //     res.json(result);
        // });

        app.get('/shirt/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { id: id };
            const result = await clothCollection.findOne(query);
            console.log(result);
            res.send(result);
        });
        app.get('/gadget/:id', async (req, res) => {
            const id = req.params.id;
            console.log(typeof(id));
            const query = { id: parseInt(id) };
            const result = await gadgetCollection.findOne(query);
            console.log(result);
            res.send(result);
        });
        // app.post('/watchlist', async (req, res) => {
        //     const order = req.body;
        //     const result = await watchlistCollection.insertOne(order);
        //     res.json(result);
        // });
        // app.get('/watchlist/:email', async (req, res) => {
        //     const email = req.params.email;
        //     console.log(email);
        //     const query = { user: email };
        //     const cursor = await watchlistCollection.find(query);
        //     const result = await cursor.toArray();
        //     console.log('result is', result);
        //     const watchlist=[];
        //     for (r of result) {
        //         console.log('id is', r.movieId);
        //         const query2 = { _id: ObjectId(r.movieId) };
        //         const result2 = await mainCollection.findOne(query2);
        //         watchlist.push(result2);
        //     }
        //    // console.log('watchlist is ', watchlist)
        //     res.json(watchlist);

        // });

        // app.post('/users', async (req, res) => {
        //     const user = req.body;
        //     // console.log(req.body);
        //     const result = await usersCollection.insertOne(user);
        //     console.log('user',result);
        //     res.json(result);
        // });
        // app.put('/users', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email }
        //     const options = { upsert: true };
        //     const updateDoc = { $set: user }
        //     const result = await usersCollection.updateOne(filter, updateDoc, options);
        //     res.json(result)
        // });

        // app.get('/users/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
        //     let isAdmin = false;
        //     console.log('role',user?.role);
        //     if (user?.role === 'admin') {
        //         isAdmin = true;
        //     }
        //     res.json({ admin: isAdmin });
        // });

        // app.put('/users/admin', async (req, res) => {
        //     const user = req.body;
        //     console.log(user);
        //     const filter = { email: user.email };
        //     const updateDoc = { $set: { role: 'admin' } };
        //     const result = await usersCollection.updateOne(filter, updateDoc);
        //     res.json(result);
        // });

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