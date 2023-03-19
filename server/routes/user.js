const { Router } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwtVerify = require('../jwtverify');

const router = Router();

const validateUsername = (username) => {
    const pattern = /^[A-Za-z0-9_]+$/;
    return pattern.test(username);
}
  
const validatePassword = (password) => {
    const pattern = /^[A-Za-z0-9_]+$/;
    return pattern.test(password);
}
  

router.get('/', jwtVerify, (req, res) => {
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

        if(!validateUsername(req.body.username) || !validatePassword(req.body.password)) {
            return res.json({ message: "Invalid character in username/password" });
        }

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            const user = new User({
                username: req.body.username,
                password: hashedPassword,
                created: new Date(),
            });
            
            user.save().then(() => {
                console.log("Successfully saved account");
                return res.json({ message: "Created account", navigate: true });
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