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
        const bookigCllection = client.db('ElectricTools').collection('bookings')
        const userCllection = client.db('ElectricTools').collection('users')
        
        app.get('/tools', async(req, res)=>{
            const query = {};
            const cursor = toolsCllection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        });
        
        app.get('/tools/:id',async (req,res)=>{
            const id = req.params.id;
            console.log(id)
            const query = {_id:ObjectId(id)};
            const tools = await toolsCllection.findOne(query);
            res.send(tools);
        })
        app.put('/user/:email', async(req,res)=>{
            const email = req.params.email;
            const user = req.body;
            const filter = {email:email};
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCllection.updateOne(filter, updateDoc, options);
            // const token = jwt.sign({ email: email },'e122b7a6b8c5eecb94f993a4d63707b0664766c18669e123b1a6d4bf4d0799e8a13c6f97db3b45d5be5c07d13427db730c20ead62ca374f90daad7f765456545', { expiresIn: '1h' })
            res.send( result);

        })

        app.get('/booking', async (req,res)=>{
            const booking = req.body;
            const result =await bookigCllection.insertOne(booking)
            res.send(result)
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