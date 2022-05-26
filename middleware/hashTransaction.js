const jwt = require('jsonwebtoken');
const utils = require('../utils/utils');

module.exports.hashTransaction = async (req, res, next) => {
    req.tx.timestamp = new Date().toLocaleString('fi-FI');
    req.tx.nonce = 0;
    req.tx.hash = utils.calculateHash(req.tx);
    next();
}