const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('./db/mongoose');

const categoryRouter = require('./routers/category');

//middleware
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('/api/categories', categoryRouter);

app.get('/', (req, res) => {
    res.send('Welcom to Mini e-commerce API');
});

//port
const port = process.env.PORT || 1000;

app.listen(port, () => {
    console.log(`Server is up and running on localhost ${port}.`);
});
