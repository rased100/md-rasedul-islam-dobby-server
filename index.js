const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mpnmilk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("dobby_ads").collection("user");
        const galleryCollection = client.db("dobby_ads").collection("gallery");

        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/galleryy', async (req, res) => {
            const query = {};
            const cursor = galleryCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        app.post('/gallery', async (req, res) => {
            const gallery = req.body;
            const result = await galleryCollection.insertOne(gallery);
            res.send(result);
        });

        app.get('/gallery', async (req, res) => {
            const uploadby = req.query.uploadby;
            const query = { uploadby: uploadby };
            const gallery = await galleryCollection.find(query).toArray();
            res.send(gallery);
        })
        app.get('/search', async (req, res) => {
            const name = req.query.name;
            const query = { name: name };
            const search = await galleryCollection.find(query).toArray();
            res.send(search);
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Dobby!')
})

app.listen(port, () => {
    console.log(`Dobby adds app listening on port ${port}`)
})