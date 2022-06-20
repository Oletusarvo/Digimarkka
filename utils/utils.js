const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const database = require('../models/db');
require('dotenv').config();

module.exports.generateAddress = function (len){
    let address = '';
    for(let i = 0; i < len; ++i){
        const n = Math.round(Math.random() * 15).toString(16);
        address += n;
    }

    return address;
}

module.exports.generateAccessToken = function(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "20m"});
}

module.exports.formatEvent = function(tx, wallet){
    tx.amount = tx.amount.toLocaleString('fi-FI');
    if(tx.sender === wallet.address){
        tx.amount = '-' + tx.amount;
    }
    else if(tx.receiver === wallet.address){
        tx.amount = '+' + tx.amount;
    }

    return tx;
}

module.exports.generateWalletEvents = async function(wallet){
    let events = [];
    const txs = await database.getTransactions(wallet.address);
    
    txs.forEach(tx => {
        events.push(module.exports.formatEvent(tx, wallet));
    });

    return events;
}

module.exports.calculateWalletBalance = async function(address){
    const recs = await database.getTransactions(address);
    return recs.reduce((acc, cur) => (
        cur.sender === address ? acc - cur.amount : 
        cur.receiver === address ? acc + cur.amount : 
        acc), 0);
}

module.exports.calculateHash = function(data){
    let processedData = typeof data !== 'string' ? JSON.stringify(data) : data;
    return crypto.createHash('sha256').update(processedData).digest('hex');
}