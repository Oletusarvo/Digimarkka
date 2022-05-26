const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth').requireAuth;
const hashTransaction = require('../middleware/hashTransaction').hashTransaction;
const verifyPassword = require('../middleware/verifyPassword').verifyPassword;
const verifyTransaction = require('../middleware/verifyTransaction').verifyTransaction;
const formatTransactionAmount = require('../middleware/formatTransactionAmount').formatTransactionAmount;
const database = require('../models/db');
const transact = require('../utils/utils').transact;

const utils = require('../utils/utils');

const jwt = require('jsonwebtoken');
const { signTransaction } = require('../middleware/signTransaction');

router.get('/', requireAuth, async (req, res) => {
    const addressOwner = req.query.addressOwner;

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

router.get('/internal', requireAuth, async (req, res) => {
    const myWallets = await database.getWallets(req.user.username);
    for(let wallet of myWallets){
        wallet.balance = (await utils.calculateWalletBalance(wallet.address)).toLocaleString('fi-FI');
    }

    res.render('payment/internal.ejs', {
        wallets : myWallets || []
    });
});

router.post('/internal', requireAuth, formatTransactionAmount, verifyTransaction, signTransaction, async (req, res) => {
    const tx = {
        sender : req.body.sender,
        receiver : req.body.receiver,
        amount : req.body.amount,
        hash : req.hash
    };

    await database.addTransaction(tx);
    res.redirect('/account');
});

router.post('/', requireAuth, verifyPassword, formatTransactionAmount, verifyTransaction, async (req, res) => {
    await database.addTransaction(req.tx);
    res.json({
        message : 'OK'
    });
});

module.exports = router;