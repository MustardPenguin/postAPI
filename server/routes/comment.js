const { Router } = require('express');
const router = Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const User = require('../models/user');
const jwtVerify = require('../jwtverify');

router.get('/', (req, res) => {
    return res.send('Get comments');
});

router.get('/:id', (req, res) => {
    return res.send('Get comment ' + req.params.id);
});

router.post('/', jwtVerify(true), (req, res) => {
    if(req.body.comment.length > 2000) {
        return res.json({ message: "Please reduce comment to 2000 characters." });
    }
    if(req.user === undefined) {
        return res.json({ message: "Please log in first." });
    }

    let user;
    User.findById(req.user.id, { _id: 1 })
      .then(result => {
        if(result === null) {
            res.status(404).json({ message: "User not found" });
            return Promise.reject();
        }
        user = result;
        return Post.findById(req.body.post, { _id: 1 });
      }).then(result => {
        if(result === null) {
            res.status(404).json({ message: "User not found" });
            return Promise.reject();
        }
        const comment = new Comment({
            username: user,
            post: result,
            date: new Date(),
            comment: req.body.comment
        });
        console.log(comment);

        return res.json({ message: "Create comment" });
      }).catch(err => {
        return res.status(500).json({ message: err.toString() });
      });
});

router.put('/:id', (req, res) => {
    return res.send('Update comment ' + req.params.id);
});

router.delete('/:id', (req, res) => {
    return res.send('Delete comment ' + req.params.id);
});

module.exports = router;