const { readFileSync } = require('fs');
const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400;
const height = 400;
const backgroundColour = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });


var filepath = "C:/Users/indiv/Documents/ethereum_blockchain/";

var fr = [];
var initial = [];
var frTx = [];
var iTx = [];
var frontrunners;
var frTotal = 0;
var totalTx = 0;
var allArr = [];

let loadTransactions = () => {
    // Reads data from transactions.json
    let transactions = JSON.parse(readFileSync('C:/Users/indiv/Documents/ethereum_blockchain/data/transactions.json'));

    for (var i = 0; i < transactions.transactions.length; i++) {
        if (transactions.transactions[i].hash != undefined) {
            if (allArr.indexOf(transactions.transactions[i].hash) === -1) {
                allArr.push(transactions.transactions[i].hash);
                totalTx += 1;
            }
        }
    }
}
loadTransactions();

let loadFrontrunning = () => {


    // Reads data from FrontrunningData.json
    frontrunners = JSON.parse(readFileSync(filepath + 'data/FrontrunningData.json'));

    for (var f = 0; f < frontrunners.length; f++) {
        // Get hashes and addresses of frontrunning transactions
        if (fr.indexOf(frontrunners[f].FrontRunner.hash) === -1) {
            fr.push(frontrunners[f].FrontRunner.hash);
            frTx.push({
                txHash: frontrunners[f].FrontRunner.hash,
                address: frontrunners[f].FrontRunner.address
            });
            frTotal += 1;
        }

        // Get hashes of transactions that are frontrun
        if (initial.indexOf(frontrunners[f].InitialTransaction.hash) === -1) {
            initial.push(frontrunners[f].InitialTransaction.hash);
            iTx.push({
                txHash: frontrunners[f].InitialTransaction.hash
            });
        }
    }

    // Write the frontrunning transactions to a JSON file
    fs.writeFile(filepath + 'data/FrontrunningTransactions.json', JSON.stringify(frTx), (error) => {
        if (error) {
            console.error(error);
        }
    });

    
    // Write the transactions that have been frontrun to a JSON file
    fs.writeFile(filepath + 'data/FrontrunTransactions.json', JSON.stringify(iTx), (error) => {
        if (error) {
            console.error(error);
        }
    });
    
    //console.log("Number of frontrunning transactions detected:", frTotal);
    

}

loadFrontrunning();


var iArr = [];
var i = 0;
var insertion = [];
// Detecting insertion attacks from the pool of frontrunning attacks detected
let detectInsertion = () => {

    for (var elem = 0; elem < frontrunners.length; elem++) {
        for (var data = elem + 1; data < frontrunners.length; data++) {
            if (frontrunners[elem].InitialTransaction.hash == frontrunners[data].InitialTransaction.hash && frontrunners[elem].FrontRunner.from == frontrunners[data].FrontRunner.from && frontrunners[elem].FrontRunner.hash != frontrunners[data].FrontRunner.hash && ((frontrunners[elem].FrontRunner.gasPrice < frontrunners[elem].InitialTransaction.gasPrice && frontrunners[data].FrontRunner.gasPrice > frontrunners[data].InitialTransaction.gasPrice) || (frontrunners[elem].FrontRunner.gasPrice > frontrunners[elem].InitialTransaction.gasPrice && frontrunners[data].FrontRunner.gasPrice < frontrunners[data].InitialTransaction.gasPrice))) {

                if (iArr.indexOf(frontrunners[elem].FrontRunner.hash) === -1) {
                    iArr.push(frontrunners[elem].FrontRunner.hash);
                    iArr.push(frontrunners[data].FrontRunner.hash);
                    i += 1;
                    insertion.push({
                        txHashLower: frontrunners[elem].FrontRunner.hash,
                        txHashHigher: frontrunners[data].FrontRunner.hash,
                        address: frontrunners[f].FrontRunner.from
                    });
                }

            }
        }
    }

    // Write the insertion frontrunning transaction data to a JSON file
    fs.writeFile(filepath + 'data/InsertionTransactions.json', JSON.stringify(insertion), (error) => {
        if (error) {
            console.error(error);
        }
    });

    //console.log("i", i);
    
    return i, iArr;

}

detectInsertion();



