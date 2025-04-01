const express = require('express');
const server = express();

server.get('/', (req, res) => {
    res.send('Bot está online!');
});

server.get('/ping', (req, res) => {
    res.status(200).send('OK');
});

function keepAlive() {
    server.listen(3000);
}

module.exports = { keepAlive };
