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