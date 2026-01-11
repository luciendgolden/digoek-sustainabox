/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
import debug from 'debug';
import { Router } from 'express';
import ApiController from '../controllers/apiController';
import { validateSchema } from '../middleware';
import { feedbackSchema } from '../schemas/requestSchema';

debug('server:http');

const router = Router();
const apiController = new ApiController();

/**
 * @swagger
 * /api/abobox:
 *   get:
 *     tags:
 *      - api
 *     summary: Retrieve a list of aboboxes
 *     description: Fetches a list of curated aboboxes containing various organic gourmet products.
 *     responses:
 *       200:
 *         description: A list of aboboxes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 6580cf9fe98f20fa5d10960f
 *                   boxType:
 *                     type: string
 *                     example: Organic Gourmet
 *                   size:
 *                     type: string
 *                     example: Small
 *                   price:
 *                     type: number
 *                     example: 15.98
 *                   products:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6580924be98f20fa5d1095ff
 *                         name:
 *                           type: string
 *                           example: Organic Almond Butter
 *                         description:
 *                           type: string
 *                           example: Creamy, organic almond butter made from locally sourced almonds.
 *                         productPrice:
 *                           type: number
 *                           example: 8.99
 *                         stockLevel:
 *                           type: integer
 *                           example: 80
 *                         categoryDetails:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 658062a7e98f20fa5d1095e1
 *                               type:
 *                                 type: string
 *                                 example: Organic Foods
 *                               description:
 *                                 type: string
 *                                 example: A variety of organic food products sourced from responsible, local providers in Austria. Focuses on natural and health-conscious choices.
 *                               seoTag:
 *                                 type: string
 *                                 example: organic-foods
 *                         supplierDetails:
 *                           type: array
 *                           items:
 *                             type: object
 */
// Get all available subscription box models with the products included
router.get('/abobox', (req, res) => apiController.getAboboxes(req, res));

/**
 * @swagger
 * /api/abobox/{id}:
 *   get:
 *     tags:
 *      - api
 *     summary: Retrieve a specific abobox by ID
 *     description: Fetches a detailed view of a specific abobox identified by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the abobox to retrieve.
 *         schema:
 *           type: string
 *           example: 6580cf9fe98f20fa5d10960f
 *     responses:
 *       200:
 *         description: Detailed information about the abobox.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 6580cf9fe98f20fa5d10960f
 *                 boxType:
 *                   type: string
 *                   example: Organic Gourmet
 *                 size:
 *                   type: string
 *                   example: Small
 *                 price:
 *                   type: number
 *                   example: 15.98
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6580924be98f20fa5d1095ff
 *                       name:
 *                         type: string
 *                         example: Organic Almond Butter
 *                       description:
 *                         type: string
 *                         example: Creamy, organic almond butter made from locally sourced almonds.
 *                       productPrice:
 *                         type: number
 *                         example: 8.99
 *                       stockLevel:
 *                         type: integer
 *                         example: 80
 *                       categoryDetails:
 *                         type: array
 *                         items:
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
 *                       supplierDetails:
 *                         type: array
 *                         items:
 *                           type: object
 *       404:
 *         description: Abobox not found.
 */
router.get('/abobox/:id', (req, res) => apiController.getAboboxById(req, res));

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - api
 *     summary: Retrieve list of product categories
 *     description: Fetches a list of all product categories, including details like type, description, and SEO tags.
 *     responses:
 *       200:
 *         description: An array of product categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 658062a7e98f20fa5d1095df
 *                   type:
 *                     type: string
 *                     example: Sustainable Household Goods
 *                   description:
 *                     type: string
 *                     example: Products designed to enhance sustainability in everyday household activities. Includes reusable, eco-friendly items.
 *                   seoTag:
 *                     type: string
 *                     example: eco-friendly-household
 */
// Get all categores
router.get('/categories', (req, res) => apiController.getCategories(req, res));

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     tags:
 *       - api
 *     summary: Collects customer feedback about a specific subscription box
 *     description: Allows customers to post feedback including ratings and comments for a specific aboBox.
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
 *                 description: The unique identifier for the user.
 *                 example: 658066a1dc3d736fc2bdbe2f
 *               aboBoxId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: The unique identifier for the aboBox being reviewed.
 *                 example: 6580cf9fe98f20fa5d10960f
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: The rating given by the user, from 1 (worst) to 5 (best).
 *               comment:
 *                 type: string
 *                 description: The comment provided by the user regarding their experience.
 *             required:
 *               - userId
 *               - aboBoxId
 *               - rating
 *               - comment
 *             additionalProperties: false
 *     responses:
 *       201:
 *         description: Feedback successfully received.
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Internal Server Error.
 */
// Collects customer feedback about a specific subscription box
router.post('/feedback', validateSchema(feedbackSchema), (req, res) => apiController.feedback(req, res));

/**
 * @swagger
 * /api/feedback:
 *   get:
 *     tags:
 *       - api
 *     summary: Retrieve all customer feedback
 *     description: Fetches a list of all feedback entries submitted by customers for various subscription boxes.
 *     responses:
 *       200:
 *         description: An array of feedback objects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 659c00792cb1b1b2cc076d37
 *                   userId:
 *                     type: string
 *                     example: 658066a1dc3d736fc2bdbe2f
 *                   aboBoxId:
 *                     type: string
 *                     example: 6580cf9fe98f20fa5d10960f
 *                   rating:
 *                     type: number
 *                     example: 5
 *                   comment:
 *                     type: string
 *                     example: Good comment
 *       500:
 *         description: Internal Server Error.
 */
// Get Feedback
router.get('/feedback', (req, res) => apiController.getFeedback(req, res));

export default router;
