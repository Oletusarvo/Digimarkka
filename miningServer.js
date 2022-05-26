const express = require('express');

const app = express();
const PORT = process.env.MINING_PORT || 3001;

app.listen(PORT, () => console.log('mining server listening...'));

app.post('/mine', async (req, res) => {
    let hash;
    req.tx.nonce = 0;
    const difficulty = 5;
    const target = Array(difficulty).fill('0').join('');
    //let prevtimestamp = new Date();

    console.log('Mining...');
    while(1){
        let hasher = crypto.createHash('sha256');
        req.tx.timestamp = new Date().toLocaleString('fi-FI');
        hash = hasher.update(JSON.stringify(req.tx)).digest('hex');

        if(hash.substring(0, difficulty) === target){
            break;
        }
        else{
            req.tx.nonce++;
        }
    }
    

    req.tx.hash = hash;
    res.json(req.tx);
});