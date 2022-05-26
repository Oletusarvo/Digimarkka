const express = require('express');
const router = express.Router();
const database = require('../models/db');
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
const jwt = require('jsonwebtoken');
const requireAuth = require('../middleware/requireAuth').requireAuth;

router.get('/', requireAuth, async (req, res) => {
    const {username} = req.user;

    const user = await database.getUser(username);
    if(!user){
        return res.sendStatus(404);
    }


    const wallets = await database.getWallets(username);
    for(let wallet of wallets){
        wallet.balance = (await utils.calculateWalletBalance(wallet.address)).toLocaleString('fi-FI');
    }    

    const events = await utils.generateWalletEvents(wallets);
    
    res.render('account.ejs', {
        title: 'Tili',
        username : username,
        wallets : wallets || [],
        events : events || []

    });
});

module.exports = router;

