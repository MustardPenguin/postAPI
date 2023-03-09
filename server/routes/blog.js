const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    return res.send('Get blogs');
});

router.get('/:id', (req, res) => {
    return res.send('Get blog ' + req.params.id);
});

router.post('/', (req, res) => {
    return res.send('Create blog');
});

router.put('/:id', (req, res) => {
    return res.send('Update blog ' + req.params.id);
});

router.delete('/:id', (req, res) => {
    return res.send('Delete blog ' + req.params.id);
});

module.exports = router;