import { ObjectId } from 'mongodb';
import MongoDBConnection from '../../config/dbConfig';
import { aggregateAboboxesWithProducts } from '../helpers/utility';
import { type Feedback, type AboBox, type Category } from '../models';

class ApiRepository {
    private readonly client: MongoDBConnection;

    constructor () {
        this.client = MongoDBConnection.getInstance();
    }

    async getFeedbackByUserAndAboBox (userId: ObjectId, aboBoxId: ObjectId): Promise<any | null> {
        try {
            await this.client.connect();
            const feedback = await this.client.database?.collection<Feedback>('feedback').findOne({ userId, aboBoxId });
            return feedback ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getFeedback (): Promise<any[] | null> {
        try {
            await this.client.connect();
            const feedback = await this.client.database?.collection<Feedback>('feedback').find({}).toArray();
            return feedback ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async insertOneFeedback (feedback: Feedback): Promise<{ _id: ObjectId } | null> {
        try {
            await this.client.connect();
            const feedbackCollection = this.client.database?.collection<Feedback>('feedback');
            const newFeedback = await feedbackCollection?.insertOne(feedback);
            return ((newFeedback?.insertedId) != null) ? { _id: newFeedback?.insertedId } : null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getCategories (): Promise<any[] | null> {
        try {
            await this.client.connect();
            const categories = await this.client.database?.collection<Category>('categories').find({}).toArray();
            return categories ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getAboboxesDetails (): Promise<any[] | null> {
        try {
            await this.client.connect();
            const aboboxes = await this.client.database?.collection<AboBox>('abobox').aggregate(aggregateAboboxesWithProducts).toArray();
            return aboboxes ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getAboboxDetailsById (id: string): Promise<any | null> {
        const newAggregate = [
            {
                $match: {
                    _id: new ObjectId(id)
                }
            },
            ...aggregateAboboxesWithProducts
        ];

        try {
            await this.client.connect();
            const abobox = await this.client.database?.collection<AboBox>('abobox').aggregate(newAggregate).toArray();
            return abobox ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getAboboxProductsByAboboxId (id: string): Promise<any | null> {
        try {
            await this.client.connect();
            const abobox = await this.client.database?.collection<AboBox>('abobox').findOne({ _id: new ObjectId(id) });
            return abobox ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }
}

export default ApiRepository;
