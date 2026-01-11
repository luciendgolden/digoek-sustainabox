/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import OrderController from '../controllers/orderController';
import { validateSchema } from '../middleware';
import { orderSchema } from '../schemas/requestSchema';

const router = Router();
const orderController = new OrderController();

/**
 * @swagger
 * /api/orders/boxes:
 *   post:
 *     tags:
 *       - orders
 *     summary: Allows the user to purchase subscription boxes
 *     description: Creates an order for one or more subscription boxes or products based on the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: The unique identifier of the user.
 *               orderDate:
 *                 type: string
 *                 format: 'date-time'
 *                 description: The date and time when the order was placed.
 *               paymentMethod:
 *                 type: string
 *                 description: The method of payment for the order.
 *               deliveryAddress:
 *                 type: string
 *                 description: The address to which the order will be delivered.
 *               type:
 *                 type: string
 *                 enum: ['aboBox', 'product']
 *                 description: The type of order, either a subscription box or a product.
 *               orderStatus:
 *                 type: string
 *                 enum: ['pending', 'completed', 'cancelled']
 *                 description: The current status of the order.
 *               items:
 *                 type: array
 *                 items:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/orderAboBoxItemSchema'
 *                     - $ref: '#/components/schemas/orderProductItemSchema'
 *             required:
 *               - userId
 *               - paymentMethod
 *               - deliveryAddress
 *               - type
 *               - items
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Order successfully created. Returns the created order object.
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Internal Server Error.
 * components:
 *   schemas:
 *     orderAboBoxItemSchema:
 *       type: object
 *       properties:
 *         aboBoxId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         quantity:
 *           type: number
 *         orderPrice:
 *           type: number
 *           exclusiveMinimum: 0
 *         subscriptionStatus:
 *           type: string
 *           enum: ['pending', 'active', 'expired', 'cancelled']
 *         subscription_months:
 *           type: number
 *           minimum: 1
 *       required:
 *         - aboBoxId
 *         - quantity
 *         - orderPrice
 *         - subscription_months
 *       additionalProperties: false
 *     orderProductItemSchema:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         quantity:
 *           type: number
 *         orderPrice:
 *           type: number
 *           exclusiveMinimum: 0
 *       required:
 *         - productId
 *         - quantity
 *         - orderPrice
 *       additionalProperties: false
 */
// Allows the user to purchase the subscription boxes
router.post('/boxes', validateSchema(orderSchema), (req, res) => orderController.createOrder(req, res));

/**
 * @swagger
 * tags:
 *   name: api
 *   description: API for SustainaBox application
 *
 * components:
 *   schemas:
 *     orderAboBoxItemSchema:
 *       type: object
 *       properties:
 *         aboBoxId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           description: MongoDB ObjectId as a string for the aboBox
 *         quantity:
 *           type: number
 *           description: Quantity of the aboBox ordered
 *         orderPrice:
 *           type: number
 *           exclusiveMinimum: 0
 *           description: Price of the order for the specific aboBox
 *         subscriptionStatus:
 *           type: string
 *           enum: ['pending', 'active', 'expired', 'cancelled']
 *           description: Subscription status of the aboBox
 *         subscription_months:
 *           type: number
 *           minimum: 1
 *           description: Number of months for the subscription
 *       required:
 *         - aboBoxId
 *         - quantity
 *         - orderPrice
 *         - subscription_months
 *       additionalProperties: false
 *
 *     orderProductItemSchema:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           description: MongoDB ObjectId as a string for the product
 *         quantity:
 *           type: number
 *           description: Quantity of the product ordered
 *         orderPrice:
 *           type: number
 *           exclusiveMinimum: 0
 *           description: Price of the order for the specific product
 *       required:
 *         - productId
 *         - quantity
 *         - orderPrice
 *       additionalProperties: false
 *
 *     orderSchema:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           description: MongoDB ObjectId as a string for the user
 *         orderDate:
 *           type: string
 *           format: 'date-time'
 *           description: Date and time when the order was placed
 *         paymentMethod:
 *           type: string
 *           description: Payment method for the order
 *         deliveryAddress:
 *           type: string
 *           description: Delivery address for the order
 *         type:
 *           type: string
 *           enum: ['aboBox', 'product']
 *           description: Type of order (aboBox or product)
 *         orderStatus:
 *           type: string
 *           enum: ['pending', 'completed', 'cancelled']
 *           description: Current status of the order
 *         items:
 *           type: 'array'
 *           items:
 *             oneOf:
 *               - $ref: '#/components/schemas/orderAboBoxItemSchema'
 *               - $ref: '#/components/schemas/orderProductItemSchema'
 *       required:
 *         - userId
 *         - paymentMethod
 *         - deliveryAddress
 *         - type
 *         - items
 *       additionalProperties: false
 *
 * /api/orders/boxes/{id}:
 *   put:
 *     tags:
 *       - orders
 *     summary: Allows the admin to update the order
 *     description: Updates an existing order with the provided details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the order to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/orderSchema'
 *     responses:
 *       200:
 *         description: Order successfully updated. Returns the updated order object.
 *       400:
 *         description: Invalid input, object invalid.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal Server Error.
 */
// Allows the admin to update the order
router.put('/boxes/:id', validateSchema(orderSchema), (req, res) => orderController.updateOrder(req, res));

