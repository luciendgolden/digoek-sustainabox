/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { validateSchema } from '../middleware';
import { supplierTrendReportSchema } from '../schemas/requestSchema';
import OrderController from '../controllers/orderController';
import ProductController from '../controllers/productController';

const router = Router();
const orderController = new OrderController();
const productController = new ProductController();
// Registers a new supplier
// router.post('/', validateSchema(supplierSchema), (req, res) => userController.registerSupplier(req, res));

/**
 * @swagger
 * /api/supplier/{supplierId}/trends:
 *   post:
 *     tags:
 *       - suppliers
 *     summary: Provides information about subscription trends for the supplier's products
 *     description: Provides a report on the trends of subscriptions and orders for the supplier's products over a specified time period. The quantity of products represents the sum of all products ordered individually or as part of an abo box (subscription months * order quantity).
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         description: The unique identifier of the supplier for whom the trend report is being generated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/supplierTrendReportSchema'
 *     responses:
 *       200:
 *         description: Successfully retrieved the trend report for the supplier.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 // Define the structure of the report object here based on how it's returned from your service
 *       400:
 *         description: Invalid input, object invalid.
 *       404:
 *         description: Supplier not found.
 *       500:
 *         description: Internal Server Error.
 * components:
 *   schemas:
 *     supplierTrendReportSchema:
 *       type: object
 *       properties:
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date for the trend analysis period.
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: End date for the trend analysis period.
 *       required:
 *         - startDate
 *         - endDate
 *       additionalProperties: false
 */
// Provides information about subscription trends for the supplier's products. The quantity of products represent the sum of all products ordered as individual product, or as part of an abo box (subscription months * order quantity).
router.post('/:supplierId/trends', validateSchema(supplierTrendReportSchema), (req, res) => orderController.getSupplierTrendReport(req, res));

/**
 * @swagger
 * /api/supplier/{supplierId}:
 *   get:
 *     tags:
 *       - suppliers
 *     summary: Returns products associated with a specific supplier
 *     description: Retrieves a list of products provided by a specific supplier based on the supplier's unique identifier.
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         description: The unique identifier of the supplier whose products are being retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An array of products provided by the specific supplier.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   productPrice:
 *                     type: number
 *                   stockLevel:
 *                     type: number
 *                   categories:
 *                     type: array
 *                     items:
 *                       type: object
 *                   supplierId:
 *                     type: string
 *       404:
 *         description: No products found for the specified supplier.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:supplierId', (req, res) => productController.getProductsBySupplierId(req, res));

export default router;
