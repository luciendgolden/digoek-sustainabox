import { MongoClient, type Db, ObjectId } from 'mongodb';
import logger from './logger';
import path from 'path';
import fs from 'fs';

class MongoDBConnection {
    private readonly DB_URI = process.env.DB_URI ?? 'mongodb://localhost:27017';
    private readonly DB_NAME = process.env.DB_NAME ?? 'mydb';

    private static instance: MongoDBConnection | null = null;
    private readonly dbClient: MongoClient;
    private readonly dbName: string;
    private db?: Db;

    private constructor (dbName?: string, uri?: string) {
        this.dbName = dbName ?? this.DB_NAME;
        uri = uri ?? this.DB_URI;
        this.dbClient = new MongoClient(uri);
    }

    public static getInstance (dbName?: string, uri?: string): MongoDBConnection {
        if (MongoDBConnection.instance == null) {
            MongoDBConnection.instance = new MongoDBConnection(dbName, uri);
        }
        return MongoDBConnection.instance;
    }

    public async connect (): Promise<void> {
        await this.dbClient.connect();
        this.db = this.dbClient.db(this.dbName);
        logger.info(`Database connection established to ${this.db.databaseName}`);
    }

    get database (): Db | undefined {
        return this.db;
    }

    public async closeConnection (): Promise<void> {
        await this.dbClient.close();
        this.db = undefined;
        logger.info('Database connection closed');
    }

    public async getNextSequenceOrCreate (collectionName: string): Promise<number | null> {
        if (this.db == null) {
            throw new Error('Database not initialized');
        }

        try {
            const countersCollection = this.db.collection('counters');

            const result = await countersCollection.findOneAndUpdate(
                { collection: collectionName },
                { $inc: { seq: 1 } },
                { upsert: true, returnDocument: 'after' }
            );

            return result?.seq;
        } catch (error) {
            throw new Error('Error in getNextSequenceOrCreate');
        }
    }

    public createOrUpdateValidation = async (collectionName: string, schema: any): Promise<void> => {
        if (this.db == null) {
            throw new Error('Database not initialized');
        }

        try {
            const collectionExists = await this.db.listCollections({ name: collectionName }, { nameOnly: true }).hasNext();

            if (!collectionExists) {
                await this.db.createCollection(collectionName, {
                    validator: { $jsonSchema: schema },
                    validationLevel: 'strict' // Can also be 'moderate'
                });
                logger.info(`Schema validation rules for ${collectionName} set successfully`);
            } else {
                await this.db.command({
                    collMod: collectionName,
                    validator: { $jsonSchema: schema },
                    validationLevel: 'strict' // Can also be 'moderate'
                });
                logger.info(`Schema validation rules for ${collectionName} updated successfully`);
            }
        } catch (error) {
            throw new Error('Error in createOrUpdateValidation');
        }
    };

    async preloadData(): Promise<void> {
        if (this.db == null) {
            throw new Error('Database not initialized');
        }

        const convertOid = (data: any): any => {
            if (Array.isArray(data)) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                return data.map(convertOid);
            } else if (data !== null && typeof data === 'object') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                Object.keys(data).forEach((key) => {
                    if (key === '$oid' && typeof data[key] === 'string') {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        data = new ObjectId(data[key]);
                    } else {
                        data[key] = convertOid(data[key]);
                    }
                });
            }
            return data;
        };

        try {
            const database = this.db;

            const existingCollections = await database.listCollections().toArray();
            const collectionNames = existingCollections.map(c => c.name);

            const collectionsToPreload = [
                { name: 'users', filePath: 'sustainabox.users.json' },
                { name: 'categories', filePath: 'sustainabox.categories.json' },
                { name: 'products', filePath: 'sustainabox.products.json' },
                { name: 'abobox', filePath: 'sustainabox.abobox.json' }
            ];

            for (const { name, filePath } of collectionsToPreload) {
                // Check if the collection already exists
                if (!collectionNames.includes(name)) {
                    const dataPath = path.join(__dirname, '../resources/db', filePath);
                    const fileContent = fs.readFileSync(dataPath, 'utf8');
                    const documents = JSON.parse(fileContent);
                    const formattedDocuments = convertOid(documents);

                    const collection = database.collection(name);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    const result = await collection.insertMany(formattedDocuments);
                    logger.info(`${result.insertedCount} documents were inserted into ${name}`);
                } else {
                    logger.info(`Collection ${name} already exists. Skipping.`);
                }
            }
        } catch (error) {
            logger.error(error);
            throw new Error('Error in preloadData');
        }
    };
}

export default MongoDBConnection;
