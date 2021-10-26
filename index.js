const express = require("express");
const app = express();
require('dotenv').config()
const cors = require("cors")
const { MongoClient } = require('mongodb');
const e = require("express");
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0th5g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      console.log("database coccect");
      const database = client.db("ema_jhon_shop");
      const productCollection = database.collection("products");
      const orderCollection = database.collection("orders");

    //   get api
    app.get("/products", async (req, res) => {
        const cursor = productCollection.find({});
        const page = req.query.page;
        const size = parseInt(req.query.size);
        let products;
        const count = await cursor.count();
        if(page){
             products = await cursor.skip(page*size).limit(size).toArray();
        }
        else{
            products = await cursor.toArray();
        }
        
        res.send({
            count,
            products
        });
    })

    // use post to get data by keys
    app.post("/products/byKeys", async (req, res) => {
        const keys = req.body;
        const query = {key : {$in: keys}}
        const products = await productCollection.find(query).toArray();
        res.json(products)
    })

    app.post("/orders", async (req, res) => {
        const orders = req.body;
        const result = await orderCollection.insertOne(orders)
        res.json(result)

    })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("ema-jhon server running");
});

app.listen(port, () => {
    console.log("running amazon Server", port);
})