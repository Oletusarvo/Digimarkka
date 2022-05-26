const crypto = require('crypto');

module.exports.signTransaction = async (req, res, next) => {
    const {password, sender, receiver, amount} = req.body;
    const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
      });
    
    const data = Buffer.from(JSON.stringify({sender, receiver, amount}));
    const signature = crypto.sign('sha256', data, privateKey);
    req.signature = signature.toString('base64');
    next();
}