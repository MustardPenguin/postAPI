const { Router } = require('express');
const router = Router();
const jwtVerify = require('../jwtverify');
const Like = require('../models/like');

const multer = require('multer');
const upload = multer();

router.post('/', jwtVerify, (req, res) => {
    console.log("create like");
    console.log(req.body);
});

module.exports = router;