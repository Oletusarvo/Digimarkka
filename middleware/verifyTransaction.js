const database = require('../models/db');
const jwt = require('jsonwebtoken');
const utils = require('../utils/utils');

module.exports.verifyTransaction = async (req, res, next) => {
    const senderWallet = await database.getWallet(req.body.sender);
    const receiverWallet = await database.getWallet(req.body.receiver);
    const senderBalance = await utils.calculateWalletBalance(senderWallet.address);

    if(!senderWallet || !receiverWallet){
        res.status(401).send(JSON.stringify({
            message : 'Vastaanottajaa ei ole tai se on poistettu.'
        }));
    }
    else if(senderWallet.address === receiverWallet.address){
        res.status(401).send(JSON.stringify({
            message : 'Vastaanottaja ei voi olla sama kuin lähettäjä!'
        }));
    }
    else if(req.body.amount > senderBalance){
        res.status(401).send(JSON.stringify({
            message : 'Määrä ylittää tilin saldon!'
        }));
    }
    else{
        const {sender, receiver, amount,  message} = req.body;
        req.tx = {sender, senderTitle : senderWallet.username,  receiver, receiverTitle : receiverWallet.title, amount, message, timestamp : new Date().toLocaleString('fi-FI')};
        next();
    }
}