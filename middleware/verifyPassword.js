const bcrypt = require('bcrypt');

module.exports.verifyPassword = async (req, res, next) => {
    const user = req.user;
    if(await bcrypt.compare(req.body.password, user.password)){
        next();
    }
    else{
        res.status(401).json({
            message : 'Väärä salasana!'
        });
    }
}