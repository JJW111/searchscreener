'use strict';

const express = require('express');

const app = express();

const fin = require('./router/fin');

app.use('/update', fin);



app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
});



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
});
