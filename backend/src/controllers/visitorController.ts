import { Request, Response } from 'express';
import Visitor from '../models/Visitor';
import { generateExitCode } from '../utils/exitCodeGenerator';

// @desc    Register a new visitor
// @route   POST /api/visitors/register
// @access  Public
export const registerVisitor = async (req: Request, res: Response) => {
  try {
    console.log('Raw request body:', req.body);
    
    const {
      fullName,
      phoneNumber,
      email,
      purpose,
      hostName,
      company,
      vehicleNumber,
      modeOfEntry,
      visitDate
    } = req.body;

    // Log the received data
    console.log('Received visitor data:', {
      fullName,
      phoneNumber,
      email,
      purpose,
      hostName,
      company,
      vehicleNumber,
      modeOfEntry,
      visitDate
    });

    // Validate required fields
    if (!company || !vehicleNumber || !modeOfEntry) {
      console.log('Missing required fields:', { company, vehicleNumber, modeOfEntry });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: company, vehicleNumber, or modeOfEntry',
        receivedData: req.body
      });
    }

    // Generate a unique exit code
    const exitCode = generateExitCode();
    console.log('Generated exit code:', exitCode);

    const visitor = await Visitor.create({
      fullName,
      phoneNumber,
      email,
      purpose,
      hostName,
      company,
      vehicleNumber,
      modeOfEntry,
      visitDate: new Date(visitDate),
      exitCode,
      checkInTime: new Date(),
      status: 'checked-in'
    });

    // Log the saved visitor
    console.log('Saved visitor:', JSON.stringify(visitor, null, 2));

    res.status(201).json({
      success: true,
      data: visitor
    });
  } catch (error) {
    console.error('Error registering visitor:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error registering visitor', 
      error: error instanceof Error ? error.message : 'Unknown error',
      receivedData: req.body
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
    res.status(500).json({ 
      success: false,
      message: 'Error fetching visitors',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get visitor by ID
// @route   GET /api/visitors/:id
// @access  Public
export const getVisitorById = async (req: Request, res: Response) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ 
        success: false,
        message: 'Visitor not found' 
      });
    }
    res.json({
      success: true,
      data: visitor
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching visitor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Check out visitor
// @route   POST /api/visitors/checkout
// @access  Public
export const checkOutVisitor = async (req: Request, res: Response) => {
  try {
    console.log('Checkout request body:', req.body);
    const { exitCode } = req.body;

    if (!exitCode) {
      console.log('No exit code provided');
      return res.status(400).json({
        success: false,
        message: 'Exit code is required'
      });
    }

    console.log('Attempting to find visitor with exit code:', exitCode);

    // Find visitor by exit code
    const visitor = await Visitor.findOne({ exitCode });

    if (!visitor) {
      console.log('No visitor found with exit code:', exitCode);
      return res.status(404).json({
        success: false,
        message: 'Invalid exit code'
      });
    }

    console.log('Found visitor:', JSON.stringify(visitor, null, 2));

    // Check if already checked out
    if (visitor.status === 'checked-out') {
      console.log('Visitor is already checked out');
      return res.status(400).json({
        success: false,
        message: 'Visitor is already checked out'
      });
    }

    try {
      // Use the model's checkOut method
      const updatedVisitor = await visitor.checkOut();
      console.log('Visitor checked out successfully:', JSON.stringify(updatedVisitor, null, 2));
      
      return res.json({
        success: true,
        message: 'Checkout successful',
        data: updatedVisitor
      });
    } catch (saveError) {
      console.error('Error saving visitor:', saveError);
      return res.status(500).json({
        success: false,
        message: 'Error updating visitor status',
        error: saveError instanceof Error ? saveError.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error in checkOutVisitor:', error);
    return res.status(500).json({
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
    console.log('Attempting to delete visitor with ID:', req.params.id);
    
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      console.log('No visitor found with ID:', req.params.id);
      return res.status(404).json({ 
        success: false,
        message: 'Visitor not found' 
      });
    }

    console.log('Found visitor to delete:', JSON.stringify(visitor, null, 2));

    try {
      // Use the model's deleteVisitor method
      await visitor.deleteVisitor();
      console.log('Visitor deleted successfully');
      
      res.json({ 
        success: true,
        message: 'Visitor removed successfully' 
      });
    } catch (deleteError) {
      console.error('Error in deleteVisitor method:', deleteError);
      return res.status(500).json({ 
        success: false,
        message: 'Error deleting visitor',
        error: deleteError instanceof Error ? deleteError.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error in deleteVisitor controller:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting visitor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Export all visitors as CSV
// @route   GET /api/visitors/export
// @access  Public
export const exportVisitors = async (req: Request, res: Response) => {
  try {
    const visitors = await Visitor.find().sort({ checkInTime: -1 });
    
    // Define CSV headers
    const headers = [
      'Full Name',
      'Phone Number',
      'Email',
      'Company',
      'Purpose',
      'Host Name',
      'Vehicle Number',
      'Mode of Entry',
      'Visit Date',
      'Check In Time',
      'Check Out Time',
      'Status',
      'Exit Code'
    ];

    // Convert visitors to CSV rows
    const rows = visitors.map(visitor => [
      visitor.fullName,
      visitor.phoneNumber,
      visitor.email,
      visitor.company,
      visitor.purpose,
      visitor.hostName,
      visitor.vehicleNumber,
      visitor.modeOfEntry,
      visitor.visitDate.toISOString().split('T')[0],
      visitor.checkInTime.toISOString(),
      visitor.checkOutTime ? visitor.checkOutTime.toISOString() : '',
      visitor.status,
      visitor.exitCode
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=visitors.csv');

    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting visitors:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting visitors',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 