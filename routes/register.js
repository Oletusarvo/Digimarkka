const express = require('express');
const router = express.Router();
const database = require('../models/db');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('register.ejs');
});

router.post('/', async (req, res) => {

    const {password, password2} = req.body;

    //Check if user already exists
    const users = await database.getUsers();
    if(users.find(item => item.username === req.body.username)){

        res.render('register.ejs', {
            usernameError : 'Käyttäjänimi on jo olemassa!',
        });
    }

    //Check if passwords match
    if(password !== password2){
        res.render('register.ejs', {
            passwordError : 'Salasanat eivät täsmää!'
        });

        return;
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
    
        await database.addUser(user);
        res.redirect('/');
    }
    catch(err){
        res.sendStatus(500);
    }   
});

module.exports = router;