const router = require('express').Router();
const checkAuthorization = require('../middleware/checkAuthorization').checkAuthorization;
const verifyPassword = require('../middleware/verifyPassword').verifyPassword;
const verifyTransaction = require('../middleware/verifyTransaction').verifyTransaction;
const formatTransactionAmount = require('../middleware/formatTransactionAmount').formatTransactionAmount;
const database = require('../models/db');

const utils = require('../utils/utils');

const jwt = require('jsonwebtoken');
const { signTransaction } = require('../middleware/signTransaction');

router.get('/', checkAuthorization, async (req, res) => {
    const addressOwner = req.query.search;

    const wallets = addressOwner ? await database.getWallets(addressOwner) : await database.getWallets();
    const myWallets = await database.getWallets(req.user.username);

    for(let wallet of myWallets){
        wallet.balance = (await utils.calculateWalletBalance(wallet.address)).toLocaleString('fi-FI');
    }

    res.render('payment/payment.ejs', {
        myWallets : myWallets || [],
        wallets : wallets || []
    });
});

router.post('/', checkAuthorization, verifyPassword, formatTransactionAmount, verifyTransaction, async (req, res) => {
    await database.addTransaction(req.tx);
    res.json({
        message : 'OK'
    });
});

router.get('/internal', checkAuthorization, async (req, res) => {
    const myWallets = await database.getWallets(req.user.username);
    for(let wallet of myWallets){
        wallet.balance = (await utils.calculateWalletBalance(wallet.address)).toLocaleString('fi-FI');
    }

    res.render('payment/internal.ejs', {
        wallets : myWallets || []
    });
});

router.post('/internal', checkAuthorization, formatTransactionAmount, verifyTransaction, async (req, res) => {
    await database.addTransaction(req.tx);
    res.json({
        message : 'OK'
    });
});



module.exports = router;