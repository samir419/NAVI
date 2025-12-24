const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config(); 
mongoose.connect(process.env.MONGO_URL);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const todoSchema = new mongoose.Schema({
  description: String,
  owner:{ type: Schema.Types.ObjectId, ref: 'User' },
  start: { type: Date, default: Date.now },
  end: { type: Date}
});

const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  owner:{ type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo',todoSchema);
const Note = mongoose.model('Note',noteSchema)

module.exports = {
  User,
  Todo,
  Note
};