const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const  authenticate = require('./auth/authenticate')

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Conectado a mongoDB");
}

main().catch(console.error);


app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));
app.use('/api/user', authenticate, require('./routes/user'));
app.use('/api/todos', authenticate, require('./routes/todos'));
app.use('/api/refresh-token', require('./routes/refresh-token'));
app.use('/api/signout', require('./routes/signout'))

app.get("/", (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is Running on port: ${port}`);
});

