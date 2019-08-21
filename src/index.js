//Modules Required
const express = require('express');
const morgan = require('morgan');
const path = require('path');

//Initializations
const app = express();

//Settings
app.set('port',process.env.PORT || 4000);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Global Variables
app.use((req, res, next ) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
})

//Routes
app.use('/categorias', require('./routes/categorias'));
app.use('/products', require('./routes/products'));
app.use('/uploads', require('./routes/uploads'));

//Public
app.use(express.static(path.join(__dirname, 'public')));


//Starting Server
app.listen(app.get('port'), ( ) => {
    console.log('Server on port', app.get('port'));
});