import { Request, Response } from 'express';
import Visitor from '../models/Visitor';
import { generateExitCode } from '../utils/exitCodeGenerator';

// @desc    Register a new visitor
// @route   POST /api/visitors/register
// @access  Public
export const registerVisitor = async (req: Request, res: Response) => {
  try {
    const { fullName, phoneNumber, email, purpose, hostName, visitDate } = req.body;

    // Generate a unique exit code
    const exitCode = generateExitCode();

    const visitor = await Visitor.create({
      fullName,
      phoneNumber,
      email,
      purpose,
      hostName,
      visitDate: new Date(visitDate),
      exitCode,
      checkInTime: new Date(),
      status: 'checked-in'
    });

    res.status(201).json({
      success: true,
      data: {
        visitor,
        exitCode
      }
    });
  } catch (error) {
    console.error('Error registering visitor:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error registering visitor', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
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
// @route   POST /api/visitors/checkout
// @access  Public
export const checkOutVisitor = async (req: Request, res: Response) => {
  try {
    const { exitCode } = req.body;

    if (!exitCode) {
      return res.status(400).json({
        success: false,
        message: 'Exit code is required'
      });
    }

    // Find visitor by exit code
    const visitor = await Visitor.findOne({ exitCode });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Invalid exit code'
      });
    }

    if (visitor.status === 'checked-out') {
      return res.status(400).json({
        success: false,
        message: 'Visitor already checked out'
      });
    }

    // Update visitor status
    visitor.checkOutTime = new Date();
    visitor.status = 'checked-out';
    await visitor.save();

    res.json({
      success: true,
      message: 'Checkout successful',
      data: visitor
    });
  } catch (error) {
    console.error('Error checking out visitor:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking out visitor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
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