/**
 * @swagger
 * /api/orders/products:
 *   post:
 *     tags:
 *       - orders
 *     summary: Creates an order for the respective products to the suppliers
 *     description: Places an order with detailed information about products or subscription boxes, user, and delivery.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: The unique identifier of the user placing the order.
 *               orderDate:
 *                 type: string
 *                 format: 'date-time'
 *                 description: The date and time when the order was placed.
 *               paymentMethod:
 *                 type: string
 *                 description: The method of payment for the order.
 *               deliveryAddress:
 *                 type: string
 *                 description: The address to which the order will be delivered.
 *               type:
 *                 type: string
 *                 enum: ['aboBox', 'product']
 *                 description: The type of order, either a subscription box or a product.
 *               orderStatus:
 *                 type: string
 *                 enum: ['pending', 'completed', 'cancelled']
 *                 description: The current status of the order.
 *               items:
 *                 type: array
 *                 items:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/orderAboBoxItemSchema'
 *                     - $ref: '#/components/schemas/orderProductItemSchema'
 *             required:
 *               - userId
 *               - paymentMethod
 *               - deliveryAddress
 *               - type
 *               - items
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Order successfully created. Returns the created order object.
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Internal Server Error.
 * components:
 *   schemas:
 *     orderAboBoxItemSchema:
 *       type: object
 *       properties:
 *         aboBoxId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         quantity:
 *           type: number
 *         orderPrice:
 *           type: number
 *           exclusiveMinimum: 0
 *         subscriptionStatus:
 *           type: string
 *           enum: ['pending', 'active', 'expired', 'cancelled']
 *         subscription_months:
 *           type: number
 *           minimum: 1
 *       required:
 *         - aboBoxId
 *         - quantity
 *         - orderPrice
 *         - subscription_months
 *       additionalProperties: false
 *
 *     orderProductItemSchema:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         quantity:
 *           type: number
 *         orderPrice:
 *           type: number
 *           exclusiveMinimum: 0
 *       required:
 *         - productId
 *         - quantity
 *         - orderPrice
 *       additionalProperties: false
 *
 *     orderSchema:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         orderDate:
 *           type: string
 *           format: 'date-time'
 *         paymentMethod:
 *           type: string
 *         deliveryAddress:
 *           type: string
 *         type:
 *           type: string
 *           enum: ['aboBox', 'product']
 *         orderStatus:
 *           type: string
 *           enum: ['pending', 'completed', 'cancelled']
 *         items:
 *           type: 'array'
 *           items:
 *             oneOf:
 *               - $ref: '#/components/schemas/orderAboBoxItemSchema'
 *               - $ref: '#/components/schemas/orderProductItemSchema'
 *       required:
 *         - userId
 *         - paymentMethod
 *         - deliveryAddress
 *         - type
 *         - items
 *       additionalProperties: false
 */
// Creates an order for the respective products to the suppliers
router.post('/products', validateSchema(orderSchema), (req, res) => orderController.createOrder(req, res));

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - orders
 *     summary: Gets all the orders
 *     description: Retrieves a list of all orders placed, including details for each order.
 *     responses:
 *       200:
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 659c02bc0712310e4a48d696
 *                   userId:
 *                     type: string
 *                     example: 658066a1dc3d736fc2bdbe2f
 *                   orderDate:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-08T14:12:12.891Z
 *                   paymentMethod:
 *                     type: string
 *                     example: Credit Card
 *                   deliveryAddress:
 *                     type: string
 *                     example: 123 Main St, Anytown, AT 12345
 *                   type:
 *                     type: string
 *                     enum: [aboBox, product]
 *                     example: aboBox
 *                   orderStatus:
 *                     type: string
 *                     enum: [pending, completed, cancelled]
 *                     example: completed
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         aboBoxId:
 *                           type: string
 *                           example: 6580cf9fe98f20fa5d10960e
 *                         quantity:
 *                           type: number
 *                           example: 1
 *                         orderPrice:
 *                           type: number
 *                           example: 36.98
 *                         subscriptionStatus:
 *                           type: string
 *                           enum: [pending, active, expired, cancelled]
 *                           example: active
 *                         subscription_months:
 *                           type: number
 *                           example: 12
 *       500:
 *         description: Internal Server Error.
 */
// Gets all the orders
router.get('/', (req, res) => orderController.getOrders(req, res));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - orders
 *     summary: Gets an order by ID
 *     description: Retrieves detailed information about a specific order based on the provided unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the order to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed information about the order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 659c02bc0712310e4a48d696
 *                 userId:
 *                   type: string
 *                   example: 658066a1dc3d736fc2bdbe2f
 *                 orderDate:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-08T14:12:12.891Z
 *                 paymentMethod:
 *                   type: string
 *                   example: Credit Card
 *                 deliveryAddress:
 *                   type: string
 *                   example: 123 Main St, Anytown, AT 12345
 *                 type:
 *                   type: string
 *                   enum: [aboBox, product]
 *                   example: aboBox
 *                 orderStatus:
 *                   type: string
 *                   enum: [pending, completed, cancelled]
 *                   example: completed
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       aboBoxId:
 *                         type: string
 *                         example: 6580cf9fe98f20fa5d10960e
 *                       quantity:
 *                         type: number
 *                         example: 1
 *                       orderPrice:
 *                         type: number
 *                         example: 36.98
 *                       subscriptionStatus:
 *                         type: string
 *                         enum: [pending, active, expired, cancelled]
 *                         example: active
 *                       subscription_months:
 *                         type: number
 *                         example: 12
 *       400:
 *         description: Invalid ID supplied.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal Server Error.
 */
// Gets an order by id
router.get('/:id', (req, res) => orderController.getOrderById(req, res));

export default router;
