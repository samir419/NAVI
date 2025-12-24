const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();
const http = require('http');

const app = express();
app.use(express.json());
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
const path = require('path');
app.use('/client', express.static(path.join(__dirname, 'client')));

const user = require('./services/user')
const todo = require('./services/todo')
const note = require('./services/notes')

app.use(user)
app.use(todo)
app.use(note)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});