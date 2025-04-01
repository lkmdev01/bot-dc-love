const express = require('express');
const server = express();

server.all('/', (req, res) => {
    res.send('Bot está rodando!');
});

function keepAlive() {
    server.listen(3000, () => {
        console.log('Servidor está pronto!');
    });
}

module.exports = { keepAlive };
