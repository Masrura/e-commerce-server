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
        const foodCollection = database.collection("food");
        const usersCollection = database.collection("users");
        const inventoryCollection = database.collection("inventory");
        const cartCollection = database.collection("cart");
        const wishlistCollection = database.collection("wishlist");
        const orderCollection = database.collection("order");

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
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })
        app.get('/inventory', async (req, res) => {
            const cursor = inventoryCollection.find({});
            const inventory = await cursor.toArray();
            console.log('ee',inventory);
            res.send(inventory);
        })
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log('p', product);
            const result = await inventoryCollection.insertOne(product);
            res.json(result);
        });

        app.post('/order', async (req, res) => {
            const order = req.body;
            console.log('placed order is', order);
            const result = await orderCollection.insertOne(order);
            if (result) {
                const query = { email: order.orderedBy };
                const result2 = await cartCollection.deleteMany(query);
            }
            res.json(result);
        });
        app.get('/order/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { orderedBy: email };
            const cursor = await orderCollection.find(query);
            const result = await cursor.toArray();

            res.json(result);
        });
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
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id;
            //console.log(typeof (id));
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.findOne(query);
            console.log(result);
            res.send(result);
        });
        app.post('/cart', async (req, res) => {
            const order = req.body;
            console.log('order is', order);
            const query = { _id: order._id };
            const result = await cartCollection.findOne(query);
            if (result) {
                const filter = { _id: order._id }
                console.log(result);
                const newQuantity = result.quantity + 1;
                console.log('new quantiy is', newQuantity);
                const updateDoc = { $set: { quantity: newQuantity } };
                const result2 = await cartCollection.updateOne(filter, updateDoc);
                console.log('if exist', result2);
                res.json(result2)
            }
            else {
                console.log('oder before adding quantiyy', order);
                order.quantity = 1;
                console.log('oder after adding quantiyy', order);
                const result2 = await cartCollection.insertOne(order);
                console.log('if dont exist', result2);
                res.json(result2);
            }
            
        });
        app.post('/wishlist', async (req, res) => {
            const order = req.body;
            try {
                const result = await wishlistCollection.insertOne(order);
                res.json(result);
                
                // business logic goes here
            } catch (error) {
                //console.log('error is', error.code); // from creation or business logic
                res.json(error.code);
            }
          
           
        });
        app.get('/cart/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const cursor = await cartCollection.find(query);
            const result = await cursor.toArray();
            console.log('result is', result);
            res.json(result);
        });
        app.get('/wishlist/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const cursor = await wishlistCollection.find(query);
            const result = await cursor.toArray();
            console.log('result is', result);
            res.json(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(req.body);
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
            console.log('result', result);
            res.json(result)
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            console.log('email', email);
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
            // console.log('put', req.decodedEmail)
            // const requester = req.decodedEmail;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        app.delete("/deleteProduct/:id", async (req, res) => {
            console.log('server hitted')
            console.log(req.params.id);
            const result = await inventoryCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });
        app.delete("/delete-wishlist/:id", async (req, res) => {
            console.log('server hitted')
            console.log(req.params.id);
            const result = await wishlistCollection.deleteOne({
                _id: req.params.id,
            });
            res.send(result);
        });
        app.delete("/deleteCart/:id", async (req, res) => {
            console.log('server hitted')
            console.log(req.params.id);
            const result = await cartCollection.deleteOne({
                _id: req.params.id,
            });
            res.send(result);
        });
        app.get('/site1', (req, res) => {
            res.send("Running site 1");
        })
        app.get('/site2', (req, res) => {
            res.send("Running site 2");
        })
    }
    finally {
       // await client.close();
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