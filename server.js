const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const database = require('./models/db');

app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : false}));

app.set('views', './public/views/');
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

const genesisDate = new Date('2022-05-01');
const currentDate = new Date();
const payDay = 1;

setInterval(async () => {
    if(currentDate.getDate() == payDay){

    }
}, 1000 * 60 * 60);

app.get('/', (req, res) => {
    const token = req.cookies && req.cookies.authorization;
    res.render('index.ejs', {
        title: 'Etusivu',
        loggedIn : token
    });
});

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

const accountsRouter = require('./routes/account');
app.use('/account', accountsRouter);

const walletRouter = require('./routes/wallets');
app.use('/wallets', walletRouter);

const logoutRouter = require('./routes/logout');
app.use('/logout', logoutRouter);

const paymentRouter = require('./routes/payment');
app.use('/payment', paymentRouter);

const miningRouter = require('./routes/mine');
app.use('/mine', miningRouter);

