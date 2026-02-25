import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use('/client', express.static(path.join(__dirname, 'prototype')));

import user from './routes/user.js';
import todo from './routes/todo.js';
import note from './routes/notes.js';

app.use(user);
app.use(todo);
app.use(note);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'prototype/index.html'));
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});