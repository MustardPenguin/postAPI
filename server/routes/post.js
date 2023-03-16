const { Router } = require('express');
const router = Router();
const jwtVerify = require('../jwtverify');
const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    return res.send('Get blogs');
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