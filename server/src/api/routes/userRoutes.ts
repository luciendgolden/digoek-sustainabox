/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import UserController from '../controllers/userController';
import { loginSchema, preferenceSchema, userSchema } from '../schemas/requestSchema';
import { validateSchema } from '../middleware';

const router = Router();
const userController = new UserController();

// TODO: add middleware to check if user is logged in

/**
 * @swagger
 * /api/users:
  *   get:
 *     tags:
 *       - users
 *     summary: Retrieve a list of users
 *     description: Get a list of all users with their details.
 *     responses:
 *       200:
 *         description: A list of user objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 658066a1dc3d736fc2bdbe2f
 *                   email:
 *                     type: string
 *                     example: user@example.com
 *                   password:
 *                     type: string
 *                     example: $2b$10$7/H19JloJNuYpIbnLlOH5e2DYfOJjgIaKFGHbiBdVYMiTByX8CUYy
 *                   firstName:
 *                     type: string
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     example: Doe
 *                   subscriptionStatus:
 *                     type: boolean
 *                     example: true
 *                   role:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: user
 *                       description:
 *                         type: string
 *                         example: Regular user with access to subscription boxes.
 *                   referredBy:
 *                     type: string
 *                     example: null
 *                   preferences:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         category:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 658062a7e98f20fa5d1095e1
 *                             type:
 *                               type: string
 *                               example: Organic Foods
 *                             description:
 *                               type: string
 *                               example: A variety of organic food products sourced from responsible, local providers in Austria. Focuses on natural and health-conscious choices.
 *                             seoTag:
 *                               type: string
 *                               example: organic-foods
 *                         preferenceLevel:
 *                           type: integer
 *                           example: 4
 *                         source:
 *                           type: string
 *                           example: user
 */
// Get all users
router.get('/', (req, res) => userController.getAllUsers(req, res));

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags:
 *       - users
 *     summary: Get a specific user by ID
 *     description: Retrieves detailed information about a specific user based on the provided unique identifier (userId).
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique identifier of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed information about the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 658066a1dc3d736fc2bdbe2f
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 password:
 *                   type: string
 *                   example: $2b$10$... (hashed)
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 subscriptionStatus:
 *                   type: boolean
 *                   example: true
 *                 role:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: user
 *                     description:
 *                       type: string
 *                       example: Regular user with access to subscription boxes.
 *                 referredBy:
 *                   type: string
 *                   example: null
 *                 preferences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           type:
 *                             type: string
 *                           description:
 *                             type: string
 *                           seoTag:
 *                             type: string
 *                       preferenceLevel:
 *                         type: number
 *                       source:
 *                         type: string
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
// Get a specific user by ID
router.get('/:userId', (req, res) => userController.getUserById(req, res));

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - users
 *     summary: Allows new users to register in the system
 *     description: Registers a new user in the system. Users must provide basic information such as name, email address, and password, then a new user account is created with their preferences.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/userSchema'
 *     responses:
 *       200:
 *         description: User successfully registered. Returns the newly created user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userSchema'
 *       400:
 *         description: Invalid input, object invalid.
 *       404:
 *         description: User not created.
 *       500:
 *         description: Internal Server Error.
 * components:
 *   schemas:
 *     userSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         subscriptionStatus:
 *           type: boolean
 *         role:
 *           $ref: '#/components/schemas/roleSchema'
 *         referredBy:
 *           type: ['string', 'null']
 *         preferences:
 *           $ref: '#/components/schemas/preferenceSchema'
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - preferences
 *       additionalProperties: false
 *
 *     roleSchema:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: ['user', 'admin', 'supplier']
 *         description:
 *           type: string
 *       required:
 *         - type
 *         - description
 *       additionalProperties: false
 *
 *     preferenceSchema:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           categoryId:
 *             type: string
 *             pattern: '^[0-9a-fA-F]{24}$'
 *           preferenceLevel:
 *             type: number
 *           source:
 *             type: string
 *             enum: ['user', 'system', 'registration']
 *         required:
 *           - categoryId
 *           - preferenceLevel
 *           - source
 *         additionalProperties: false
 */
