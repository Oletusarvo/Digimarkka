const router = require('express').Router();
const database = require('../models/db');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.render('mine.ejs', {
        title : 'Louhi'
    });
});

router.get('/start', async (req, res) => {
    const txs = await database.getTransactions();
    res.json(txs);
})

router.post('/', async (req, res) => {  
    //Add mined transactions into database.
    const block = req.body;
    jwt.sign(block.data, process.env.BLOCK_SECRET, async (err, token) => {
        if(err){
            res.sendStatus(403);
            return;
        }

        block.data = token;
        await database.addBlock(block);
    });

    res.redirect('/account');
});

module.exports = router;