const express = require('express');
const router = express.Router();
const database = require('../models/db');
const requireAuth = require('../middleware/requireAuth').requireAuth;
const generateAddress = require('../utils/utils').generateAddress;

router.get('/', requireAuth, async (req, res) => {
    res.render('wallets/wallets.ejs', {
        title : 'Maksuosoitteet',
        wallets : await database.getWallets() || []
    });
});

router.get('/new', requireAuth, async (req, res) => {
    res.render('wallets/new.ejs', {
        title : 'Uusi maksuosoite'
    });
});

router.get('/delete', requireAuth, async (req, res) => {
    res.render('wallets/delete.ejs', {
        title : 'Poista Maksuosoite',
        wallets : await database.getWallets(req.user.username) || []
    });
});

router.post('/delete', requireAuth, async (req, res) => {
    const wallet = await database.getWallet(req.body.address);

    if(wallet){
        if(wallet.balance > 0){
            res.status(401).send("Maksuosoitteen saldo tulee olla 0mk ennen poistoa!");
        }
        else{
            await database.deleteWallet(req.body.address);
            res.redirect('/account');
        }
    }
    else{
        res.sendStatus(500);
    }
}); 

router.post('/new', requireAuth, async (req, res) => {
    const user = req.user;

    await database.addWallet({
        title : req.body.title,
        address : generateAddress(64),
        username : user.username,
        balance : 0
    });

    res.status(200).send();
});

module.exports = router;