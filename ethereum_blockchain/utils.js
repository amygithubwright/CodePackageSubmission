// Setting up initial connection to local ethereum node
//const Tx = require('ethereumjs-tx').Transaction;
const fs = require('fs');

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
const web3 = new Web3(provider);

console.log("Processing transaction... ");

const filepath = "C:/Users/indiv/Documents/ethereum_blockchain";

const password = "";
const keystore = fs.readFileSync(filepath+"/node1/keystore/UTC--2023-02-27T21-26-16.561599200Z--2f1d8f546154b6d0156b4ddab505dcd7cdb68008", 'utf8');
const decryptedAccount = web3.eth.accounts.decrypt(JSON.parse(keystore), password);

var first, second;
const getAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    first = accounts[0];
    second = accounts[1];
    return first, second;
    // ^ https://ethereum.stackexchange.com/questions/34240/web3-eth-accounts-web3-eth-getaccounts-returns-only-the-first-account

};

var rt, th, signOutput, blockHash;
const signTransaction = async () => {

    var rawTx = {
        to: second,
        //to: "0x585ffadd0d1b7f3a167eb0b6fb0348693db2eb1b",
        from: first,
        value: '100000',
        gas: 200000
    }

    

    // signTransaction
    signOutput = await web3.eth.accounts.signTransaction(rawTx, decryptedAccount.privateKey);
    th = signOutput.transactionHash;
    rt = signOutput.rawTransaction;
   
};


signTransaction().then(async () => {

    // sendTransaction
    var t, log;
    web3.eth.sendSignedTransaction(rt).on(
        "receipt", (receipt) => {
            console.log(receipt)
            //console.log("Transaction sent successfully.");
           
            // Store blockHash of sent transaction
            blockHash = receipt.blockHash;
            log = async () => {
                // Get block of sent transaction + timestamp
                t = await web3.eth.getBlock(blockHash);
                // Stores the trnsaction hash with the timestamp when the 'to' address recieved the transaction
                fs.appendFileSync(filepath+"/data/local/timestamps.txt", th+":"+ t.timestamp+"\n");
                
            };
            log().then(async () => {});
            
        }
    )   
       
})

