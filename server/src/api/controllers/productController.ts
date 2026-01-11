import { type Request, type Response } from 'express';
import ProductService from '../services/productService';
import logger from '../../config/logger';

class ProductController {
    private readonly productService: ProductService;

    constructor () {
        this.productService = new ProductService();
    }

    async getProductById (req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.productId;
            const product = await this.productService.getProductById(productId);
            if (product != null) {
                res.json(product);
            } else {
                res.status(404).send({ error: 'Product not found' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async getAllProducts (req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.getAllProducts();
            if (products != null) {
                res.json(products);
            } else {
                res.status(404).send({ error: 'No products found' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async createProduct (req: Request, res: Response): Promise<void> {
        try {
            const product = req.body;
            console.log("here");
            const newProduct = await this.productService.createProduct(product);
            res.json(newProduct);
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateProductStock (req: Request, res: Response): Promise<void> {
        try {
            // the request body looks like this: {"supplierId":"617bf9b46c2b4e6d9f21c5e2","productId":"658ac56732b577fe8c74c81d","stockLevel":150}
            const { supplierId, productId, stockLevel } = req.body;
            const updatedProduct = await this.productService.updateProductStock(supplierId, productId, stockLevel);
            if (updatedProduct != null) {
                res.json(updatedProduct);
            } else {
                res.status(404).send({ error: 'Product not found' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async getInventory (req: Request, res: Response): Promise<void> {
        try {
            const inventory = await this.productService.getInventory();
            if (inventory != null) {
                res.json(inventory);
            } else {
                res.status(404).send({ error: 'No products found' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    async getProductsBySupplierId (req: Request, res: Response): Promise<void> {
        try {
            const supplierId = req.params.supplierId;
            const products = await this.productService.getProductsBySupplierId(supplierId);
            if (products != null) {
                res.json(products);
            } else {
                res.status(404).send({ error: 'No products found' });
            }
        } catch (error: any) {
            logger.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default ProductController;
