const express = require('express');
const router = express.Router();
const database = require('../models/db');
const checkAuthorization = require('../middleware/checkAuthorization').checkAuthorization;
const generateAddress = require('../utils/utils').generateAddress;
const calculateWalletBalance = require('../utils/utils').calculateWalletBalance;

router.get('/', checkAuthorization, async (req, res) => {
    res.render('wallets/wallets.ejs', {
        title : 'Maksuosoitteet',
        wallets : await database.getWallets() || []
    });
});

router.get('/new', checkAuthorization, async (req, res) => {
    res.render('wallets/new.ejs', {
        title : 'Uusi maksuosoite'
    });
});

router.get('/delete', checkAuthorization, async (req, res) => {
    const wallets = await database.getWallets(req.user.username);
    for(let wallet of wallets){
        wallet.balance = await calculateWalletBalance(wallet.address);
    }

    res.render('wallets/delete.ejs', {
        title : 'Poista Maksuosoite',
        wallets : wallets || []
    });
});

router.post('/delete', checkAuthorization, async (req, res) => {
    const wallet = await database.getWallet(req.body.address);

    if(wallet){
        if(wallet.balance > 0){
            res.status(401).send("Maksuosoitteen saldo tulee olla 0mk ennen poistoa!");
        }
        else if(wallet.default){
            res.status(401).send('Oletusmaksuosoitetta ei voi poistaa!');
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

router.post('/new', checkAuthorization, async (req, res) => {
    const user = req.user;
    //A new wallet will be set as default if the user does not have previous wallets.
    const isDefault = (await database.getWallets(user.username)).length == 0 ? true : false;

    await database.addWallet({
        title : req.body.title,
        address : generateAddress(64),
        username : user.username,
        default : isDefault
    });

    res.status(200).send();
});

module.exports = router;