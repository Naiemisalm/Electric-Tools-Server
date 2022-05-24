const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const prot = process.env.PROT || 5000;

// Midilware

app.use(cors());
app.use(express.json())


// MONGODB

const uri = "mongodb+srv://Electric-tools:DSGqSha8Or3BJ4Qz@cluster0.jlquu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        console.log('data connected')
        const toolsCllection = client.db('ElectricTools').collection('Tools')
        
        app.get('/tools', async(req, res)=>{
            const query = {};
            const cursor = toolsCllection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        });
        // app.get('/tools/:id', async(req, res)=>{
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const tools = await toolsCllection.findOne(query);
        //     res.send(tools);
        //   });
        app.get('/tools/:id',async (req,res)=>{
            const id = req.params.id;
            console.log(id)
            const query = {_id:ObjectId(id)};
            const tools = await toolsCllection.findOne(query);
            res.send(tools);
        })
    } 
    finally {

    }
}
run().catch(console.dir);


app.get('/', async(req, res) => {
    res.send('Hellow world')
})

app.listen(prot, () => {
    console.log(`Hellow world on port on ${prot}`)
})