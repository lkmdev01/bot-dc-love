const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Bot Discord está rodando',
        timestamp: new Date().toISOString()
    });
});

app.get('/ping', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

module.exports = app;
