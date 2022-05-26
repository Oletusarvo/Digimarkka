const database = require('../models/db');
const jwt = require('jsonwebtoken');
const utils = require('../utils/utils');

module.exports.verifyTransaction = async (req, res, next) => {
    const senderWallet = await database.getWallet(req.body.sender);
    const receiverWallet = await database.getWallet(req.body.receiver);
    const senderBalance = await utils.calculateWalletBalance(senderWallet.address);

    const msg = '<h1>Maksu Hylätty!</h1>';

    if(!senderWallet || !receiverWallet){
        res.json({
            message : 'Vastaanottajaa ei ole tai se on poistettu.'
        });
    }
    else if(senderWallet.address === receiverWallet.address){
        res.json({
            message : 'Vastaanottaja ei voi olla sama kuin lähettäjä!'
        });
    }
    else if(req.body.amount > senderBalance){
        res.json({
            message : 'Määrä ylittää tilin saldon!'
        });
    }
    else{
        const {sender, receiver, amount, message} = req.body;
        req.tx = {sender, receiver, amount, message, timestamp : new Date().toLocaleString('fi-FI')};
        next();
    }
}