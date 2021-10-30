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
        const database = client.db("tourism");
        const resortCollection = database.collection("resort_details");
        const orderCollection = database.collection("orders");

        // const database = client.db("volunteer_network");

        // const workCollection = database.collection("work");

        app.get('/resorts', async (req, res) => {
            const cursor = resortCollection.find({});
            const resorts = await cursor.toArray();
            res.send(resorts);
        });

        app.post("/place-order", async (req, res) => {
            console.log(req.body);
            const result = await orderCollection.insertOne(req.body);
            console.log(result);
            res.json(result);
        });

        app.get("/booking/:serviceId", async (req, res) => {
            const id = parseInt(req.params.serviceId);
            console.log(typeof(id));
            const query = { key : id };
            const result = await resortCollection.findOne(query);
            console.log(result);
            res.send(result);
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