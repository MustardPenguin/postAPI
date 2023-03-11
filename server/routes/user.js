const { Router } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = Router();

router.get('/', (req, res) => {
    return res.send("Get users");
});

router.get('/:id', (req, res) => {
    return res.send("Get user " + req.params.id);
});

router.post('/', (req, res, next) => {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if(user) {
            res.json({ message: "Username already exists" });
            return;
        }

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            const user = new User({
                username: req.body.username,
                password: hashedPassword,
            });
            
            user.save().then(() => {
                console.log("Successfully saved account");
            }).catch((err) => {
                return res.json(err);
            });
        });
      })
      .catch((err) => {
        return res.json(err);
      });
    
    

    
});

router.delete('/:id', (req, res) => {
    return res.send("Delete user " + req.params.id);
});

module.exports = router;