import { type UpdateResult, ObjectId, type WithId } from 'mongodb';
import MongoDBConnection from '../../config/dbConfig';
import { type OrderAboBoxItem, type Order, type OrderProductItem, type AboBox } from '../models';
import debug from 'debug';
import logger from '../../config/logger';

const log: debug.IDebugger = debug('server:order-repository');

class OrderRepository {
    private readonly client: MongoDBConnection;

    constructor () {
        this.client = MongoDBConnection.getInstance();
    }

    async getOrders (): Promise<Array<WithId<Order>> | null> {
        try {
            await this.client.connect();
            const ordersCollection = this.client.database?.collection<Order>('orders');
            const ordersList = await ordersCollection?.find().toArray();
            return ordersList ?? null;
        } catch (err: any) {
            logger.error(err);
            throw new Error(`${err.message}`);
        } finally {
            await this.client.closeConnection();
        }
    }

    async getOrderById (orderId: string): Promise<WithId<Order> | null> {
        try {
            await this.client.connect();
            const orders = this.client.database?.collection<Order>('orders');
            const order = await orders?.findOne({ _id: new ObjectId(orderId) });

            // Additional logic to populate items with aboBox details
            if (order) {
                order.items = await Promise.all(
                    order.items.map(async (item) => {
                        if ('aboBoxId' in item) {
                            const aboBox = await this.getAboBoxById(item.aboBoxId.toString()); // Convert ObjectId to string
                            return { ...item, aboBox, aboBoxId: item.aboBoxId, subscriptionStatus: 'pending', subscription_months: 0 } as OrderAboBoxItem;
                        }
                        return item as OrderProductItem;
                    })
                ) as OrderAboBoxItem[]; // Explicitly type as OrderAboBoxItem[]
            }

            return order ?? null;
        } catch (err: any) {
            logger.error(err);
            throw new Error(`${err.message}`);
        } finally {
            await this.client.closeConnection();
        }
    }

    async getAboBoxById (aboBoxId: string): Promise<WithId<AboBox> | null> {
        try {
            const aboBoxes = this.client.database?.collection<AboBox>('aboBoxes');
            const aboBox = await aboBoxes?.findOne({ _id: new ObjectId(aboBoxId) });
            return aboBox ?? null;
        } catch (err: any) {
            console.log(err);
            throw new Error(`${err.message}`);
        }
    }

    async getOrderByUserId (userId: string): Promise<WithId<Order> | null> {
        try {
            await this.client.connect();
            const orders = this.client.database?.collection<Order>('orders');
            const order = await orders?.findOne({ userId: new ObjectId(userId) });
            return order ?? null;
        } catch (err: any) {
            logger.error(err);
            throw new Error(`${err.message}`);
        } finally {
            await this.client.closeConnection();
        }
    }

    async createOrder (order: Order): Promise<{ _id: ObjectId } | null> {
        try {
            await this.client.connect();
            const orders = this.client.database?.collection<Order>('orders');
            const newOrder = await orders?.insertOne(order);
            return ((newOrder?.insertedId) != null) ? { _id: newOrder?.insertedId } : null;
        } catch (err: any) {
            logger.error(err);
            throw new Error(`${err.message}`);
        } finally {
            await this.client.closeConnection();
        }
    }

    async updateOrder (orderId: string, order: Order): Promise<UpdateResult<Order> | null> {
        try {
            await this.client.connect();
            const orders = this.client.database?.collection<Order>('orders');
            const updatedOrder = await orders?.updateOne({ _id: new ObjectId(orderId) }, { $set: { ...order } });
            return updatedOrder ?? null;
        } catch (err: any) {
            logger.error(err);
            throw new Error(`${err.message}`);
        } finally {
            await this.client.closeConnection();
        }
    }

    async cancelOrder (): Promise<any> {
        return 'deleteOrder';
    }

    async getOrdersByDate (startDateString: string, endDateString: string): Promise<Array<WithId<Order>> | null> {
        try {
            const startDate = new Date(startDateString);
            const endDate = new Date(endDateString);

            await this.client.connect();
            const orders = this.client.database?.collection<Order>('orders');

            const ordersList = await orders?.find({
                orderDate: { $gte: startDate, $lte: endDate }
            }).toArray();

            return ordersList ?? null;
        } catch (err: any) {
            logger.error(err);
            throw new Error(`${err.message}`);
        } finally {
            await this.client.closeConnection();
        }
    }
}

export default OrderRepository;
