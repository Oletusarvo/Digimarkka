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
    let events = [];
    let address = '';
    if(req.query.events === '' || req.query.events == undefined){
        address = wallets.find(wallet => wallet.default == true).address;
    }
    else{
        address = req.query.events;
    }
    
    

    if(typeof address === 'string' && address != ''){
        const wallet = await database.getWallet(address);
        events = await utils.generateWalletEvents(wallet);
    }
    else{
        for(let wallet of wallets){
            events = events.concat(await utils.generateWalletEvents(wallet));
        }
    }
    
    res.render('account/account.ejs', {
        title: 'Tili',
        username : username,
        wallets : wallets || [],
        events : events || [],
        selectedWallet : address

    });
});

router.get('/delete', checkAuthorization, async (req, res) => {
    res.render('account/delete.ejs', {
        title : 'Poista Tili'
    });
});

module.exports = router;

