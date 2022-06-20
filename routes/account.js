const express = require('express');
const router = express.Router();
const database = require('../models/db');
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');
const jwt = require('jsonwebtoken');
const checkAuthorization = require('../middleware/checkAuthorization').checkAuthorization;

router.get('/', checkAuthorization, async (req, res) => {
    const {username} = req.user;

    const user = await database.getUser(username);
    if(!user){
        return res.sendStatus(404);
    }

    const wallets = await database.getWallets(username);
    for(let wallet of wallets){
        wallet.balance = (await utils.calculateWalletBalance(wallet.address)).toLocaleString('fi-FI');
    }    

    //Generate wallet events.
    const query = req.query.events;
    let events = [];

    for(const wallet of wallets){
        const txs = await database.getTransactions(wallet.address);
        txs.forEach(tx => tx = utils.formatEvent(tx, wallet));
        events = events.concat(txs);
    }

    if(query != undefined && query != ''){
        events = events.filter(e => (
            e.amount == query ||
            e.sender_title == query ||
            e.receiver_title == query ||
            e.sender == query ||
            e.receiver == query ||
            e.timestamp == query
        ));
    }
    
    res.render('account/account.ejs', {
        title: 'Tili',
        username : username,
        wallets : wallets || [],
        events : events || [],
        loggedIn: true

    });
});

router.get('/delete', checkAuthorization, async (req, res) => {
    res.render('account/delete.ejs', {
        title : 'Poista Tili'
    });
});

module.exports = router;