// Detecting suppression attacks from the pool of frontrunning attacks detected
var suppression = [];
var s = 0;
var sArr = [];
let detectSuppression = () => {

    for (var elem = 0; elem < frontrunners.length; elem++) {
        for (var data = elem + 1; data < frontrunners.length; data++) {
            if (frontrunners[elem].FrontRunner.gasPrice > frontrunners[elem].InitialTransaction.gasPrice && frontrunners[data].FrontRunner.gasPrice > frontrunners[data].InitialTransaction.gasPrice && frontrunners[elem].InitialTransaction.hash == frontrunners[data].InitialTransaction.hash && frontrunners[elem].FrontRunner.from == frontrunners[data].FrontRunner.from && frontrunners[elem].FrontRunner.hash != frontrunners[data].FrontRunner.hash) {
                
                if (sArr.indexOf(frontrunners[elem].FrontRunner.hash) === -1 && iArr.indexOf(frontrunners[elem].FrontRunner.hash) === -1) {
                    sArr.push(frontrunners[elem].FrontRunner.hash);
                    sArr.push(frontrunners[data].FrontRunner.hash);
                    s += 1;
                    suppression.push({
                        // hashes of suppression frontrunning transactions
                        txHash1: frontrunners[elem].FrontRunner.hash,
                        txHash2: frontrunners[data].FrontRunner.hash,
                        // address sending suppression frontrunning transactions
                        address: frontrunners[elem].FrontRunner.from
                    });

                }
            }
        }
    }

    // Write the suppression frontrunning transaction data to a JSON file
    fs.writeFile(filepath + 'data/SuppressionTransactions.json', JSON.stringify(suppression), (error) => {
        if (error) {
            console.error(error);
        }
    });

    //console.log("s", s);

    return s, sArr;

}

detectSuppression();



// Detecting displacement attacks from the pool of frontrunning attacks detected
var d = 0;
var dArr = [];
var displacement = [];
let detectDisplacement = () => {

    for (var f = 0; f < frontrunners.length; f++) {
        if (frontrunners[f].FrontRunner.gasPrice > frontrunners[f].InitialTransaction.gasPrice) {
            
            if (dArr.indexOf(frontrunners[f].FrontRunner.hash) === -1 && sArr.indexOf(frontrunners[f].FrontRunner.hash) === -1 && iArr.indexOf(frontrunners[f].FrontRunner.hash) === -1) {
                dArr.push(frontrunners[f].FrontRunner.hash);
                d += 1;
                displacement.push({
                    txHash: frontrunners[f].FrontRunner.hash,
                    address: frontrunners[f].FrontRunner.from
                });
            }
        }
    }

    // Write the displacement frontrunning transaction data to a JSON file
    fs.writeFile(filepath + 'data/DisplacementTransactions.json', JSON.stringify(displacement), (error) => {
        if (error) {
            console.error(error);
        }
    });


    //console.log("d", d);

    return d;
}

detectDisplacement();


var mevTotal = 0;
let drawBar = () => {

    mevTotal = ((frTotal - 0) - (d - 0) + (i - 0) + (s - 0));

    // Draw bar chart of different types of frontrunning attacks
    // displacement/insertion/suppression
    const frTypes = {
        type: 'bar',
        data: {
            labels: ['Displacement: '+d, 'Insertion: '+i, 'Suppression: '+s],
            datasets: [{
                barPercentage: 0.5,
                barThickness: 70,
                data: [d, i, s],
                fill: true,
                borderWidth: 5,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(60, 235, 54)'
                ]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: "Types of Frontrunning Attacks",
                    font: {
                        size: 22
                    }
                }
            }
        }
    };

    async function runfrTypes() {
        const frTypesUrl = await chartJSNodeCanvas.renderToDataURL(frTypes);
        const base64Image = frTypesUrl;
        var base64Data = base64Image.toString().replace(/^data:image\/png;base64,/, "");
        fs.writeFile("AnalysisDiagrams/typesOfFrontrunningAttack.png", base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        return frTypesUrl;
    }
    runfrTypes();



    // Draw bar chart of different types of frontrunning attacks
    // displacement/insertion/suppression/MEV
    const frMEV = {
        type: 'bar',
        data: {
            labels: ['Displacement: ' + d, 'Insertion: ' + i, 'Suppression: ' + s, 'MEV: '+mevTotal],
            datasets: [{
                barPercentage: 0.5,
                barThickness: 70,
                data: [d, i, s, mevTotal],
                fill: true,
                borderWidth: 5,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(60, 235, 54)',
                    'rgb(196, 96, 20)'
                ]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: "Types of Frontrunning Attacks including MEV",
                    font: {
                        size: 22
                    }
                }
            }
        }
    };

    async function runfrMEV() {
        const frMEVUrl = await chartJSNodeCanvas.renderToDataURL(frMEV);
        const base64Image = frMEVUrl;
        var base64Data = base64Image.toString().replace(/^data:image\/png;base64,/, "");
        fs.writeFile("AnalysisDiagrams/typesOfFrontrunningMEV.png", base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        return frMEVUrl;
    }
    runfrMEV();



    // Draw bar chart of all types of transactions
    // honest/frontrun/frontrunning
    const allTx = {
        type: 'bar',
        data: {
            labels: ['Honest: ' + ((totalTx-0)-(initial.length-0)-(frTotal-0)), 'Frontrun: ' + initial.length, 'Frontrunning: ' + frTotal],
            datasets: [{
                barPercentage: 0.5,
                barThickness: 70,
                data: [((totalTx - 0) - (initial.length - 0) - (frTotal - 0)), initial.length, frTotal],
                fill: true,
                borderWidth: 5,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(60, 235, 54)'
                ]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: "All types of transactions",
                    font: {
                        size: 22
                    }
                }
            }
        }
    };

    async function runallTx() {
        const allTxUrl = await chartJSNodeCanvas.renderToDataURL(allTx);
        const base64Image = allTxUrl;
        var base64Data = base64Image.toString().replace(/^data:image\/png;base64,/, "");
        fs.writeFile("AnalysisDiagrams/allTransactions.png", base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        return allTxUrl;
    }
    runallTx();



}

