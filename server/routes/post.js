const { Router } = require('express');
const router = Router();
const jwtVerify = require('../jwtverify');

router.get('/', (req, res) => {
    return res.send('Get blogs');
});

router.get('/:id', (req, res) => {
    return res.send('Get blog ' + req.params.id);
});

router.post('/', jwtVerify, (req, res) => {
    if(req.user) {
        console.log(req.body);
        return res.json({ message: "Creating blog..." });
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