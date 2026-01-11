/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import cors from 'cors';
import http from 'http';

import 'dotenv/config';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { resolvers, typeDefs } from './api/graphql';
import indexRoutes from './api/routes/indexRoutes';
import apiRoutes from './api/routes/apiRoutes';
import orderRoutes from './api/routes/orderRoutes';
import productRouter from './api/routes/productRoutes';
import supplierRoutes from './api/routes/supplierRoutes';
import userRoutes from './api/routes/userRoutes';
import adminRouter from './api/routes/adminRoutes';

import { aboxSchema, categorySchema, feedbackSchema, orderSchema, productSchema, supplierSchema, userSchema } from './api/schemas/dbSchema';

import MongoDBConnection from './config/dbConfig';
import { morganMiddleware } from './api/middleware';
import logger from './config/logger';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerOptions from './config/swaggerConfig';

(async () => {
    logger.info('Creating database validation');
    const client = MongoDBConnection.getInstance();
    await client.connect();
    console.log('Trying to Preload data');
    await client.preloadData();
    await client.createOrUpdateValidation('users', userSchema);
    await client.createOrUpdateValidation('categories', categorySchema);
    await client.createOrUpdateValidation('products', productSchema);
    await client.createOrUpdateValidation('suppliers', supplierSchema);
    await client.createOrUpdateValidation('abobox', aboxSchema);
    await client.createOrUpdateValidation('orders', orderSchema);
    await client.createOrUpdateValidation('feedback', feedbackSchema);
    await client.closeConnection();
})().catch((error) => {
    logger.error(error);
});

process.on('SIGINT', async () => {
    logger.debug('SIGINT signal received: closing MongoDB connection');
    await MongoDBConnection.getInstance().closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.debug('SIGTERM signal received: closing MongoDB connection');
    await MongoDBConnection.getInstance().closeConnection();
    process.exit(0);
});

process.on('uncaughtException', async (error) => {
    logger.debug('Uncaught Exception:', error);
    await MongoDBConnection.getInstance().closeConnection();
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    logger.debug('Unhandled Rejection at:', promise, 'reason:', reason);
    await MongoDBConnection.getInstance().closeConnection();
    process.exit(1);
});

// Start the server
async function startApolloServer (typeDefs: any, resolvers: any): Promise<void> {
    // Define the port
    const PORT = process.env.PORT ?? 3000;

    const app = express();

    // Apply middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Apply Morgan middleware
    app.use(morganMiddleware);

    app.use(cors({
        origin: '*'
    }));

    // Generate swagger specs
    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/', indexRoutes);

    app.use('/api', apiRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/products', productRouter);
    app.use('/api/users', userRoutes);
    app.use('/api/supplier', supplierRoutes);
    app.use('/api/admin', adminRouter);

    const httpServer = http.createServer(app);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageLocalDefault({ embed: true })]
    });

    await server.start();

    server.applyMiddleware({ app });
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers).catch(error => { console.log(error); });
