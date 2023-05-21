
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());









const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whedaw2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
         client.connect();

        const toyCollection = client.db("ToysDB").collection('ToysCollection')

        // const indexKeys = { toy_name: 1};
        // const indexOptions = { name: "toy_name" };
        // const result = await toyCollection.createIndex(indexKeys, indexOptions);
        // console.log(result);


        app.post('/postToy', async (req, res) => {
            const body = req.body;
            body.createdAt = new Date();
            const result = await toyCollection.insertOne(body);
            res.send(result);
            // console.log(body);
        })
        app.get('/postToy', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result);
        })
    

        app.get('/postToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result);
        })


        app.get('/allToy/:text', async (req, res) => {
            console.log(req.params.text);
            if (req.params.text == 'Bear' || req.params.text == 'Horse' || req.params.text == 'Tiger') {

                const result = await toyCollection.find({ category: req.params.text }).toArray();
                return res.send(result);

            }
            const result = await toyCollection.find({}).toArray();
            res.send(result);
        })
        app.get('/searchToy/:text', async (req, res) => {
            const searchText = req.params.text;
            const result = await toyCollection.find({
                $or: [
                    { toy_name: { $regex: searchText, $options: "i" } },
                   
                ],
            }).toArray();
            res.send(result);
        });
        app.get('/myToys/:email', async (req, res) => {
            const result = await toyCollection.find({ postedBy: req.params.email }).toArray();
            res.send(result);
        })

        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("toy server is running")
})

app.listen(port, (req, res) => {
    console.log(`Toy server running on port: ${port}`)
})