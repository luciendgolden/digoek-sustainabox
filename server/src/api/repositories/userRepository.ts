import MongoDBConnection from '../../config/dbConfig';
import { aggregateUserWithPreferenceCategories } from '../helpers/utility';
import type { Category, Preference, User } from '../models';
import { ObjectId, type UpdateResult, type WithId } from 'mongodb';

class UserRepository {
    private readonly client: MongoDBConnection;

    constructor () {
        this.client = MongoDBConnection.getInstance();
    }

    public async deletePreferences (userId: string): Promise<UpdateResult<User> | null> {
        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const updatedUser = await users?.updateOne({ _id: new ObjectId(userId) }, { $set: { preferences: [] } });
            return updatedUser ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    public async updatePreferences (userId: string, preferences: Preference[]): Promise<UpdateResult<User> | null> {
        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const updatedUser = await users?.updateOne({ _id: new ObjectId(userId) }, { $set: { preferences } });
            return updatedUser ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    private async categoryExists (categoryId: ObjectId): Promise<boolean> {
        const categoryCollection = this.client.database?.collection<Category>('categories');
        const category = await categoryCollection?.findOne({ _id: categoryId });
        return category !== null;
    }

    public async validatePreferences (preferences: Preference[]): Promise<boolean> {
        try {
            await this.client.connect();
            for (const preference of preferences) {
                const exists = await this.categoryExists(preference.categoryId);
                if (!exists) {
                    // If any categoryId does not exist, return false
                    return false;
                }
            }
            // If all categoryIds exist, return true
            return true;
        } finally {
            await this.client.closeConnection();
        }
    }

    public async findByEmail (email: string): Promise<WithId<User> | null> {
        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const user = await users?.findOne({ email });
            return user ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async userExists (email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return user !== null;
    }

    async insertOneUser (user: User): Promise<{ _id: ObjectId } | null> {
        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const newUser = await users?.insertOne(user);
            return ((newUser?.insertedId) != null) ? { _id: newUser?.insertedId } : null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async updateOneUser (userId: string, user: User): Promise<UpdateResult<User> | null> {
        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const updatedUser = await users?.updateOne({ _id: new ObjectId(userId) }, { $set: user });
            return updatedUser ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getAllUsers (): Promise<Array<WithId<User>> | null> {
        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const allUsers = await users?.find().toArray();
            return allUsers ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getAllUsersDetails (): Promise<any[] | null> {
        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const allUsersWithCategories = await users?.aggregate(aggregateUserWithPreferenceCategories).toArray();

            return allUsersWithCategories ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getUserById (userId: string): Promise<WithId<User> | null> {
        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const user = await users?.findOne({ _id: new ObjectId(userId) });
            return user ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getUserDetailsById (userId: string): Promise<any | null> {
        const newAggregation = [
            {
                $match: {
                    _id: new ObjectId(userId)
                }
            },
            ...aggregateUserWithPreferenceCategories];

        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const userWithCategories = await users?.aggregate(newAggregation).toArray();

            return userWithCategories ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async deleteOneUser (userId: string): Promise<WithId<User> | null> {
        try {
            await this.client.connect();
            const users = this.client.database?.collection<User>('users');
            const deletedUser = await users?.findOneAndDelete({ _id: new ObjectId(userId) });
            console.log('user deleted from mongo');
            return deletedUser ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }
}

export default UserRepository;
