const { Router } = require('express');
const router = Router();
const jwtVerify = require('../jwtverify');
const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const skip = req.query.skip === undefined ? 0 : req.query.skip;
  console.log(skip);
  Post.find().sort({ date: -1 }).skip(skip).populate("author").limit(10).then(results => {
    return res.json({ posts: results });
  }).catch(err => {
    return res.status(404).json({ error: "Could not get posts" });
  });
});

router.get('/:id', (req, res) => {
  return res.send('Get blog ' + req.params.id);
});

router.post('/', jwtVerify, (req, res) => {
    if(req.user) {
        User.findById(req.user.id)
          .then((result) => {
            if(result == undefined) {
                console.log("Null user");
                return res.json({ message: "Could not find user" });
            }

            if(req.body.title.length > 200) {
              return res.json({ message: "Title cannot be more than 200 characters" });
            } else if(req.body.text.length > 10000) {
              return res.json({ message: "Text cannot be more than 10000 characters" });
            }

            const post = new Post({
                title: req.body.title,
                text: req.body.text,
                date: new Date(),
                author: result
            });
            
            post.save()
              .then(() => {
                console.log("Created post");
                res.json({ message: "Created post!", created: true });
              })
              .catch(err => {
                res.json({ message: err });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.json({ message: err });
          });
    } else {
        console.log("Not authorized");
        return res.json({ message: "Unauthorized "});
    }
});

router.put('/:id', (req, res) => {
    return res.send('Update blog ' + req.params.id);
});

router.delete('/:id', (req, res) => {
    return res.send('Delete blog ' + req.params.id);
});

module.exports = router;