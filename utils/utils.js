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
    let balance = 0;
    recs.forEach(rec => {
        if(rec.sender === address){
            balance -= rec.amount;
        }

        if(rec.receiver === address){
            balance += rec.amount;
        }
    });

    return balance;
}

module.exports.calculateHash = function(data){
    let processedData = typeof data !== 'string' ? JSON.stringify(data) : data;
    return crypto.createHash('sha256').update(processedData).digest('hex');
}

module.exports.createTransaction = async function(utxo, receiver, amount){
    utxo.sort((a, b) => {
        if(a > b){
            return -1;
        }
        else if(a == b){
            return 0;
        }
        else{
            return 1;
        }
    });

    let outputs = [];
    let outputsFound = false;


}