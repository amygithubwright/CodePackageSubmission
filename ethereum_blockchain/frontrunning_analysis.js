const { readFileSync } = require('fs');
const fs = require('fs');

var block_hash, block_number;
var block_dict = [];
var frontrunning = [];
var frontrunningCheck = [];

var filepath = "C:/Users/indiv/Documents/ethereum_blockchain/";



let loadTransactions = () => {
    // Reads data from transactions.json
    let transactions = JSON.parse(readFileSync(filepath + 'data/transactions.json')); 
    // Reads data from blockList.json
    let blocks = JSON.parse(readFileSync(filepath + 'data/blockList.json'));
    
    var t = 0;
    for (var b = 0; b < blocks.length; b++) {
        block_dict.push({ key: b, value: blocks[b].txHash });            
    }
    

    try {

        // Detect transactions added to block first that were
        // submitted to mempool after another transaction
        for (var b = 0; b < blocks.length; b++) {

            // Set position of transaction in blockList
            block_hash = blocks[b].txHash;
            block_number = blocks[b].blockNumber;

            // only considers transactions that have been added to block, as frontrunning transactions
            if (block_number != "pending") { 

                for (var addedT = 0; addedT < transactions.transactions.length; addedT++) {
                     
                    if (transactions.transactions[addedT].hash != undefined && transactions.transactions[addedT].hash == block_hash) {
                        var from = transactions.transactions[addedT].from;
                        var to = transactions.transactions[addedT].to;
                        var gas = transactions.transactions[addedT].gas;
                        var gasPrice = transactions.transactions[addedT].gasPrice;
                        var timestamp = transactions.transactions[addedT].timestamp;
                        
                        for (var t = 0; t < transactions.transactions.length; t++) {
                            if (transactions.transactions[t].to != undefined) {


                                if (transactions.transactions[t].from != from && transactions.transactions[t].to == to && transactions.transactions[t].timestamp < timestamp) {

                                    for (var bh = 0; bh < blocks.length; bh++) {

                                        if (transactions.transactions[t].hash == blocks[bh].txHash && block_dict[bh].key > block_dict[b].key && (blocks[bh].blockNumber >= block_number || blocks[bh].blockNumber == "pending" )) {
                                            // https://stackoverflow.com/questions/7790811/how-do-i-put-variables-inside-javascript-strings
                                            var items = `Initial transaction(s) hash: ${transactions.transactions[t].hash} mempoolTimestamp: ${transactions.transactions[t].timestamp} gasPrice: ${transactions.transactions[t].gasPrice} blockNumber ${blocks[bh].blockNumber} position: ${bh} front runner(s) hash: ${block_hash} mempoolTimestamp: ${timestamp} gasPrice: ${gasPrice} blockNumber: ${block_number} position: ${b}`;

                                            if (frontrunningCheck.indexOf(items) === -1) {
                                                frontrunningCheck.push(items);
                                                frontrunning.push({
                                                    InitialTransaction: {
                                                        hash: transactions.transactions[t].hash,
                                                        //to: transactions.transactions[t].to,
                                                        mempoolTimestamp: transactions.transactions[t].timestamp,
                                                        gasLimit: transactions.transactions[t].gas,
                                                        gasPrice: transactions.transactions[t].gasPrice,
                                                        blockNumber: blocks[bh].blockNumber,
                                                        postion: bh,
                                                    },
                                                    FrontRunner: {
                                                        hash: block_hash,
                                                        //to: to,
                                                        from: from,
                                                        mempoolTimestamp: timestamp,
                                                        gasLimit: gas,
                                                        gasPrice: gasPrice,
                                                        blockNumber: block_number,
                                                        position: b
                                                    }
                                                });
                                            }
                                            
                                        }
                                            

                                    }
                                    break;

                                }
                            }
                        }
                        break;

                    }
                }
            }
            
        }


        // Write the frontrunning transaction data to a JSON file
        fs.writeFile(filepath +'data/FrontrunningData.json', JSON.stringify(frontrunning), (error) => {
            if (error) {
                console.error(error);
            }
        });


    } catch (err) {
        console.log(err);
    }


}


loadTransactions();