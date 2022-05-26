const express = require('express');
const router = express.Router();
const database = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

router.get('/', (req, res) => {
    res.render('login/login.ejs', {
        title : 'Kirjaudu Sisään'
    });
});

router.get('/success', (req, res) => {

    console.log(req.header);

    res.render('login/success', {
        title : 'Sisäänkirjautuminen onnistui'
    });
});

router.post('/', async (req, res) =>{
    const user = await database.getUser(req.body.username);

    if(!user){
        return res.render('login/login', {
            usernameError : 'Käyttäjätiliä ei ole!'
        });
    }

    if(await bcrypt.compare(req.body.password, user.password)){
        jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, async (err, token) => {

            if(err){
                console.log(err);
                return res.status(500).send('Something went wrong!');
            }

            res.cookie('authorization', token, {maxAge : 1000 * 60 * 60, secure : true, httpOnly : true});
            res.send();
        });
    }
    else{
        res.status(401).render('login/login', {
            passwordError : 'Väärä salasana!'
        })
    }
});

module.exports = router;