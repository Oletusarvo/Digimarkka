const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

module.exports.requireAuth = (req, res, next) => {
    //Check the header for the auth-key
    const token = req.cookies && req.cookies.authorization;
    
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if(err){
                res.sendStatus(403);
            }
            else{
                req.user = data;
                next();
            }
            
        });
    }
    else{
        res.redirect('/login');
    }
}