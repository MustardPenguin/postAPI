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
    User.findById(req.user.id)
        .then(result => {
            if(result === null) {
                return res.status(404).json({ message: "User not found" });
            }
            return result;
        })
        .then(username => {
            user = username._id;
            return db.findById(req.body.id);
        })
        .then(result => {
            if(result === null) {
                return res.status(404).json({ message: "Post/comment not found" });
            }
            item = result._id;
            const params = {};
            if(req.body.type === "post") {
                params['likedPost'] = req.body.id;
            } else {
                params['likedComment'] = req.body.id;
            }
            console.log(params);
            //return Like.find({  });
        })
        .catch(err => {
            return res.status(500).json({ message: err });
        }
    );

    return res.json({ message: "test" });
    /*
    db.findById(req.body.id)
      .then(result => {
        if(result === null) {
            return res.status(404).json({ message: "Data not found" });
        }

        
        const type = req.body.type === "post" ? "likedPost" : "likedComment";
        const like = new Like({
            
        });
        return res.json({ message: "Success", success: true });
        
        like.save().then(() => {
            return res.json({ message: "Success", success: true });
        }).catch(err => {
            return res.status(500).json({ message: "Error saving" });
        })
      })
      .catch(err => {
        return res.status(404).json({ error: err });
      });*/
});

module.exports = router;