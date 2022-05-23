const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const prot = process.env.PROT || 5000;

// Midilware

app.use(cors());
app.use(express.json())


// MONGODB

const uri = "mongodb+srv://Electric-tools:DSGqSha8Or3BJ4Qz@cluster0.jlquu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("ElectricTools").collection("Tools");
    console.log(uri);
    // perform actions on the collection object
    client.close();
});

async function run() {
    try {
        await client.connect();
        console.log('data connected')
        const serviceCllection = client.db('doctors-protal').collection('services')
        const bookingCllection = client.db('doctors-protal').collection('bookings')
        const userCllection = client.db('doctors-protal').collection('users')

    } finally {

    }
}
run().catch(console.dir);


app.get('/', async(req, res) => {
    res.send('Hellow world')
})

app.listen(prot, () => {
    console.log(`Hellow world on port on ${prot}`)
})