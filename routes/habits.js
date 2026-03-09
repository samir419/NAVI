import express from 'express';
const router = express.Router();
import { Habit } from '../db.js';
import { authenticateToken } from '../auth.js';

router.post('/create_habit', authenticateToken, async (req, res) => {
    try {
        const new_habit = new Habit({
            name: req.body.name,
            owner: req.body.userId,
            dates: [],
        });

        await new_habit.save();
        res.json({ status: 'ok', habit: new_habit });
    } catch (err) {
        res.json({ status: 'error', data: err.message });
    }
});

router.delete('/delete_habit/:id', authenticateToken, async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ status: 'ok' });
    } catch (err) {
        res.json({ status: 'error', data: err.message });
    }
});

router.get('/habits/:userId', authenticateToken, async (req, res) => {
    try {
        const habitlist = await Habit.find({ owner: req.params.userId });
        res.json(habitlist)
    } catch (err) {
        res.json({ status: 'error', data: err.message });
    }
});

router.post('/toggle_habit', authenticateToken, async (req, res) => {
    try {
        const { habitId, date } = req.body;
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.json({ status: 'error', data: 'Habit not found' });
        }

        const dateIndex = habit.dates.indexOf(date);
        if (dateIndex > -1) {
            habit.dates.splice(dateIndex, 1);
        } else {
            habit.dates.push(date);
        }

        await habit.save();
        res.json({ status: 'ok', habit });
    } catch (err) {
        res.json({ status: 'error', data: err.message });
    }
});

export default router;
