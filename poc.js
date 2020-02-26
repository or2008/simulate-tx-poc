const ganache = require("ganache-core");
const Web3 = require("web3");

const web3 = new Web3();
const web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/5493e1dfd6644fdc8afdbcc9b12bbc95'));
// const web3ws = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'));

async function init() {
    web3.setProvider(ganache.provider({
        // fork: 'http://localhost:8545'
        // 0xc1f7b809a59a1d8fa9eb25a0f72f5f3cf42f7fd5
        fork: 'https://mainnet.infura.io/v3/db9140e125cd4799929cb6bfe5d9a9be'
    }));

    const blockNumber = await web3.eth.getBlockNumber();
    console.log(blockNumber);

    const accounts = await web3.eth.getAccounts();

}

async function isContract(address) {
    const code = await web3.eth.getCode(address);
    console.log(`is ${address} Contract?`, code);

    return !code.startsWith('0x');
}

web3ws.eth.subscribe('pendingTransactions', async (error, txHash) => {
    if (error) throw error;
    // console.log('pendingTx', txHash);

    const tx = await web3.eth.getTransaction(txHash).catch();
    if (!tx || !tx.to) return;
    console.log('tx', tx);

    const isSmartContract = await isContract(tx.to);
    if (!isSmartContract) return;

    callSubsctibers(tx);
});

// web3ws.eth.subscribe('pendingTransactions', () => {

//     const tx = await web3.eth.getTransaction('0xd233fd6b4a7b9c456dc6fd727cea1fb73b59e06c6a72acb21413f21b020df11e');

//     web3.eth.sendTransaction(tx).on('receipt', console.log);
// });


init();
setInterval(() => {
    init();
}, 1000);