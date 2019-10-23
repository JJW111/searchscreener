'use strict';

const express = require('express');

const app = express();

const backup = require('./router/backup');


app.use('/backup', backup);


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
