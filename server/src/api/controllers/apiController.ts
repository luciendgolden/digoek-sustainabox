import { type Request, type Response } from 'express';
import ApiService from '../services/apiService';

class ApiController {
    private readonly apiService: ApiService;

    constructor () {
        this.apiService = new ApiService();
    }

    async getFeedback (req: Request, res: Response): Promise<void> {
        try {
            const feedback = await this.apiService.getFeedback();
            res.status(200).json(feedback);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async feedback (req: Request, res: Response): Promise<void> {
        try {
            const feedback = await this.apiService.feedback(req.body);
            res.status(201).json(feedback);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAboboxes (req: Request, res: Response): Promise<void> {
        try {
            const aboboxes = await this.apiService.getAboboxes();
            res.status(200).json(aboboxes);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAboboxById (req: Request, res: Response): Promise<void> {
        try {
            const abobox = await this.apiService.getAboboxById(req.params.id);
            res.status(200).json(abobox);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCategories (req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.apiService.getCategories();
            res.status(200).json(categories);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default ApiController;
