import express from 'express';
const router = express.Router();
import { User } from '../db.js';
import bcrypt from 'bcrypt';
import upload from '../multer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generate_token, authenticateToken } from '../auth.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SALT_ROUNDS = 10;

router.post('/signup', async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    req.body.password = hashedPassword;
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });

    await newUser.save();
    const token = generate_token(newUser);
    console.log('user signed in' + newUser);
    res.json({ status: 'ok', data: token, user: newUser });
  } catch (err) {
    res.json({ status: 'error', data: err.message });
  }
});

router.post('/save_conversation', authenticateToken, async (req, res) => {
  try {
    res.json(req.body)
  } catch (err) {
    res.json({ status: 'error', data: err.message });
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (match) {
    const token = generate_token(user);
    res.json({ status: 'ok', data: token, user: user });
  } else {
    res.status(401).json({ status: 'error', error: 'Wrong password' });
  }
});

router.post('/authenticate', authenticateToken, async (req, res) => {
  let user = await User.findById(req.body.userId);
  res.json({ status: 'ok', user: user });
})

router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users)
});

router.post('/update_user/:id', upload.single('file'), async (req, res) => {
  // Find the user first to get the current profile_pic
  const user = await User.findById(req.params.id);
  let newProfilePic = user.profile_pic;

  // If a new file is uploaded, delete the old profile picture (unless it's the default)
  if (req.file) {
    newProfilePic = req.file.filename;
    if (user.profile_pic && user.profile_pic !== 'Picture1.png') {
      const oldPicPath = path.join(__dirname, 'files', user.profile_pic);
      fs.unlink(oldPicPath, err => {
        if (err) {
          console.error(`Failed to delete old profile picture: ${oldPicPath}`, err);
        }
      });
    }
  }

  const updatedData = {
    name: req.body.username,
    bio: req.body.bio,
    profile_pic: newProfilePic // Use new or original profile pic
  };
  const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  res.json(updatedUser);
});

router.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user)
})

router.get('/get_api_key', authenticateToken, async (req, res) => {
  const data = { api_key: process.env.AI_API_KEY }
  if (!data.api_key) {
    return res.json({ status: 'error', data: 'API key not set' })
  }
  res.json(data)
})

export default router;