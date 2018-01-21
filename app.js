// ============================================================================================= //
// Imports and Constant Initializations                                                          //
// ============================================================================================= //

const express = require('express'); // ExpressJs Framework.
const app = express();
const morgan = require('morgan'); // Logger.
const bodyParser = require('body-parser');
// Helps to parses requests more efficiently.
// May not need body-parser as Express comes with a json and urlencoded parser methods:
// https://expressjs.com/en/api.html

const path = require('path');

// Used for CRUD operations with MongoDB.
const mongoose = require('mongoose');
// A third party Promise object; Mongoose's Promise is deprecated.
mongoose.Promise = require('bluebird');

const usersRoutes = require('./api/routes/users');
const contactsRoutes = require('./api/routes/contacts');
// ============================================================================================= //

// ============================================================================================= //
// MongoDB Connection                                                                            //
// ============================================================================================= //

// Connect to Database
const password = process.env.MONGO_ATLAS_PW;
mongoose.connect(
    'mongodb://admin:' + password +
    '@cop4331-small-project-shard-00-00-rpedg.mongodb.net:27017,cop4331-small-project-shard-' +
    '00-01-rpedg.mongodb.net:27017,cop4331-small-project-shard-00-02-rpedg.mongodb.net:27017/' +
    'test?ssl=true&replicaSet=cop4331-small-project-shard-0&authSource=admin'
);
// ============================================================================================= //

// ============================================================================================= //
// Development Tools                                                                             //
// ============================================================================================= //

// Logs developer information, such as: GET / 404 1.761 ms - 34
app.use(morgan('dev'));
// ============================================================================================= //

// ============================================================================================= //
// Server Configuration                                                                          //
// ============================================================================================= //

// Reference: https://www.npmjs.com/package/body-parser
// Parses urlencoded data; extended is set to false to support simple requests.
app.use(bodyParser.urlencoded({extended: false}));
// Parses json data and makes it more manageable.
app.use(bodyParser.json());

// Handling CORS.
app.use(function(req, res, next) {
    // Allows accepts to any client; hence '*'
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Let's the browser know which HTTP methods the server allows.
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    // Must route requests by calling next(), otherwise all requests will be blocked.
    next();
});
// ============================================================================================= //

// ============================================================================================= //
// Route Handling                                                                                //
// ============================================================================================= //
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.render('index');
});


app.use('/users', usersRoutes);
app.use('/contacts', contactsRoutes);

// Handles requests sent to invalid APIs.
app.use(function(req, res, next) {
    const error = new Error('Not found.');
    error.status = 404;
    next(error);
});

// Catches all thrown errors.
app.use(function(error, req, res, next) {
    res.status(error.status || 500); // either return error code from thrown exception or 500.
    res.json({
        error: {
            message: error.message
        }
    });
});
// ============================================================================================= //

module.exports = app;