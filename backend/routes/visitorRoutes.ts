import express from 'express';
import { registerVisitor, checkoutVisitor } from '../controllers/visitorController';

const router = express.Router();

// Register a new visitor
router.post('/register', registerVisitor);

// Checkout a visitor
router.post('/checkout', checkoutVisitor);

export default router; 