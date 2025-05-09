import express from 'express';
import {
  registerVisitor,
  getVisitors,
  getVisitorById,
  checkOutVisitor,
  deleteVisitor,
} from '../controllers/visitorController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected with authentication
router.use(protect);

router.post('/', registerVisitor);
router.get('/', getVisitors);
router.get('/:id', getVisitorById);
router.put('/:id/checkout', checkOutVisitor);
router.delete('/:id', deleteVisitor);

export default router; 