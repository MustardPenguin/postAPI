const { Router } = require('express');
const router = Router();
const jwtVerify = require('../jwtverify');
const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');
const upload = require('../upload');
const Like = require('../models/like');
const { listeners } = require('../models/user');

router.get('/', jwtVerify, (req, res) => {
  const skip = req.query.skip === undefined ? 0 : req.query.skip;
  let posts;
  Post.find().sort({ date: -1 }).skip(skip).populate("author", { password: 0 }).limit(3).lean()
    .then(results => {
      // Not logged in, just send posts
      if(req.user === undefined) {
        return res.json({ posts: results });
      }

      // Logged in, check for likes
      posts = results;
      const userId = new mongoose.Types.ObjectId(req.user.id);

      const ids = [];
      for(let post of results) {
        ids[ids.length] = post._id;
      }

      posts = results;

      return Like.find({ username: userId, likedPost: { $in: ids } });
  }).then(results => {
    const likedIds = results.map(post => {
      return post.likedPost.toString();
    });
    
    for(const post of posts) {
      const id = post._id.toString();
      if(likedIds.includes(id)) {
        post.liked = true;
      }
    }

    return Like.aggregate([
      {
        $match: {
          likedPost: { $in: posts.map(post => post._id ) }
        }
      },
      {
        $group: {
          _id: "$likedPost",
          count: { $sum: 1 }
        }
      }
    ]);
  }).then(results => {
    posts.forEach((post) => {
      const likes = results.find((obj) => {
        //console.log(obj._id.toString() === post._id.toString());
        return obj._id.toString() === post._id.toString();
      });
      let count = 0;
      if(likes !== undefined) {
        count = likes.count;
      }
      post.likes = count;
    });
    
    return res.json({ posts: posts });
  }).catch(err => {
    return res.status(404).json({ error: err.toString() });
  });
});

router.get('/:id', (req, res) => {
  return res.send('Get blog ' + req.params.id);
});

router.post('/', jwtVerify, upload.single('image'), (req, res) => {
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

            const imageUrl = (req.file === undefined ? null : req.file.filename);
            const post = new Post({
                title: req.body.title,
                text: req.body.text,
                date: new Date(),
                author: result,
                image: imageUrl,
            });

            console.log(req.file);
            console.log(post);
          
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