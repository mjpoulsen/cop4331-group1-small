// Express Framework.
const express = require('express');
// Router object from Express. Helps to route requests to the correct API.
const router = express.Router();

/* GET Request. */
// The resource location is /orders/ but the function below only needs '/' because the file's
// name is orders.
router.get('/', function(req, res, next) {
    res.status(200).json({
        message: 'Handling GET requests to /orders'
    });
});

/* POST Request. */
router.post('/', function(req, res, next) {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Handling POST requests to /orders',
        order: order
    });
});

/* GET Request with Id. */
router.get('/:orderId', function(req, res, next) {
    const id = req.params.orderId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id,
            orderId: req.params.orderId
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
});

/* DELETE Request with Id. */
router.delete('/:orderId', function(req, res, next) {
    res.status(200).json({
        message: 'Deleted order!'
    });
});

module.exports = router;