const ganache = require("ganache-cli");


const port = 9545;

function init() {
    const server = ganache.server({
        fork: 'http://localhost:8545'
    });


    server.listen(port, function (err, blockchain) {
        console.error(err);
        console.log(blockchain);
    });
}

setInterval(init, 15000);

