// TODO get full list of contacts.
// TODO support editing contact.
// TODO support deleting contact.
// TODO return list of contacts only associated to a user.

const express = require('express');
const router = express.Router();

const Contact = require('../models/contact');

/* GET Request. */
router.get('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling GET requests for /contacts'
    });
});

/* GET Request with Id. */
router.get('/:contactId', function(req, res, next) {
    const id = req.params.contactId;
    Contact.findById(id)
        .exec()
        .then(function(doc) {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(function(err) {
            console.log(err);
            res.status(500).json({error: err});
        });
});

/* POST Request. */
/*
    JSON Requirements:
        user_id: String,
        first_name: String,
        last_name: String,
        phone_number: String,
        street: String,
        city: String,
        state: String,
        zip: Number

    Example:
    {
        user_id: 5a5ffa7467d8f7bef4623040,
        first_name: john,
        last_name: doe,
        phone_number: 407-867-5309,
        street: 123 Park Ave.,
        city: Winter Park,
        state: Florida,
        zip: 32789
    }
*/
router.post('/', function(req, res, next) {
    const contact = new Contact({
        _id: new mongoose.Types.ObjectId(),
        user_id: req.body.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    });

    contact.save().then(function(result) {
        console.log(result);
    }).catch(function(err) {
        console.log(err);
    });

    res.status(201).json({
        message: 'Handling POST requests to /contacts',
        createdUser: user
    });
});

/* PATCH Request. */
router.patch('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling PATCH requests for /contacts'
    });
});

/* DELETE Request. */
router.delete('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling DELETE requests for /contacts'
    });
});

module.exports = router;