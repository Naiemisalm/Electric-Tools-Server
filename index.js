const express = require('express');
const cors = require('cors');
const app = express()
const prot = process.env.PROT || 5000;

// Midilware

app.use(cors());
app.use(express.json())

app.get('/', async(req,res)=>{
    res.send('Hellow world')
})

app.listen(prot,()=>{
    console.log(`Hellow world on port on ${prot}`)
})