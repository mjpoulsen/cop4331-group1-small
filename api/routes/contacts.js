// TODO support editing contact.
// TODO support deleting contact.

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Contact = require('../models/contact');

/* GET Request. */
router.get('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling GET requests for /contacts'
    });
});

/* POST Request. */
/*
    Returns all contacts associated with a User's ID.

    JSON Requirements:
        user_id: String

    Example:
    {
        user_id: 5a5ffa7467d8f7bef4623040
    }
*/
router.post('/allcontacts', function(req, res, next) {
    const usersID = req.body.user_id;
    if (usersID) {
        Contact.find({user_id: usersID }, function(err, docs) {
            if (!err){
                res.status(200).json({
                    message: 'Handling POST requests for /contacts',
                    returnedContact: docs
                });
            } else {
                res.status(500).json({
                    message: err
                });
            }
        });
    } else {
        res.status(204).json({message: 'No content. UserID was not provided.'});
    }

});

/* GET Request with Id. */
router.get('/:contactId', function(req, res, next) {
    const id = req.params.contactId;
    // TODO determine whether or no if-statement is necessary. As of now, route is not get called if contactId is null.
    if (id) {
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
    } else {
        res.status(204).json({error: "Must supply Contact ID."});
    }

});

/* POST Request. */
/*
    Adds a Contact to the Contacts table.

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
router.post('/addcontact', function(req, res, next) {
    const user_id = req.body.user_id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const phone_number = req.body.phone_number;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;

    if (user_id && first_name && last_name && phone_number) {
        const contact = new Contact({
            _id: new mongoose.Types.ObjectId(),
            user_id: user_id,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
            street: street,
            city: city,
            state: state,
            zip: zip
        });

        contact.save().then(function(result) {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /contacts',
                createdUser: contact
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({error: err});
        });
    } else {
        res.status(204).json({error: 'No content. UserID or First Name or Last Name was not provided.'});
    }
});

/* PATCH Request. */
router.patch('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling PATCH requests for /contacts'
    });
});

/* DELETE Request. */
// If status code 204 is returned, the credentials do not exist.
/*
    JSON Requirements:
        contactId: String

    Example:
    {
        "userId": "5f4dcc3b5aa765d61d8327deb882cf99"
        "contactId": "admin"
    }
*/
router.delete('/deleteContact', function(req, res, next) {
    var contactId = req.body.contactId;
    var userId = req.body.userId;
    if (contactId) {
        Contact.remove({_id: contactId, user_id: userId}, function(err) {
            if (!err) {
                    res.status(200).json({
                        message: 'Contact was deleted.'
                    });
                } else {
                    res.status(500).json({
                        error: 'I don\'t know...'
                    });
                }
        });
    } else {
        res.status(204).json({
            error: 'Please provide a contactId or userId.'
        });
    }
    
});

module.exports = router;