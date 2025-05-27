import express from 'express';
import {
  registerVisitor,
  getVisitors,
  getVisitorById,
  checkOutVisitor,
  deleteVisitor,
  exportVisitors
} from '../controllers/visitorController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerVisitor);
router.post('/checkout', checkOutVisitor);

// Protected routes (authentication required)
router.use(protect);
router.get('/', getVisitors);
router.get('/export', exportVisitors);
router.get('/:id', getVisitorById);
router.delete('/:id', deleteVisitor);

export default router; 