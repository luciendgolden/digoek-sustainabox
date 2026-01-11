/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import ProductController from '../controllers/productController';
import { validateSchema } from '../middleware';
import { productSchema, productStockSchema } from '../schemas/requestSchema';

const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - products
 *     summary: Returns a list of all products
 *     description: Retrieves a complete list of all products available in the system, including details like name, description, price, and stock level.
 *     responses:
 *       200:
 *         description: An array of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 6580924be98f20fa5d1095fb
 *                   name:
 *                     type: string
 *                     example: Biodegradable Cleaning Sponges
 *                   description:
 *                     type: string
 *                     example: Eco-friendly, biodegradable sponges made from natural fibers, ideal for household cleaning.
 *                   productPrice:
 *                     type: number
 *                     example: 4.99
 *                   stockLevel:
 *                     type: number
 *                     example: 150
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 658062a7e98f20fa5d1095df
 *                         type:
 *                           type: string
 *                           example: Sustainable Household Goods
 *                         description:
 *                           type: string
 *                           example: Products designed to enhance sustainability in everyday household activities. Includes reusable, eco-friendly items.
 *                         seoTag:
 *                           type: string
 *                           example: eco-friendly-household
 *                   supplierId:
 *                     type: string
 *                     example: 6580753be98f21fa5d1095cc
 *       500:
 *         description: Internal Server Error.
 */
// Returns a list of all products
router.get('/', (req, res) => productController.getAllProducts(req, res));

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - products
 *     summary: Adds new products to the system
 *     description: Adds new products that can be purchased from suppliers or added by the system administrator.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               description:
 *                 type: string
 *                 description: A brief description of the product.
 *               productPrice:
 *                 type: number
 *                 description: The price of the product.
 *               stockLevel:
 *                 type: number
 *                 description: The available stock level of the product.
 *               categories:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/category'
 *                 description: A list of categories the product belongs to.
 *               supplierId:
 *                 type: string
 *                 description: The unique identifier of the supplier providing the product.
 *             required:
 *               - name
 *               - description
 *               - productPrice
 *               - stockLevel
 *               - categories
 *               - supplierId
 *             additionalProperties: false
 *     responses:
 *       201:
 *         description: Product successfully added to the system.
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Internal Server Error.
 * components:
 *   schemas:
 *     category:
 *       type: string
 *       description: The category of the product.
 */
// Adds new products to the system. Products can be purchased from suppliers or from the system administrator added
router.post('/', validateSchema(productSchema), (req, res) => productController.createProduct(req, res));

/**
 * @swagger
 * /api/products/inventory:
 *   get:
 *     tags:
 *       - products
 *     summary: Returns a list of all products with their inventory
 *     description: Retrieves a list of all products available in the system along with details like name, price, stock level, and supplier ID.
 *     responses:
 *       200:
 *         description: An array of product inventory details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 6580924be98f20fa5d1095fb
 *                   name:
 *                     type: string
 *                     example: Biodegradable Cleaning Sponges
 *                   productPrice:
 *                     type: number
 *                     example: 4.99
 *                   stockLevel:
 *                     type: number
 *                     example: 150
 *                   supplierId:
 *                     type: string
 *                     example: 658067c30f59b9f937111be8
 *       500:
 *         description: Internal Server Error.
 */
// Returns a list of all products with their inventory
router.get('/inventory', (req, res) => productController.getInventory(req, res));

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       - products
 *     summary: Returns the details of a specific product
 *     description: Retrieves detailed information about a specific product based on the provided unique identifier (productId).
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The unique identifier of the product to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed information about the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 6580924be98f20fa5d1095fb
 *                 name:
 *                   type: string
 *                   example: Biodegradable Cleaning Sponges
 *                 description:
 *                   type: string
 *                   example: Eco-friendly, biodegradable sponges made from natural fibers, ideal for household cleaning.
 *                 productPrice:
 *                   type: number
 *                   example: 4.99
 *                 stockLevel:
 *                   type: number
 *                   example: 150
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 658062a7e98f20fa5d1095df
 *                       type:
 *                         type: string
 *                         example: Sustainable Household Goods
 *                       description:
 *                         type: string
 *                         example: Products designed to enhance sustainability in everyday household activities. Includes reusable, eco-friendly items.
 *                       seoTag:
 *                         type: string
 *                         example: eco-friendly-household
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal Server Error.
 */
// Returns the details of a specific product
router.get('/:productId', (req, res) => productController.getProductById(req, res));

/**
 * @swagger
 * /api/products/stock:
 *   put:
 *     tags:
 *       - products
 *     summary: The inventory can be updated by the supplier for their respective products
 *     description: Allows suppliers to update the stock level for a specific product they supply.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/productStockSchema'
 *     responses:
 *       200:
 *         description: Product stock successfully updated. Returns the updated product details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 productPrice:
 *                   type: number
 *                 stockLevel:
 *                   type: number
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                 supplierId:
 *                   type: string
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal Server Error.
 * components:
 *   schemas:
 *     productStockSchema:
 *       type: object
 *       properties:
 *         supplierId:
 *           type: string
 *           description: The unique identifier of the supplier updating the stock.
 *         productId:
 *           type: string
 *           description: The unique identifier of the product for which stock is being updated.
 *         stockLevel:
 *           type: number
 *           description: The new stock level for the product.
 *       required:
 *         - productId
 *         - stockLevel
 *       additionalProperties: false
 */
// The inventory can be updated by the supplier for their respective products
router.put('/stock', validateSchema(productStockSchema), (req, res) => productController.updateProductStock(req, res));

export default router;
