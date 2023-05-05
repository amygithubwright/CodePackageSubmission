// Retrieve gas and gas price from transactions.json
// https://stackoverflow.com/questions/49221446/search-in-json-file-with-node-js
const { readFileSync } = require('fs');
const fs = require('fs');

var filepath = "C:/Users/indiv/Documents/ethereum_blockchain/";

// https://www.npmjs.com/package/chartjs-node-canvas
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400;
const height = 400;
const backgroundColour = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

var trueFee = [];
var falseFee = [];
var gasArray = [];
var gasPriceArray = [];
var hashArray = [];
var transactionInBlock = [];
var previous = [];

let loadTransactions = () => {
    // Reads data from transactions.json
    let transactions = JSON.parse(readFileSync('C:/Users/indiv/Documents/ethereum_blockchain/data/transactions.json'));
    // Reads data from blockList.json
    let blocks = JSON.parse(readFileSync('C:/Users/indiv/Documents/ethereum_blockchain/data/blockList.json'));

    // Gets gas, gasPrice and hash from each element in json file and adds them to arrays
    try {
        for (var i = 0; i < transactions.transactions.length; i++) {
            if (transactions.transactions[i].gas != undefined) {
                // Store values of unique transactions
                if (hashArray.indexOf(transactions.transactions[i].hash) === -1) {
                    hashArray.push(transactions.transactions[i].hash);
                    gasArray.push(transactions.transactions[i].gas);
                    gasPriceArray.push(transactions.transactions[i].gasPrice);
                    
                }
            } 
        }

    } catch (err) {
        console.log(err);
    }


    var transactionCost = 13300000000;
    // Separates transactions into paying and not paying gas * gasPrice
    for (var g = 0; g < gasArray.length; g++) {

        if (gasPriceArray[g] >= transactionCost) {
            trueFee.push({ key: hashArray[g], value: gasPriceArray[g] });
        } else {
            falseFee.push({ key: hashArray[g], value: gasPriceArray[g] });
        }

    }


    // Looks through array of each transaction paying gas * gasPrice
    //console.log(truePay.length, "out of", hashArray.length, "transactions pay gas*gasPrice.");
    //console.log("Percentage:", ((truePay.length / hashArray.length) * 100).toFixed(2), "%");
    // https://stackoverflow.com/questions/41137460/how-to-get-percentage-with-2-decimals-in-javascript


    // Write hashes and gas prices of transactions paying high enough gas price
    var gasPrices = [];
    for (var p = 0; p < trueFee.length; p++) {
        gasPrices.push({
            txHash: trueFee[p].key,
            gasPrice: trueFee[p].value
        });
    }
    // Write the gasPrices array to a JSON file
    fs.writeFile(filepath + 'data/analysis/gasPrices.json', JSON.stringify(gasPrices), (error) => {
        if (error) {
            console.error(error);
        }
    });

    // Draw pie chart of transactions paying gas price of 13300000000
    const transactionFee = {
        type: 'pie',
        data: {
            labels: ['Greater than or equal to:  ' + trueFee.length, 'Less than:  ' + falseFee.length],
            datasets: [{
                data: [trueFee.length, falseFee.length],
                fill: true,
                borderWidth: 5,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'
                ]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Paying gasPrice: ~13300000000",
                    font: {
                        size: 22                    }
                }
            }
        }
    };

    async function runFee() {
        const transactionFeeUrl = await chartJSNodeCanvas.renderToDataURL(transactionFee);
        const base64Image = transactionFeeUrl;
        var base64Data = base64Image.toString().replace(/^data:image\/png;base64,/, "");
        fs.writeFile("AnalysisDiagrams/transactionFee.png", base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        return transactionFeeUrl;
    }
    runFee();



    // Find transactions added to block
    for (var b in hashArray) {
        for (var i = 0; i < blocks.length; i++) {
            if (hashArray[b] == blocks[i].txHash) {
                if (blocks[i].blockNumber != "pending") {
                    // Ensure no duplicate hashes are added to array
                    transactionInBlock.indexOf(blocks[i].txHash) === -1 ? transactionInBlock.push(blocks[i].txHash) : console.log;
                    // https://stackoverflow.com/questions/1988349/array-push-if-does-not-exist
                    
                } 
            } 
           
        }
    }
        

    // Prints how many transactions were added to blocks out of the total number of transactions
    //console.log(transactionInBlock.length, "out of", hashArray.length, "transactions added to blocks.");

    // Write hashes of transactions added to block
    var added = [];
    for (var p = 0; p < transactionInBlock.length; p++) {
        added.push({
            txHash: transactionInBlock[p]
        });
    }
    // Write the added array to a JSON file
    fs.writeFile(filepath + 'data/analysis/addedToBlock.json', JSON.stringify(added), (error) => {
        if (error) {
            console.error(error);
        }
    });

    // Draw pie chart of transactions added to block
    const addedToBlock = {
        type: 'pie',
        data: {
            labels: ['Added:  ' + transactionInBlock.length, 'Not added:  ' + (hashArray.length - transactionInBlock.length)],
            datasets: [{
                data: [transactionInBlock.length, (hashArray.length - transactionInBlock.length)],
                fill: true,
                borderWidth: 5,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'
                ]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Transactions added to block",
                    font: {
                        size: 24
                    }
                }
            }
        }
    };

    async function runAdded() {
        const addedToBlockUrl = await chartJSNodeCanvas.renderToDataURL(addedToBlock);
        const base64Image = addedToBlockUrl;
        var base64Data = base64Image.toString().replace(/^data:image\/png;base64,/, "");
        fs.writeFile("AnalysisDiagrams/addedToBlock.png", base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        return addedToBlockUrl;
    }
    runAdded();

    // Counts number of transactions that pay high enough gas price
    // for high enough transaction fee
    // that are added to block/not added to block
    var addedArr = [];
    var notAddedArr = [];
    var addedPay = 0;
    var addedNoPay = 0;
    for (var i = 0; i < trueFee.length; i++) {
        if (transactionInBlock.indexOf(trueFee[i].key) !== -1) {
            addedPay += 1;
            addedArr.push(trueFee[i].key);
        } else {
            addedNoPay += 1;
            notAddedArr.push(trueFee[i].key);
        }
    }


    // Write hashes of transactions added to block that pay high enough gas price
    var addedGasPrice = [];
    for (var p = 0; p < addedArr.length; p++) {
        addedGasPrice.push({
            txHash: addedArr[p]
        });
    }
    // Write the addedGasPrice array to a JSON file
    fs.writeFile(filepath + 'data/analysis/addedToBlockPay.json', JSON.stringify(addedGasPrice), (error) => {
        if (error) {
            console.error(error);
        }
    });

    // Write hashes of transactions not added to block that pay high enough gas price
    var notAddedGasPrice = [];
    for (var p = 0; p < notAddedArr.length; p++) {
        notAddedGasPrice.push({
            txHash: notAddedArr[p]
        });
    }
    // Write the notAddedGasPrice array to a JSON file
    fs.writeFile(filepath + 'data/analysis/notAddedToBlockPay.json', JSON.stringify(notAddedGasPrice), (error) => {
        if (error) {
            console.error(error);
        }
    });

    // Draw pie chart of transactions added/not added to block that pay high enough gas price
    const addedToBlockPay = {
        type: 'pie',
        data: {
            labels: ['Added:  ' + addedPay, 'Not added:  ' + addedNoPay],
            datasets: [{
                data: [addedPay, addedNoPay],
                fill: true,
                borderWidth: 5,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'
                ]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Transactions paying high enough gas price \n that are added/not added to block",
                    font: {
                        size: 20
                    },
                    layout: {
                        padding: 20
                    }
                }
            }
        }
    };

    async function runAddedToBlockPay() {
        const addedToBlockPayUrl = await chartJSNodeCanvas.renderToDataURL(addedToBlockPay);
        const base64Image = addedToBlockPayUrl;
        var base64Data = base64Image.toString().replace(/^data:image\/png;base64,/, "");
        fs.writeFile("AnalysisDiagrams/addedToBlockPay.png", base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        return addedToBlockPayUrl;
    }
    runAddedToBlockPay();



    // Find transactions that pay high enough gas price, but are not added to block
    // (162 out of 830 transactions) 
    // because previously submitted transaction is pending from same address
    for (var i = 0; i < trueFee.length; i++) {
        if (transactionInBlock.indexOf(trueFee[i].key) === -1) {
            
            for (var addedT = 0; addedT < transactions.transactions.length; addedT++) {
                if (trueFee[i].key == transactions.transactions[addedT].hash) {
                    
                    var from = transactions.transactions[addedT].from;
                    
                    var timestamp = transactions.transactions[addedT].timestamp;
              
                    for (var t = 0; t < transactions.transactions.length; t++) {
                        if (transactions.transactions[t].hash != undefined && transactions.transactions[t].hash != trueFee[i].key) {
                           if (transactions.transactions[t].from == from && transactions.transactions[t].timestamp < timestamp) {
                                if (previous.indexOf(trueFee[i].key) === -1) {
                                    previous.push(trueFee[i].key);
                                   
                                }
                                
                            } 
                        }
                    }
                    break;

                }
            }

        }
        
    }
    
    
    // Write hashes of transactions not added to block
    // that pay high enough gas price
    // because of previously submitted pending transaction
    var previousArr = [];
    for (var p = 0; p < previous.length; p++) {
        previousArr.push({
            txHash: previous[p]
        });
    }
    // Write the previousArr array to a JSON file
    fs.writeFile(filepath + 'data/analysis/previouslyPending.json', JSON.stringify(previousArr), (error) => {
        if (error) {
            console.error(error);
        }
    });

    var notPrevious = [];
    var notPreviousArr = [];
    for (each in trueFee) {
        if (previous.indexOf(trueFee[each].key) === -1 && transactionInBlock.indexOf(trueFee[each].key) === -1) {
            notPrevious.push(trueFee[each].key);
        }
    }
    for (var p = 0; p < notPrevious.length; p++) {
        notPreviousArr.push({
            txHash: notPrevious[p]
        });
    }
    // Write the previousArr array to a JSON file
    fs.writeFile(filepath + 'data/analysis/notPreviouslyPending.json', JSON.stringify(notPreviousArr), (error) => {
        if (error) {
            console.error(error);
        }
    });


    // Draw pie chart of transactions paying high enough gas price
    // but not added to block due to previously submitedd pending transactions
    const previouslyPending = {
        type: 'pie',
        data: {
            labels: ['Yes:  ' + previous.length, 'No:  ' + notPrevious.length],
            datasets: [{
                data: [previous.length, notPrevious.length],
                fill: true,
                borderWidth: 5,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'
                ]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Transactions not added due to previously pending transactions",
                    font: {
                        size: 20
                    },
                    layout: {
                        padding: 20
                    }
                }
            }
        }
    };

    async function runpreviouslyPending() {
        const previouslyPendingUrl = await chartJSNodeCanvas.renderToDataURL(previouslyPending);
        const base64Image = previouslyPendingUrl;
        var base64Data = base64Image.toString().replace(/^data:image\/png;base64,/, "");
        fs.writeFile("AnalysisDiagrams/previouslyPending.png", base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        return previouslyPendingUrl;
    }
    runpreviouslyPending();


}


loadTransactions();