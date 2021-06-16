const mongoose = require('mongoose');
const { connectionString } = require('../config/config');

//mongodb connection
mongoose
    .connect(
        connectionString,

        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log('Database Connection is ready');
    })
    .catch((e) => {
        console.log(e);
    });
