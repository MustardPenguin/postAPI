const { Router } = require('express');
const router = Router();
const jwtVerify = require('../jwtverify');
const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

router.post('/', jwtVerify, (req, res) => {
    let db;
    if(req.body.type === "post") {
        db = Post;
    } else if(req.body.type === "comment") {
        db = Comment;
    }
    if(!db) {
        return res.json({ message: "Invalid type" });
    }
    
    let user;
    let item;
    let dbParams;
    User.findById(req.user.id)
        .then(result => {
            // Gets user
            if(result === null) {
                return res.status(404).json({ message: "User not found" });
            }
            return result;
        })
        .then(username => {
            user = username._id;
            // Gets post/comment
            return db.findById(req.body.id);
        })
        .then(result => {
            if(result === null) {
                return res.status(404).json({ message: "Post/comment not found" });
            }
            // Checks if the post/comment was already liked by the user
            item = result._id;
            const params = {};
            if(req.body.type === "post") {
                params['likedPost'] = item;
            } else {
                params['likedComment'] = item;
            }
            params['username'] = user;
            dbParams = params;
            return Like.find(params);
        })
        .then(result => {
            if(result.length === 0) {
                // Not liked post/comment found, create one
                const like = new Like(dbParams);
                console.log(like);
                like.save()
                  .then(() => {
                    return res.json({ message: "Liked", success: true });
                  })
                  .catch(err => {
                    return res.status(500).json({ message: "Error saving" });
                  })
            } else {
                // "Unlike" the post/comment by deleting it
                console.log('unlike');
            }
            console.log(result);
        })
        .catch(err => {
            return res.status(500).json({ message: err });
        }
    );
});

module.exports = router;