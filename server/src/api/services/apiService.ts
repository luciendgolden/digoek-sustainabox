import { ObjectId } from 'mongodb';
import ApiRepository from '../repositories/apiRepository';
import { type Feedback } from '../models';

class ApiService {
    private readonly apiRepository: ApiRepository;

    constructor () {
        this.apiRepository = new ApiRepository();
    }

    async getFeedback (): Promise<any[]> {
        const feedback = await this.apiRepository.getFeedback();

        if (feedback == null) {
            throw new Error('No feedback found');
        }

        return feedback;
    }

    async feedback (obj: any): Promise<any | null> {
        const feedback = {
            userId: new ObjectId(String(obj.userId)),
            aboBoxId: new ObjectId(String(obj.aboBoxId)),
            rating: obj.rating,
            comment: obj.comment
        } satisfies Feedback;

        // Check if feedback already exists
        const existingFeedback = await this.apiRepository.getFeedbackByUserAndAboBox(feedback.userId, feedback.aboBoxId);

        if (existingFeedback != null) {
            throw new Error('Feedback already exists');
        }

        const insertedFeedback = await this.apiRepository.insertOneFeedback(feedback);

        if (insertedFeedback == null) {
            throw new Error('Feedback not inserted');
        }

        return insertedFeedback;
    }

    async getAboboxes (): Promise<any[]> {
        const aboboxes = await this.apiRepository.getAboboxesDetails();

        if (aboboxes == null) {
            throw new Error('No aboboxes found');
        }

        return aboboxes;
    }

    async getAboboxById (id: string): Promise<any> {
        const abobox = await this.apiRepository.getAboboxDetailsById(id);

        if (abobox == null) {
            throw new Error('No abobox found');
        }

        return abobox;
    }

    async getCategories (): Promise<any[]> {
        const categories = await this.apiRepository.getCategories();

        if (categories == null) {
            throw new Error('No categories found');
        }

        return categories;
    }
}

export default ApiService;
