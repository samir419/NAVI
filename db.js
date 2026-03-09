import mongoose from 'mongoose';
import 'dotenv/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

const { Schema } = mongoose;
const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri();
mongoose.connect(uri);//process.env.MONGO_URL

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const todoSchema = new mongoose.Schema({
  description: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  start: { type: Date, default: Date.now },
  end: { type: Date }
});

const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
});

const habitSchema = new mongoose.Schema({
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  dates: [String], // Array of date strings like "YYYY-MM-DD"
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
export const Todo = mongoose.model('Todo', todoSchema);
export const Note = mongoose.model('Note', noteSchema);
export const Habit = mongoose.model('Habit', habitSchema);