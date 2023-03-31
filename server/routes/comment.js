const { Router } = require('express');
const router = Router();
const Like = require('../models/like');
const User = require('../models/user');
//const jwtVerify = require('../jwtverify');

router.get('/', (req, res) => {
    return res.send('Get comments');
});

router.get('/:id', (req, res) => {
    return res.send('Get comment ' + req.params.id);
});

router.post('/', (req, res) => {
    if(req.body.comment.length > 2000) {
        return res.json({ message: "Please reduce comment to 2000 characters." });
    }
    if(req.user === undefined) {
        return res.json({ message: "Please log in first." });
    }

    console.log(req.user);


    return res.json({ message: "Create comment" });
});

router.put('/:id', (req, res) => {
    return res.send('Update comment ' + req.params.id);
});

router.delete('/:id', (req, res) => {
    return res.send('Delete comment ' + req.params.id);
});

module.exports = router;