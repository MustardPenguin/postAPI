const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    return res.send('Get comments');
});

router.get('/:id', (req, res) => {
    return res.send('Get comment ' + req.params.id);
});

router.post('/', (req, res) => {
    return res.send('Create comment');
});

router.put('/:id', (req, res) => {
    return res.send('Update comment ' + req.params.id);
});

router.delete('/:id', (req, res) => {
    return res.send('Delete comment ' + req.params.id);
});

module.exports = router;