const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    return res.send("Get users");
});

router.get('/:id', (req, res) => {
    return res.send("Get user " + req.params.id);
});

router.post('/', (req, res) => {
    return res.send("Create user");
});

router.delete('/:id', (req, res) => {
    return res.send("Delete user " + req.params.id);
});

module.exports = router;