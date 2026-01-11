// index.ts

import { readFileSync } from 'fs';
import UserRepository from '../repositories/userRepository';
import OrderRepository from '../repositories/orderRepository';
import { type User } from '../models';
import UserService from '../services/userService';

const typeDefs = readFileSync('./src/api/graphql/schema.graphql', { encoding: 'utf-8' });

const userRepository = new UserRepository();
const orderRepository = new OrderRepository();

const resolvers = {
    Query: {
        users: async () => {
            try {
                const allUsers = await userRepository.getAllUsers();
                return allUsers ?? [];
            } catch (error) {
                console.error('Error fetching users:', error);
                return [];
            }
        },
        userById: async (_: any, { _id }: { _id: string }) => {
            try {
                const user = await userRepository.getUserById(_id);
                return user ?? null;
            } catch (error) {
                console.error(`Error fetching user with ID ${_id}:`, error);
                return null;
            }
        },
        orders: async () => {
            try {
                const allOrders = await orderRepository.getOrders();
                return allOrders ?? [];
            } catch (error) {
                console.error('Error fetching orders:', error);
                return [];
            }
        },
        order: async (_: any, { orderId }: { orderId: string }) => {
            try {
                const singleOrder = await orderRepository.getOrderById(orderId);
                return singleOrder ?? null;
            } catch (error) {
                console.error(`Error fetching order with ID ${orderId}:`, error);
                return null;
            }
        }
    },
    Mutation: {
        createUser: async (_: any, { input }: { input: User }) => {
            try {
                const userService = new UserService();
                // if input preferences is null, set it to empty array
                if (input.preferences == null) {
                    input.preferences = [];
                }
                if (input.role.description == null) {
                    input.role.description = '';
                }
                if (input.referredBy == null) {
                    // set referredBy to objectId null
                    input.referredBy = null;
                }
                await userService.register(input);
            } catch (error) {
                console.error('Error creating user:', error);
                throw error;
            }
        },
        updateUser: async (_: any, { _id, input }: { _id: string, input: User }) => {
            try {
                const userService = new UserService();

                await userService.updateUser(_id, input);
            } catch (error) {
                console.error('Error updating user:', error);
                throw error;
            }
        },
        deleteUser: async (_: any, { _id }: { _id: string }) => {
            try {
                const userService = new UserService();
                await userService.deleteUser(_id);
            } catch (error) {
                console.error('Error deleting user:', error);
                throw error;
            }
        }

    },
    Order: {
        user: async (parent: any, _: any, context: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const user = await userRepository.getUserById(parent.userId);
            return user ?? null;
        },
        totalOrderPrice: (parent: any) => {
            return parent.items.reduce((total: number, item: any) => total + item.orderPrice, 0);
        }
    }
};

export {
    resolvers,
    typeDefs
};
