import express from 'express';
import { register, login } from '../controllers/authController.js';
import validate from '../middlewares/joiValidator.js';
import Joi from 'joi';

const router = express.Router();

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
