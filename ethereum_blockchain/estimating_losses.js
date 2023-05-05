var Web3 = require('web3');
const { readFileSync } = require('fs');
const fs = require('fs');

var filepath = "C:/Users/indiv/Documents/ethereum_blockchain/";

// Reads data from FrontrunningTransactions.json
frontrunners = JSON.parse(readFileSync(filepath + 'data/FrontrunTransactions.json'));

// Reads data from transactions.json
transactions = JSON.parse(readFileSync(filepath + 'data/transactions.json'));

var value = 0;
var valueEth = 0;
var lossesDict = [];
var lossesTotal = 0;
var lossesArr = [];

// Calculates losses of each frontrunning transaction
// Appends transaction hash and loss (in ETH) from transaction to file
for (var fr = 0; fr < frontrunners.length; fr++) {
    for (var tx = 0; tx < transactions.transactions.length; tx++) {
        if (transactions.transactions[tx].hash  != undefined && frontrunners[fr].txHash == transactions.transactions[tx].hash) {
            value = transactions.transactions[tx].value;
            valueEth = Web3.utils.fromWei(value.toString(), 'ether');
            lossesDict.push({ key: transactions.transactions[tx].hash, value: valueEth });
            lossesTotal = ((lossesTotal - 0) + (value - 0));
            // ^ https://stackoverflow.com/questions/14108222/im-using-node-js-and-im-trying-to-add-two-integers-however-they-just-put-th
        }
    }
}

for (l in lossesDict) {
    lossesArr.push({
        txHash: lossesDict[l].key,
        loss: lossesDict[l].value + " ETH"
    });
}

// Write the losses of transactions to a JSON file
fs.writeFile(filepath + 'data/Losses.json', JSON.stringify(lossesArr), (error) => {
    if (error) {
        console.error(error);
    }
});

console.log(lossesTotal, "wei");
var eth = Web3.utils.fromWei(lossesTotal.toString(), 'ether');
console.log(eth, "eth");