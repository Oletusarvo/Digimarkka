const express = require('express');
const router = express.Router();
const database = require('../models/db');
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');

router.get('/', (req, res) => {
    res.render('register/register.ejs');
});

router.post('/', async (req, res) => {

    const {password, password2} = req.body;

    //Check if user already exists
    const users = await database.getUsers();
    if(users.find(item => item.username === req.body.username)){
        return res.status(409).send(`Tili käyttäjänimellä ${req.body.username} on jo olemassa!`);
    }

    //Check if passwords match
    if(password !== password2){
        return res.status(409).send('Salasanat eivät täsmää!');
    }

    try{
        const user = {
            firstname : req.body.username,
            lastname : req.body.lastname,
            username : req.body.username,
            sex : req.body.sex,
            email : req.body.email,
            phone : req.body.phone,
            password : await bcrypt.hash(req.body.password, 10)
        }

        //Generate default wallet
        const wallet = {
            address : utils.generateAddress(64),
            title : 'Oletus',
            username : user.username,
            default : true
        };
    
        await database.addUser(user);
        await database.addWallet(wallet);
        res.redirect('/');
    }
    catch(err){
        return res.sendStatus(500);
    }   
});

module.exports = router;