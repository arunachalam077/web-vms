import { Request, Response } from 'express';
import Visitor from '../models/Visitor';

// Generate a unique exit code with timestamp
const generateExitCode = (): string => {
  const timestamp = new Date();
  const hours = timestamp.getHours().toString().padStart(2, '0');
  const minutes = timestamp.getMinutes().toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `VST${randomNum}_${hours}${minutes}`;
};

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
    
    const exitCode = generateExitCode();
    console.log('Generated exit code:', exitCode);
    
    const visitor = new Visitor({
      fullName,
      phoneNumber,
      email,
      purpose,
      hostName,
      company,
      vehicleNumber,
      modeOfEntry,
      visitDate: new Date(visitDate),
      checkInTime: new Date(),
      status: 'checked-in',
      exitCode
    });

    // Log the visitor object before saving
    console.log('Visitor object before save:', JSON.stringify(visitor, null, 2));

    try {
      const savedVisitor = await visitor.save();
      console.log('Saved visitor:', JSON.stringify(savedVisitor, null, 2));
      
      res.status(201).json({
        success: true,
        data: savedVisitor,
        message: 'Visitor registered successfully'
      });
    } catch (saveError) {
      console.error('Error saving visitor:', saveError);
      res.status(500).json({
        success: false,
        message: 'Error saving visitor to database',
        error: saveError.message,
        validationErrors: saveError.errors
      });
    }
  } catch (error) {
    console.error('Error in registerVisitor:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering visitor',
      error: error.message,
      receivedData: req.body
    });
  }
};

export const checkoutVisitor = async (req: Request, res: Response) => {
  try {
    const { exitCode } = req.body;
    
    const visitor = await Visitor.findOne({ exitCode });
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    if (visitor.status === 'checked-out') {
      return res.status(400).json({
        success: false,
        message: 'Visitor has already checked out'
      });
    }

    visitor.status = 'checked-out';
    visitor.checkOutTime = new Date();
    await visitor.save();

    res.status(200).json({
      success: true,
      data: visitor,
      message: `Visitor ${exitCode} has been successfully checked out`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during checkout',
      error: error.message
    });
  }
};

export const getVisitors = async (req: Request, res: Response) => {
  try {
    const visitors = await Visitor.find().sort({ checkInTime: -1 });
    res.status(200).json({
      success: true,
      data: visitors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching visitors',
      error: error.message
    });
  }
}; 