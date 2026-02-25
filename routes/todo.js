import express from 'express';
const router = express.Router();
import { Todo } from '../db.js';
import path from 'path';
import { authenticateToken } from '../auth.js';


router.post('/create_todo', authenticateToken, async (req, res) => {
    try {
        const new_todo = new Todo({
            description: req.body.description,
            owner: req.body.userId,
            start: req.body.start_date,
            end: req.body.dead_line,
        });

        await new_todo.save();
        res.json({ status: 'ok' });
    } catch (err) {
        res.json({ status: 'error', data: err.message });
    }
});
router.delete('/delete_todo/:id', authenticateToken, async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ status: 'ok' });
    } catch (err) {
        res.json({ status: 'error', data: err.message });
    }
});
router.get('/todos/:userId', authenticateToken, async (req, res) => {
    try {
        const todolist = await Todo.find({ owner: req.params.userId });
        res.json(todolist)
    } catch (err) {
        res.json({ status: 'error', data: err.message });
    }
});


export default router;