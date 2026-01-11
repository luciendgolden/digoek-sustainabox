/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { authorizeRole, verifyToken } from '../middleware';

const router = Router();

// Gives detailed coverage of the financial transactions
router.get('/reports', verifyToken, authorizeRole('admin'), (req, res) => { res.send('notImplemented'); });

export default router;
