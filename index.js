const express = require("express")
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
app.use(cors())
app.use(express.json())
// 2Wz5Y4bOWMzEIsmh
// showaibsportfolio
const { query } = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = "mongodb+srv://showaibsportfolio:2Wz5Y4bOWMzEIsmh@myfirstdb.w4kvmll.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const reviews = client.db('showaibsportfolio').collection('reviews')
        const blogs = client.db('showaibsportfolio').collection('blogs')
        app.get("/reviews", async(req,res)=>{
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = {}
            const result = await reviews.find(query).sort({_id:-1}).skip(page*size).limit(size).toArray()
            res.send(result)
        })
        app.get("/blogs", async(req,res)=>{
            const query = {}
            const result = await blogs.find(query).sort({_id:-1}).toArray()
            res.send(result)
        })
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await blogs.findOne(query);
            res.send(result)
        })
        app.post("/reviews", async(req,res)=> {
            const data = req.body
            const result = await reviews.insertOne(data)
            res.send(result) 
        })
        app.get('/reviewscount', async(req, res)=>{
            const count = await reviews.estimatedDocumentCount()
            res.send({count})
        })
        app.post("/blogs", async(req,res)=> {
            const data = req.body
            const result = await blogs.insertOne(data)
            res.send(result) 
        })
        app.delete('/blogs/delete/:id', async(req,res)=>{
            const data = req.params.id;
            const query = { _id: new ObjectId(data) };
            const result = await blogs.deleteOne(query);
            res.send(result)
        })
    } catch {
        console.log("database not connected");
    }
}

run().catch(console.log)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})