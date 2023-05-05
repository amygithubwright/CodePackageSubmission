# IndividualProject2023

## PREREQUISTITES FOR THIS PROJECT

Geth is downloaded and installed:
https://geth.ethereum.org/downloads

Node.js is downloaded and installed:
https://nodejs.org/en/download

NPM package installations:
- 'npm install web3'
- 'npm install fs'
- 'npm install chartjs-node-canvas'

## pending.js : To get pending transactions (in local blockchain)
1. Run geth in a terminal with command: 'geth --datadir node1 --networkid 1234 --http --ws --allow-insecure-unlock --nodiscover'
2. Set variable 'filepath' to local filepath for ethereum_blockchain on line 7
3. In another terminal, run 'node pending.js' to run the pending module
4. Once a transaction is then submitted, pending.js will detect pending transactions

## utils.js : To sign and send transactions (in local blockchain)
1. Run geth in a terminal with command: 'geth --datadir node1 --networkid 1234 --http --ws --allow-insecure-unlock --nodiscover'
2. In another terminal, run geth node with command: geth attach ipc:\\.\pipe\geth.ipc
3. In geth node run 'eth.accounts' to get first account address
4. Run 'miner.setEtherbase("first_account_address")'
5. Run 'miner.start()' to start mining from the first account address
6. Set variable 'filepath' to local filepath for ethereum_blockchain on line 11
7. In another terminal, run 'node utils.js' to run the utils module


## analysis.js : To perform simple analysis on dataset
1. Set variable 'filepath' to local filepath for ethereum_blockchain on line 6
2. In a terminal, run 'node analysis.js' to run code

## frontrunning_analysis.js : To detect frontrunning transactions
1. Set variable 'filepath' to local filepath for ethereum_blockchain on line 9
2. In a terminal, run 'node frontrunning_analysis.js' to run code

## frontrunning_types.js : To detect types of frontrunning transactions
1. Set variable 'filepath' to local filepath for ethereum_blockchain on line 11
2. In a terminal, run 'node frontrunning_types.js' to run code

## estimating_losses.js :  To calculate losses caused by frontrunning attacks
1. Set variable 'filepath' to local filepath for ethereum_blockchain on line 5
2. In a terminal, run 'node estimating_losses.js' to run code

## Code written by me:
- ethereum_blockchain/utils.js 
- ethereum_blockchain/pending.js 
- ethereum_blockchain/analysis.js 
- ethereum_blockchain/frontrunning_analysis.js 
- ethereum_blockchain/frontrunning_types.js 
- ethereum_blockchain/estimating_losses.js 
- ethereum_blockchain/genesis.json

## Code not written by me, but necessary for project to run (dataset)
- ethereum_blockchain/data/blockList.json 
- ethereum_blockchain/data/transactions.json 

## Files produced from code written by me:
- ethereum_blockchain/node1/ 
- ethereum_blockchain/node2/ 
- ethereum_blockchain/AnalysisDiagrams/ 
- ethereum_blockchain/data/analysis/ 
- ethereum_blockchain/data/local/ 
- ethereum_blockchain/data/DisplacementTransactions.json 
- ethereum_blockchain/data/FrontrunTransactions.json 
- ethereum_blockchain/data/FrontrunningData.json 
- ethereum_blockchain/data/FrontrunningTransactions.json 
- ethereum_blockchain/data/InsertionTransaction.json 
- ethereum_blockchain/data/Losses.json 
- ethereum_blockchain/data/SuppressionTransactions.json 

