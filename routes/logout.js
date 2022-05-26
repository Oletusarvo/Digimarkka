const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    res.clearCookie('authorization');
    res.redirect('/');
});

module.exports = router;