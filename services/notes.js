const express = require('express');
const router = express.Router();
const { Note } = require('../db');
const path = require('path');
const {authenticateToken} = require('../auth');


router.post('/create_note',authenticateToken, async (req, res) => {
    try {
        const new_note = new Note({
            title:req.body.title,
            body:req.body.body,
            owner:req.body.userId,
            created_at:Date.now()
        });

        await new_note.save();
        res.json({status:'ok'});
    } catch (err) {
        res.json({ status:'error',data:err.message });
    }
});
router.delete('/delete_note/:id',authenticateToken, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({status:'ok'});
    } catch (err) {
        res.json({ status:'error',data:err.message });
    }
});
router.get('/notes/:userId',authenticateToken, async (req, res) => {
    try{
        const notelist = await Note.find({ owner: req.params.userId });
        res.json(notelist)
    }catch (err){
        res.json({ status:'error',data:err.message });
    }
});


module.exports = router;