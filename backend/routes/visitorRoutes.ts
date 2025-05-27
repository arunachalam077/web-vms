import express from 'express';
import { registerVisitor, checkoutVisitor, getVisitors } from '../controllers/visitorController';

const router = express.Router();

// Register a new visitor
router.post('/register', registerVisitor);

// Checkout a visitor
router.post('/checkout', checkoutVisitor);

// Get all visitors
router.get('/', getVisitors);

export default router; 