import { Request, Response } from 'express';
import Visitor from '../models/Visitor';

// @desc    Register a new visitor
// @route   POST /api/visitors
// @access  Public
export const registerVisitor = async (req: Request, res: Response) => {
  try {
    const { fullName, phoneNumber, email, purpose, hostName, visitDate } = req.body;

    const visitor = await Visitor.create({
      fullName,
      phoneNumber,
      email,
      purpose,
      hostName,
      visitDate: new Date(visitDate),
    });

    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ message: 'Error registering visitor', error });
  }
};

// @desc    Get all visitors
// @route   GET /api/visitors
// @access  Public
export const getVisitors = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Visitor.countDocuments();
    
    // Get visitors with pagination
    const visitors = await Visitor.find()
      .sort({ checkInTime: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: visitors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ message: 'Error fetching visitors' });
  }
};

// @desc    Get visitor by ID
// @route   GET /api/visitors/:id
// @access  Public
export const getVisitorById = async (req: Request, res: Response) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visitor', error });
  }
};

// @desc    Check out visitor
// @route   PUT /api/visitors/:id/checkout
// @access  Public
export const checkOutVisitor = async (req: Request, res: Response) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    visitor.checkOutTime = new Date();
    visitor.status = 'checked-out';
    await visitor.save();

    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: 'Error checking out visitor', error });
  }
};

// @desc    Delete visitor
// @route   DELETE /api/visitors/:id
// @access  Public
export const deleteVisitor = async (req: Request, res: Response) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    await visitor.deleteOne();
    res.json({ message: 'Visitor removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting visitor', error });
  }
}; 