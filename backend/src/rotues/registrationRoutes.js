// src/routes/registrationRoutes.js
import express from 'express';
import { registrationController } from '../controllers/registrationController.js';
import { 
  paperValidation, 
  summitValidation, 
  hackathonValidation,
  validate 
} from '../middleware/validation.js';

const router = express.Router();

// Routes with specific validations
router.post('/paper', paperValidation, validate, registrationController.create);
router.post('/summit', summitValidation, validate, registrationController.create);
router.post('/hackathon', hackathonValidation, validate, registrationController.create);

// Get registrations

export default router;