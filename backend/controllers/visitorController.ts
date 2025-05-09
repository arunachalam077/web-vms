import { Request, Response } from 'express';
import Visitor, { IVisitor } from '../models/Visitor';

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
    const { name, phoneNumber, purpose, visitingWhom, guardName, guardId } = req.body;
    
    const exitCode = generateExitCode();
    
    const visitor = new Visitor({
      name,
      phoneNumber,
      purpose,
      visitingWhom,
      guardName,
      guardId,
      exitCode,
      checkedOut: false
    });

    await visitor.save();
    
    res.status(201).json({
      success: true,
      data: visitor,
      message: 'Visitor registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering visitor',
      error: error.message
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

    if (visitor.checkedOut) {
      return res.status(400).json({
        success: false,
        message: 'Visitor has already checked out'
      });
    }

    visitor.checkedOut = true;
    visitor.exitTime = new Date();
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