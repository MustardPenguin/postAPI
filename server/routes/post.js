const { Router } = require('express');
const router = Router();
const jwtVerify = require('../jwtverify');
const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');
const upload = require('../upload');
const Like = require('../models/like');
const Comment = require('../models/comment');
const { listeners } = require('../models/user');

router.get('/', jwtVerify(false), (req, res) => {
  const skip = req.query.skip === undefined ? 0 : req.query.skip;
  let posts;
  Post.find().sort({ date: -1 }).skip(skip).populate("author", { password: 0 }).limit(6).lean()
    .then(results => { 
      posts = results;
      // Get likes for posts
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
      // Sets amount of likes to their respective post
      posts.forEach((post) => {
        const likes = results.find((obj) => {
          return obj._id.toString() === post._id.toString();
        });
        let count = 0;
        if(likes !== undefined) {
          count = likes.count;
        }
        post.likes = count;
      });

      return Comment.aggregate([
        {
          $match: {
            post: { $in: posts.map(post => post._id) }
          }
        },
        {
          $group: {
            _id: "$post",
            count: { $sum: 1 }
          }
        }
      ]);
    }).then(results => {
      // Sets amount of comments to their respective post
      posts.forEach((post) => {
        const comments = results.find((obj) => {
          return obj._id.toString() === post._id.toString();
        });
        let count = 0;
        if(comments !== undefined) {
          count = comments.count;
        }
        post.comments = count;
      });
      
      if(req.user === undefined) {
        // User not logged in, no need to go through the other then blocks,
        // end it with this statement, which calls the 'catch' block with undefined
        // error, which just returns the posts.
        return Promise.reject();
      }

      // Fetches the likes from user if logged in
      const userId = new mongoose.Types.ObjectId(req.user.id);
      // Gets ids of posts to check if liked
      const ids = [];
      for(let post of posts) {
        ids[ids.length] = post._id;
      }
      
      return Like.find({ username: userId, likedPost: { $in: ids } });
    }).then((results) => {
      // Converts ids to string ids for comparison
      const likedIds = results.map(post => {
        return post.likedPost.toString();
      });
      // Checks for liked posts
      for(const post of posts) {
        const id = post._id.toString();
        if(likedIds.includes(id)) {
          post.liked = true;
        }
      }

      return res.json({ posts: posts });
    }).catch((err) => {
      if(err === undefined) {
        return res.json({ posts: posts });
      } 
      return res.json({ message: err.toString() });
    });
});

router.get('/:id', jwtVerify(false), (req, res) => {
  let post;
  Post.findById(req.params.id).populate('author', { username: 1 }).lean()
    .then(result => {
      if(result === null) {
        res.status(404).json({ message: 'Post not found'} );
        const error = new Error();
        error.status = 404;
        return Promise.reject({ error: error });
      }
      
      post = result;
      return Like.aggregate([
        {
          $match: {
            likedPost: post._id
          }
        },
        {
          $group: {
            _id: "$likedPost",
            count: { $sum: 1 }
          }
        }
      ]);
    }).then(result => {
      post.likes = result[0] ? result[0].count : 0;
      if(!req.user) {
        res.json({ post: post });
        return Promise.reject({ sent: true });
      }
      return Like.find({ 
        username: new mongoose.Types.ObjectId(req.user.id),
        likedPost: post._id,
       });
    }).then(result => {
      post.liked = false;
      if(result.length > 0) {
        post.liked = true;
      }
      
      return res.json({ post: post });
    }).catch(err => {
      if(err.sent === true) {
        return;
      }
      return res.status(500).json({ message: err });
    });
});

// Get comments for a singular post
router.get('/:id/comments', (req, res) => {
  Comment.find({ post: req.params.id }).sort({ date: -1 }).populate('username', { username: 1 })
    .then(results => {
      return res.json({ comments: results });
    }).catch(err => {
      return res.status(500).json({ message: err.toString() });
    });
});

router.post('/', jwtVerify(true), upload.single('image'), (req, res) => {
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