drawBar();

let frAnalysis = () => {

    // Finding transactions that are not added to block
    // but don't have previously submitted pending transactions
    // that are frontrunning transactions

    var aCount = 0;
    // Reads data from notPreviouslyPending.json
    let = prev = JSON.parse(readFileSync(filepath + 'data/analysis/notPreviouslyPending.json'));

    for (var each = 0; each < frontrunners.length; each++) {
        for (var e = 0; e < prev.length; e++) {
            if (prev[e].txHash == frontrunners[each].InitialTransaction.hash) {
                aCount += 1;
            }
        }
    }

    //console.log("aCount:", aCount);
    // 12 found
}

frAnalysis();



let frItselfAnalysis = () => {

    // Looks for frontrunning transactions that get frontrun

    var it = 0;

    for (var elem = 0; elem < frontrunners.length; elem++) {
        for (var data = elem+1; data < frontrunners.length; data++) {
            if (frontrunners[elem].InitialTransaction.hash == frontrunners[data].FrontRunner.hash) {
                it += 1;
            }
        }
    }

    //console.log(it);
    // 0 found

}

frItselfAnalysis();


let gasLimitAnalysis = () => {

    // Comparing gasLimit of initial transactions with
    // gasLimit of frontrunning transactions

    var glLess = 0;
    var glGreater = 0;
    var glEqual = 0;
    var total = 0
    var txToGas = 0;

    for (var elem = 0; elem < frontrunners.length; elem++) {
        if (frontrunners[elem].FrontRunner.gasLimit < frontrunners[elem].InitialTransaction.gasLimit) {
                glLess += 1;
        }
        else if (frontrunners[elem].FrontRunner.gasLimit > frontrunners[elem].InitialTransaction.gasLimit) {
            glGreater += 1;
            for (var run = 0; run < initial.length; run++) {
                if (initial[run] == frontrunners[elem].InitialTransaction.hash) {
                    txToGas += 1;
                    // every transaction that frontruns another, 
                    // pays a higher gasLimit
                }
            }
        } 
        else {
            glEqual += 1;
        }
    }
    total = ((glLess - 0) + (glEqual - 0) + (glGreater - 0));

    //console.log("txToGas:", txToGas);




    // Draw bar chart of frontrunning transaction gasLimits 
    // compared to initial transaction gasLimits
    const gasLimits = {
        type: 'bar',
        data: {
            labels: ['Less than:  ' + ((glLess / total) * 100).toFixed(2) + "%", 'Equal to:  ' + ((glEqual / total) * 100).toFixed(2) + "%", 'Greater than:  ' + ((glGreater / total) * 100).toFixed(2) + "%"],
            datasets: [{
                barPercentage: 0.5,
                barThickness: 70,
                data: [((glLess / total) * 100).toFixed(2), ((glEqual / total) * 100).toFixed(2), ((glGreater / total) * 100).toFixed(2)],
                fill: true,
                borderWidth: 5,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(60, 235, 54)'
                ]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: "Gas limit of frontrunning transactions\ncompared to gas limit of initial transactions",
                    font: {
                        size: 22
                    }
                }
            }
        }
    };

    async function rungasLimits() {
        const gasLimitsUrl = await chartJSNodeCanvas.renderToDataURL(gasLimits);
        const base64Image = gasLimitsUrl;
        var base64Data = base64Image.toString().replace(/^data:image\/png;base64,/, "");
        fs.writeFile("AnalysisDiagrams/gasLimits.png", base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        return gasLimitsUrl;
    }
    rungasLimits();

}

gasLimitAnalysis();




