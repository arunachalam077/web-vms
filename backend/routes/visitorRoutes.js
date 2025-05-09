const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// Register a new visitor
router.post('/', visitorController.registerVisitor);

// Get all visitors with optional filtering
router.get('/', visitorController.getAllVisitors);

// Get visitor by ID
router.get('/:id', visitorController.getVisitorById);

// Check out a visitor
router.put('/:id/checkout', visitorController.checkOutVisitor);

// Delete a visitor
router.delete('/:id', visitorController.deleteVisitor);

// Get unique hosts
router.get('/hosts/unique', visitorController.getUniqueHosts);

// Get visitor statistics
router.get('/stats/overview', visitorController.getVisitorStats);

module.exports = router; 