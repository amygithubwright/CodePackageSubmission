const fs = require('fs');

const Web3 = require('web3');
const provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546');
web3 = new Web3(provider);

const filepath = "C:/Users/indiv/Documents/ethereum_blockchain";
var timestamp;


var subscription = web3.eth.subscribe('pendingTransactions', function (err, result) {
    if (!err) {
        console.log(result);
        timestamp = Date.now();
        fs.appendFileSync(filepath + "/data/local/pendingTransactions.txt", result + ":" + timestamp + "\n");
        
    }
});