// Allows new users to register in the system. Users must provide basic information such as name, email address and password, then a new user account is created with their preferences
router.post('/register', validateSchema(userSchema), (req, res) => userController.register(req, res));

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - users
 *     summary: Allows users to log in to the system
 *     description: Allows users to log in to the system using credentials such as email and password. If authentication is successful, an authentication token is returned, which is used for further authentication and authorization in subsequent API requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginSchema'
 *     responses:
 *       200:
 *         description: Authentication successful. Returns an authentication token and user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODA2NmExZGMzZDczNmZjMmJkYmUyZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA0NzM1MDcyLCJleHAiOjE3MDQ4MjE0NzJ9.RcIZW7XKlncUooLac0MfKyBvGcGoRNDISFe02MmWmOw
 *                 user:
 *                   $ref: '#/components/schemas/userDetails'
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Internal Server Error.
 * components:
 *   schemas:
 *     loginSchema:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *         password:
 *           type: string
 *           description: The user's password.
 *       required:
 *         - email
 *         - password
 *       additionalProperties: true
 *
 *     userDetails:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         subscriptionStatus:
 *           type: boolean
 *         role:
 *           type: object
 *         referredBy:
 *           type: [string, null]
 *         preferences:
 *           type: array
 *           items:
 *             type: object
 */
// Allows users to log in to the system using credentials such as email and password. If authentication is successful, an authentication token is returned, which is used for further authentication and authorization in further API requests
router.post('/login', validateSchema(loginSchema), (req, res) => userController.login(req, res));

/**
 * @swagger
 * /api/users/abobox/{userId}:
 *   get:
 *     tags:
 *       - users
 *     summary: Returns the list of subscription boxes that match the user's preferences
 *     description: Provides a list of subscription boxes tailored to the preferences of the user, taking into account their likes and dislikes, as well as other factors such as subscription status and previous choices.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique identifier of the user for whom the subscription box recommendations are being retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of recommended subscription boxes for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: 658066a1dc3d736fc2bdbe2f
 *                 recommended_boxes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       boxType:
 *                         type: string
 *                       size:
 *                         type: string
 *                       price:
 *                         type: number
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             description:
 *                               type: string
 *                             productPrice:
 *                               type: number
 *                             stockLevel:
 *                               type: number
 *                             categoryDetails:
 *                               type: array
 *                             supplierDetails:
 *                               type: array
 *                       weight:
 *                         type: number
 *       404:
 *         description: No subscription boxes found matching the user's preferences.
 *       500:
 *         description: Internal Server Error.
 */
// Returns the list of subscription boxes that match the user's preferences
router.get('/abobox/:userId', (req, res) => userController.recommendAboBox(req, res));

/**
 * @swagger
 * /api/users/preferences/{userId}:
 *   patch:
 *     tags:
 *       - users
 *     summary: Allows users to update their preferences
 *     description: Enables users to modify their preferences for categories and other settings in an idempotent manner using a PATCH request.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique identifier of the user whose preferences are being updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/preferenceSchema'
 *     responses:
 *       200:
 *         description: User preferences successfully updated. Returns the updated user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 preferences:
 *                   $ref: '#/components/schemas/preferenceSchema'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 * components:
 *   schemas:
 *     preferenceSchema:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           categoryId:
 *             type: string
 *             pattern: '^[0-9a-fA-F]{24}$'
 *             description: The unique identifier of the category for which the preference is being set.
 *           preferenceLevel:
 *             type: number
 *             description: The level of preference the user has for the category.
 *           source:
 *             type: string
 *             enum: ['user', 'system', 'registration']
 *             description: The source from which the preference originates.
 *         required:
 *           - categoryId
 *           - preferenceLevel
 *           - source
 *         additionalProperties: false
 */
// Allows users to update their preferences with idempotent PUT requests
router.patch('/preferences/:userId', validateSchema(preferenceSchema), (req, res) => userController.updatePreferences(req, res));

/**
 * @swagger
 * /api/users/preferences/{userId}:
 *   delete:
 *     tags:
 *       - users
 *     summary: Allows users to delete their preferences
 *     description: Permits users to remove all their stored preferences, effectively resetting their preference settings to the default state.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique identifier of the user whose preferences are being deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User preferences successfully deleted.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
// Allows users to delete their preferences
router.delete('/preferences/:userId', (req, res) => userController.deletePreferences(req, res));

export default router;
