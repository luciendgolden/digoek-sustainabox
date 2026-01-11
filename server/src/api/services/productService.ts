import { type Product } from '../models';
import ProductRepository from '../repositories/productRepository';
import { ObjectId } from 'mongodb';

class ProductService {
    private readonly productRepository: ProductRepository;

    constructor () {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts (): Promise<Product[] | null> {
        return await this.productRepository.getAllProductDetails();
    }

    async getProductById (productId: string): Promise<Product | null> {
        return await this.productRepository.getProductDetailsById(productId);
    }

    async getProductByName (productName: string): Promise<Product | null> {
        return await this.productRepository.getProductDetailsByName(productName);
    }

    async createProduct (product: Product): Promise<Product | null> {
        // check if product with same name exists
        const existingProduct = await this.productRepository.getProductDetailsByName(product.name);
        if (existingProduct.length > 0) {
            console.log('Product with same name already exists');
            return null;
        }

        // convert objects in categories array to ObjectIds
        const categories = product.categories.map((category) => {
            return new ObjectId(category);
        });

        const newProduct: Product = {
            name: product.name,
            description: product.description,
            productPrice: product.productPrice,
            stockLevel: product.stockLevel,
            categories,
            supplierId: new ObjectId(String(product.supplierId))
        } satisfies Product;

        return await this.productRepository.createProduct(newProduct);
    }

    async updateProductStock (supplierId: string, productId: string, stockLevel: number): Promise<Product | null> {
        const product = await this.productRepository.getProductById(productId);
        if (product == null) {
            return null;
        }
        console.log('Product supplier id:', product.supplierId.toString());
        if (product.supplierId.toString() !== supplierId) {
            return null;
        }

        const updatedProduct = await this.productRepository.updateProductStock(supplierId, productId, stockLevel);
        if (updatedProduct != null) {
            return updatedProduct;
        } else {
            return null;
        }
    }

    async getInventory (): Promise<any | null> {
        return await this.productRepository.getInventory();
    }

    async getProductsBySupplierId (supplierId: string): Promise<Product[] | null> {
        const prods = await this.productRepository.getProductsBySupplierId(supplierId);
        if (prods == null) {
            return null;
        }
        //for each product, get the categories
        for (let i = 0; i < prods.length; i++) {
            const categorieIds = prods[i].categories; // Access the categories property on each product
            for (let j = 0; j < categorieIds.length; j++) {
                const cat = await this.productRepository.getCategoryById(categorieIds[j].toString()); // Convert ObjectId to string
                prods[i].categories[j] = cat;
            }
        }
        return prods;
    }
}

export default ProductService;
