module.exports.formatTransactionAmount = async (req, res, next) => {
    req.body.amount = Math.round(req.body.amount * 100) / 100;
    next();
}