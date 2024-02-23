import express = require('express');

import { registerUser, login ,updateUserById, deleteUserById,getUserById, resetPassword, handleResetPassword} from '../controllers/authController';
import authenticateMiddleware from '../authMiddleware/authenticateMiddleware';
// import * as AuthController from '../controllers/authController';

const app = express();


const router = express.Router();

router.post('/register',registerUser);
router.post('/login', login);
router.get('/users/:id',authenticateMiddleware ,getUserById);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUserById);
router.post('/reset-password', resetPassword);
router.post('/handle-reset-password', handleResetPassword);

export default router;
