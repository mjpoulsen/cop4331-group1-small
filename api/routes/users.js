// Imports and constant members.
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');
const sanitize = require('mongo-sanitize');

/* POST Login Request. */
// If status code 204 is returned, the credentials were not provided.
/*
    JSON Requirements:
        user_name: String
        password: String -- must be md5 hashed.

    Example:
    {
        "user_name": "admin",
        "password": "5f4dcc3b5aa765d61d8327deb882cf99"
    }
*/
router.post('/login', function(req, res, next) {
    const user_name = sanitize(req.body.user_name);
    const password = sanitize(req.body.password);

    if (user_name && password) {
        User.findOne({user_name: user_name, password: password})
            .exec()
            .then(function(doc) {
                console.log(doc);
                if (doc){
                    res.status(200).json(doc);
                } else {
                    res.status(204).json({error: "Could not find matching credentials."});
                }
            })
            .catch(function(err) {
                console.log(err);
                res.status(500).json({error: err});
            });
    } else {
        res.status(204).json({error: "Credentials not provided."});
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
        "user_name": "admin",
        "password": "5f4dcc3b5aa765d61d8327deb882cf99",
        "first_name": "john",
        "last_name": "doe",
        "email": "jdoe@aol.com"
    }
*/
router.post('/submituser', function(req, res, next) {
    const user_name = sanitize(req.body.user_name);
    const password = sanitize(req.body.password);
    const first_name = sanitize(req.body.first_name);
    const last_name = sanitize(req.body.last_name);
    const email = sanitize(req.body.email);

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
            res.status(201).json({
                createdUser: user
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    } else {
        res.status(204).json({error: "Missing user name or password."});
    }
});

module.exports = router;