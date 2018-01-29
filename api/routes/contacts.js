// Imports and constant members.
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Contact = require('../models/contact');
const sanitize = require('mongo-sanitize');

/* POST Request. */
/*
    Returns all contacts associated with a User's ID.
    JSON Requirements:
        user_id: String

    Example:
    {
        "user_id": "5a5ffa7467d8f7bef4623040"
    }
*/
router.post('/allcontacts', function(req, res, next) {
    const usersID = sanitize(req.body.user_id);
    if (usersID) {
        Contact.find({user_id: usersID }, function(err, docs) {
            if (!err){
                res.status(200).json({
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
        zip: String

    Example:
    {
        "user_id": "5a5ffa7467d8f7bef4623040",
        "first_name": "john",
        "last_name": "doe",
        "phone_number": "407-867-5309",
        "street": "123 Park Ave.",
        "city": "Winter Park",
        "state": "Florida",
        "zip": "32789"
    }
*/
router.post('/addcontact', function(req, res, next) {
    const user_id = sanitize(req.body.user_id);
    const first_name = sanitize(req.body.first_name);
    const last_name = sanitize(req.body.last_name);
    const phone_number = sanitize(req.body.phone_number);
    const street = sanitize(req.body.street);
    const city = sanitize(req.body.city);
    const state = sanitize(req.body.state);
    const zip = sanitize(req.body.zip);

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

/* DELETE Request. */
// If status code 204 is returned, credentials were not provided.
/*
    JSON Requirements:
        contactId: String

    Example:
    {
        "user_Id": "5f4dcc3b5aa765d61d8327deb882cf99",
        "contactId": "5a6152357b2e0604b452d615"
    }
*/
router.post('/deleteContact', function(req, res, next) {
    var user_Id = sanitize(req.body.user_Id);
    var contactId = sanitize(req.body.contactId);
    console.log("user_id: " + user_Id + " contactId: " + contactId);
    if (contactId && user_Id) {
        Contact.remove({_id: contactId, user_id: user_Id}, function(err) {
            if (!err) {
                    res.status(200).json({
                        message: 'Contact was deleted.'
                    });
                } else {
                    res.status(500).json({
                        message: err
                    });
                }
        });
    } else {
        res.status(204).json({
            error: 'ContactId or userId was not provided.'
        });
    }
    
});

module.exports = router;
