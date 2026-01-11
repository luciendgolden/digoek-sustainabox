import { type Request, type Response, type NextFunction } from 'express';
import morgan from 'morgan';
import logger from '../../config/logger';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import jwt from 'jsonwebtoken';

const ajv = new Ajv();
addFormats(ajv);

const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';

// Define the custom 'user' token
morgan.token('user', (req: any) => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return req.user ? req.user.id : 'anonymous';
});

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms - user: :user',
    {
        stream: {
            write: (message) => logger.http(message.trim())
        }
    }
);

const validateSchema = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const validate = ajv.compile(schema);
        const isDataValid = validate(req.body);

        console.log(req.body);

        if (!isDataValid) {
            logger.error(validate.errors);
            res.status(400).json({ errors: validate.errors });
            return;
        }
        next();
    };
};

const verifyToken = (req: any, res: any, next: NextFunction): void => {
    try {
        const token: string = req.headers['x-access-token'];
        if (token == null) {
            return res.status(403).send({ message: 'No token provided!' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).send({ message: 'Invalid token' });
    }
};

const authorizeRole = (...allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
        if (req.user == null) {
            // No user is logged in
            return res.status(401).send({ message: 'Unauthorized' });
        }

        const { role }: { role: string } = req.user;

        if (!allowedRoles.includes(role)) {
            // User role is not in the list of allowed roles
            return res.status(403).send({ message: 'Forbidden', allowedRoles });
        }

        next();
    };
};

export { morganMiddleware, validateSchema, verifyToken, authorizeRole };
