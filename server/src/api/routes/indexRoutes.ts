/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import ApiRepository from '../repositories/apiRepository';

const router = Router();

const apiRepository = new ApiRepository();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *      - home
 *     summary: Retrieve company information
 *     description: Returns detailed information about SustainaBox GmbH, including its mission, product categories, and focus.
 *     responses:
 *       200:
 *         description: A JSON object containing company information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companyInfo:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: SustainaBox GmbH
 *                     mission:
 *                       type: string
 *                       example: Providing eco-friendly subscription boxes with carefully selected sustainable products
 *                     productCategories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Sustainable Household Goods", "Zero-Waste Products", "Organic Foods", "Eco-friendly Fashion"]
 *                     focus:
 *                       type: string
 *                       example: Raising awareness for sustainable product usage
 *                     localSuppliers:
 *                       type: string
 *                       example: Responsible, local providers from Austria
 *                     productTransparency:
 *                       type: string
 *                       example: Traceable origins and production processes
 */
router.get('/', async (req, res) => {
    // get database category names
    const categories = await apiRepository.getCategories();

    // map categories to category.type array
    const categoryTypes = categories?.map(category => category.type) ?? [];

    res.json({
        companyInfo: {
            name: 'SustainaBox GmbH',
            mission: 'Providing eco-friendly subscription boxes with carefully selected sustainable products',
            productCategories: categoryTypes,
            focus: 'Raising awareness for sustainable product usage',
            localSuppliers: 'Responsible, local providers from Austria',
            productTransparency: 'Traceable origins and production processes'
        }
    });
});

export default router;
