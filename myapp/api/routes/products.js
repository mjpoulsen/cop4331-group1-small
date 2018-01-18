// Express Framework.
const express = require('express');
// Router object from Express. Helps to route requests to the correct API.
const router = express.Router();
const mongoose = require('mongoose');
const bluebirdPromise = require('bluebird');

// Import Schema for MongoDB.
const Product = require('../models/product');

/* GET Request. */
// The resource location is /products/ but the function below only needs '/' because the file's
// name is products.
router.get('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

/* POST Request. */
router.post('/', function(req, res, next) {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(function(result) {
        console.log(result);
    })
    .catch(function(err) {
        console.log(err);
    });
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });
});

/* GET Request with Id. */
router.get('/:productId', function(req, res, next) {
    const id = req.params.productId;
    var query = Product.findOne({_id: id});
    Product.findById(id)
        .exec()
        .then(function(doc) {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(function(err) {
            console.log(err);
            res.status(500).json({error: err});
        });

    // Use bluebird
    // mongoose.Promise = require('bluebird');
    // assert.equal(query.exec().constructor, require('bluebird'));
    //
    // // Use q. Note that you **must** use `require('q').Promise`.
    // mongoose.Promise = require('q').Promise;
    // assert.ok(query.exec() instanceof require('q').makePromise);


});

/* PATCH Request with Id. */
router.patch('/:productId', function(req, res, next) {
    res.status(200).json({
        message: 'Updated product!'
    });
});

/* DELETE Request with Id. */
router.delete('/:productId', function(req, res, next) {
    res.status(200).json({
        message: 'Deleted product!'
    });
});

module.exports = router;