const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const database = require('./models/db');
const https = require('https');

app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : false}));

app.set('views', './public/views/');
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;




const genesisDate = new Date('2022-05-01');
const mintName = 'MINT';
const payDay = 1;
let hasMinted;

function generateNextPayDate(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return new Date(`${currentMonth + 1 == 12 ? currentYear + 1 : currentYear}-${(currentMonth + 1 % 12) + 1}-${payDay}`);
}

database.getTransactions().then(txs => {

    let currentDate = new Date();
    const minted = txs.filter(tx => {

        if(tx.timestamp == null) return false;

        const monthPayDate = new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${payDay}`);
        const txDate = new Date(tx.timestamp.split(' ')[0].split('.').reverse().join('-'));

        return txDate.getMonth() === monthPayDate.getMonth();
    });
    
    hasMinted = minted.length != 0;

    let nextPayDay = !hasMinted ? currentDate : generateNextPayDate();
    console.log(`Next payday: ${nextPayDay.toLocaleString('fi-FI')}`);

    const genesisMint = 100;
    const prec = 100; //Number of zeroes determines decimal precision.

    setInterval(async () => {
        currentDate = new Date();
        let currentLocale = currentDate.toLocaleString('fi-FI').split(' ')[0];
        let payDayLocale = nextPayDay.toLocaleString('fi-FI').split(' ')[0];

        if(currentLocale === payDayLocale){
            const amount = Math.round(genesisMint / Math.pow(2, currentDate.getFullYear() - genesisDate.getFullYear()) * prec) / prec;
            const users = await database.getWallets();
            const defaultWallets = users.filter(wallet => wallet.default == true);

            for(let wallet of defaultWallets){
                const tx = {
                    sender : mintName,
                    receiver : wallet.address,
                    senderTitle : mintName,
                    receiverTitle : wallet.title,
                    amount,
                    timestamp : new Date().toLocaleString('fi-FI'),
                    message : 'Uunituoreita kolikkeja'
                }

                await database.addTransaction(tx);
            }

            hasMinted = true;
            nextPayDay = generateNextPayDate();
            console.log(`Coins minted! Next payday: ${nextPayDay.toLocaleString('fi-FI')}`);
        }

    }, 60000);
});

app.get('/', async (req, res) => {
    const token = req.cookies && req.cookies.authorization;
    const mints = await database.getTransactions('MINT');
    let circulation = 0;
    mints.forEach(mint => {
        circulation += mint.amount;
    });

    res.render('index/index.ejs', {
        title: 'Etusivu',
        loggedIn : token,
        circulation
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

const httpsServer = https.createServer(app);
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));


