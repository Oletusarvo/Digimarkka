const db = require('../dbconfig');

module.exports.addUser = async function(user){
    return await db('users').insert({
        firstname : user.firstname,
        lastname : user.lastname,
        username : user.username,
        password : user.password,
        sex : user.sex,
        email : user.email,
        phone : user.phone
    }, ['username']);
}

module.exports.addWallet = async function(wallet){
    return await db('wallets').insert({
        username : wallet.username,
        address : wallet.address,
        title : wallet.title
    }, ['address']);
}

module.exports.addTransaction = async function(tx){
    return await db('transactions').insert({
        sender : tx.sender,
        receiver : tx.receiver,
        amount : tx.amount,
        timestamp : tx.timestamp,
        message : tx.message
    });
}

module.exports.addBlock = async function(block){
    const {hash, previous_hash, timestamp, data, nonce} = block;
    return await db('blocks').insert({
        hash,
        previous_hash,
        nonce,
        timestamp,
        data
    });
}

module.exports.getBlocks = async function(){
    return await db('blocks');
}

module.exports.getTransactionsBySender = async function(address){
    return await db('transactions').where({sender : address});
}

module.exports.getTransactionsByReceiver = async function(address){
    return await db('transactions').where({receiver : address});
}

module.exports.getTransactions = async function(address = undefined){
    const recs =  await db('transactions');
    const txs = address !== undefined ? recs.filter(rec => rec.receiver === address || rec.sender === address) : recs;
    return txs;
}

module.exports.getWallets = async function(username = undefined){
    return await username !== undefined ? db('wallets').where({username : username}) : db('wallets');
}

module.exports.getWallet = async function(address){
    return await db('wallets').where({address}).first();
}

module.exports.deleteWallet = async function(address){
    return await db('wallets').where({address}).del();
}

module.exports.getUsers = async function(){
    return await db('users');
}

module.exports.getUser = async function(username){
    return await db('users').where({username}).first();
}