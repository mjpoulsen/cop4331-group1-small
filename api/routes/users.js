// TODO support editing profile.
// TODO decide whether or not to delete a user.

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

/* GET Request. */
router.get('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling GET requests for /users'
    });
});

/* GET Login Request. */
/*
    JSON Requirements:
        user_name: String
        password: String -- must be md5 hashed.

    Example:
    {
        user_name: admin
        password: 5f4dcc3b5aa765d61d8327deb882cf99
    }
*/
router.post('/login', function(req, res, next) {
    const user_name = req.body.user_name;
    const password = req.body.password;

    if (user_name && password) {
        User.findOne({user_name: user_name, password: password})
            .exec()
            .then(function(doc) {
                console.log(doc);
                res.status(200).json(doc);
            })
            .catch(function(err) {
                console.log(err);
                res.status(500).json({error: err});
            });
    } else {
        res.status(204).json({error: 'Credentials not provided.'});
    }


});

/* POST Request. */
// Inserts User.
/*
    JSON Requirements:
        user_name: String
        password: String -- must be md5 hashed.
        first_name: String
        last_name: String
        email: String

    Example:
    {
        user_name: admin
        password: 5f4dcc3b5aa765d61d8327deb882cf99
        first_name: john
        last_name: doe
        email: jdoe@aol.com
    }
*/
router.post('/', function(req, res, next) {
    const user_name = req.body.user_name;
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;

    if (user_name && password) {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            user_name: user_name,
            password: password,
            first_name: first_name,
            last_name: last_name,
            email: email
        });

        user.save().then(function(result) {
            console.log(result);
        }).catch(function(err) {
            console.log(err);
        });

        res.status(201).json({
            message: 'Handling POST requests to /users',
            createdUser: user
        });
    } else {
        res.status(204).json({error: "Missing user_name or password."});
    }


});

/* PATCH Request. */
router.patch('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling PATCH requests for /users'
    });
});

/* DELETE Request. */
router.delete('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling DELETE requests for /users'
    });
});

module.exports = router;