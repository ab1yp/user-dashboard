//import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

//import express library
const app = express();


app.use(cors());
app.use(bodyParser.json());

// connect to mongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase')
.then(() => console.log('MongoDB connection established!'))
.catch(() => console.error('MongoDB connection error:'));

// create schema for database
const userSchema = new mongoose.Schema({
    name: {type: 'string', required: true},
    email: {type: 'string', required: true},
    password: {type: 'string', required: true},
});
const User = mongoose.model('User', userSchema);

//create new data (user)
app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save()
});

// read all data (users) from database
app.get('/users', async (req, res) => {
        const users = await User.find().lean();
        res.json(users);
});

//update data (user)
app.put('/users/:id', async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body );
    res.json(updatedUser);
})

//delete data (user)
app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
})

//check email in databse already
app.get('/users/email/:email', async (req, res) => {
    const email = req.params.email
    const check = await User.findOne({email});
    if (check === null || undefined) {
        res.json(true);
    }else {
        res.json(false);
    }
})
//check email in databse already in sing up
app.get('/users/signin/email/:email', async (req, res) => {
    const email = req.params.email
    const output = await User.findOne({email});
    res.json(output)
})

//check password in databse already in sing up
app.get('/users/signin/password/:password', async (req, res) => {
    const password = req.params.password
    const output = await User.findOne({password});
    res.json(output)
})

// port number
const port = 3000;

// run server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);})
