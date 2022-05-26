const walletTable = document.querySelector('#wallets-table');
wallets.forEach(wallet => {
    const row = walletsTable.insertRow();

    for(let i = 0; i < 2; ++i){
        const cell = row.insertCell();

        if(i != 0){
            cell.classList.add('align-right');
        }
    }
});