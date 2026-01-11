import { type Request, type Response } from 'express';
import UserService from '../services/userService';
import logger from '../../config/logger';

class UserController {
    private readonly userService: UserService;

    constructor () {
        this.userService = new UserService();
    }

    async deletePreferences (req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const deletedUser = await this.userService.deletePreferences(userId);
            if (deletedUser != null) {
                res.json(deletedUser);
            } else {
                res.status(404).send({ error: 'User not found' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async updatePreferences (req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const preferences = req.body;
            const updatedUser = await this.userService.updatePreferences(userId, preferences);
            if (updatedUser != null) {
                res.json(updatedUser);
            } else {
                res.status(404).send({ error: 'User not found' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async recommendAboBox (req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const abobox = await this.userService.recommendAboBox(userId);
            if (abobox != null) {
                res.json(abobox);
            } else {
                res.status(404).send({ error: 'No abobox found for user' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async login (req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.login(req.body);
            if (user != null) {
                res.json(user);
            } else {
                res.status(404).send({ error: 'User not found' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async register (req: Request, res: Response): Promise<void> {
        try {
            // already validated by JSON-Schema
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const user = await this.userService.register(req.body);
            if (user != null) {
                res.json(user);
            } else {
                res.status(404).send({ error: 'User not created' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById (req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const user = await this.userService.getUserById(userId);
            if (user != null) {
                res.json(user);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    }

    async getAllUsers (req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            if (users != null) {
                res.json(users);
            } else {
                res.status(404).send('Users not found');
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    }
}

export default UserController;
