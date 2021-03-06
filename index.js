const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const prot = process.env.PORT || 5000;

// Midilware

app.use(cors());
app.use(express.json())


// MONGODB

const uri = `mongodb+srv://Electric-tools:DSGqSha8Or3BJ4Qz@cluster0.jlquu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}
async function run() {
    try {
        await client.connect()
        console.log('data connected')
        const toolsCllection = client.db('ElectricTools').collection('Tools')
        const bookigCllection = client.db('ElectricTools').collection('bookings')
        const userCllection = client.db('ElectricTools').collection('users')

        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolsCllection.find(query);
            const tools = await cursor.toArray();
            res.send(tools)
        });

        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const tools = await toolsCllection.findOne(query);
            res.send(tools);
        });
        // POST
        app.post('/tools', async(req, res) =>{
            const newService = req.body;
            const result = await toolsCllection.insertOne(newService);
            res.send(result);
        });

        // Manage Product
        app.delete('/tools/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result);
          });

        app.get('/user', async (req, res) => {
            const users = await userCllection.find().toArray();
            res.send(users);
        });

        app.get('/admin/:email', async(req, res) =>{
            const email = req.params.email;
            const user = await userCllection.findOne({email: email});
            const isAdmin = user.role === 'admin';
            res.send({admin: isAdmin})
          })

          app.put('/user/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const requester = req.decoded.email;
            const requesterAccount = await userCollection.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
              const filter = { email: email };
              const updateDoc = {
                $set: { role: 'admin' },
              };
              const result = await userCollection.updateOne(filter, updateDoc);
              res.send(result);
            }
            else{
              res.status(403).send({message: 'forbidden'});
            }
      
          })
        // app.put('/user/admin/:email',  async (req, res) => {
        //     const email = req.params.email;
        //     console.log(email)
        //     const filter = { email: email };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //       $set: { role: 'admin' },
        //     };
        //     const result = await userCllection.updateOne(filter, updateDoc, options);
        //     res.send(result);
        //   })


        app.put('/user/:email',verifyJWT, async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCllection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

            res.send({ result, token });

        })

        app.get('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookigCllection.insertOne(booking)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Hellow world')
})

app.listen(prot, () => {
    console.log(`Hellow world on port on ${prot}`)
})