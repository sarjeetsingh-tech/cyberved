// src/middleware/validation.js
import { body, validationResult } from 'express-validator';

// Common validation rules for all forms
const commonValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('telephone').matches(/^\d{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('whatsapp').matches(/^\d{10}$/).withMessage('Valid 10-digit WhatsApp number is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required')
];

// Specific validation for Call for Paper
export const paperValidation = [
  ...commonValidation,
  body('formType').equals('call_for_paper').withMessage('Invalid form type'),
  body('amount').isNumeric().withMessage('Valid amount is required')
];

// Specific validation for Summit
export const summitValidation = [
  ...commonValidation,
  body('formType').equals('summit').withMessage('Invalid form type'),
  body('organization').trim().notEmpty().withMessage('Organization is required')
];

// Specific validation for Hackathon
export const hackathonValidation = [
  ...commonValidation,
  body('formType').equals('hackathon').withMessage('Invalid form type'),
  body('githubProfile')
    .matches(/^https:\/\/github\.com\/[a-zA-Z0-9-]+$/)
    .withMessage('Valid GitHub profile URL is required'),
  body('experience').isIn(['0-1', '1-3', '3-5', '5+']).withMessage('Valid experience range is required'),
  body('teamName').trim().notEmpty().withMessage('Team name is required'),
  body('teamSize').isInt({ min: 2, max: 4 }).withMessage('Team size must be between 2 and 4'),
  body('teamRole').trim().notEmpty().withMessage('Team role is required'),
  body('projectIdea').trim().notEmpty().withMessage('Project idea is required'),
  body('skills').trim().notEmpty().withMessage('Skills are required')
];

// Validation result checker middleware
export const validate = (req, res, next) => {
  console.log(req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};