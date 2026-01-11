import { ObjectId, type WithId } from 'mongodb';
import MongoDBConnection from '../../config/dbConfig';
import { type Product } from '../models';
import { aggregateProductsWithCategoriesAndSuppliers } from '../helpers/utility';

class ProductRepository {
    private readonly client: MongoDBConnection;

    constructor () {
        this.client = MongoDBConnection.getInstance();
    }

    async getAllProducts (): Promise<Array<WithId<Product>> | null> {
        try {
            await this.client.connect();
            const products = this.client.database?.collection<Product>('products');
            const allProducts = await products?.find().toArray();

            return allProducts ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getAllProductDetails (): Promise<any[] | null> {
        try {
            await this.client.connect();
            const products = this.client.database?.collection<Product>('products');
            const productDetails = await products?.aggregate(aggregateProductsWithCategoriesAndSuppliers).toArray();
            return productDetails ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getProductById (productId: string): Promise<WithId<Product> | null> {
        try {
            await this.client.connect();
            const products = this.client.database?.collection<Product>('products');
            const product = await products?.findOne({ _id: new ObjectId(productId) });
            return product ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getProductDetailsById (productId: string): Promise<any | null> {
        try {
            await this.client.connect();
            const products = this.client.database?.collection<Product>('products');
            const productDetails = await products?.aggregate([
                {
                    $match: {
                        _id: new ObjectId(productId)
                    }
                },
                ...aggregateProductsWithCategoriesAndSuppliers
            ]).toArray();
            return productDetails ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async createProduct (product: Product): Promise<Product | null> {
        try {
            await this.client.connect();
            console.log('Product to be inserted:', product);
            const products = this.client.database?.collection<Product>('products');
            const insertedProduct = await products?.insertOne(product);
            return insertedProduct?.insertedId ? { ...product, _id: insertedProduct.insertedId } as Product : null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getProductDetailsByName (productName: string): Promise<any | null> {
        try {
            await this.client.connect();
            const products = this.client.database?.collection<Product>('products');
            const productDetails = await products?.aggregate([
                {
                    $match: {
                        name: productName
                    }
                },
                ...aggregateProductsWithCategoriesAndSuppliers
            ]).toArray();
            return productDetails ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async updateProductStock (supplierId: string, productId: string, stockLevel: number): Promise<Product | null> {
        try {
            await this.client.connect();
            const products = this.client.database?.collection<Product>('products');
            const updatedProduct = await products?.findOneAndUpdate(
                {
                    _id: new ObjectId(productId),
                    supplierId: new ObjectId(supplierId)
                },
                {
                    $set: {
                        stockLevel
                    }
                }
            );
            return updatedProduct ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getInventory (): Promise<any | null> {
        // return all products with their stockLevel
        try {
            await this.client.connect();
            const products = this.client.database?.collection<Product>('products');
            const inventory = await products?.aggregate([
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        stockLevel: 1,
                        supplierId: 1,
                        productPrice: 1
                    }
                }
            ]).toArray();
            return inventory ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getProductsBySupplierId (supplierId: string): Promise<Array<WithId<Product>> | null> {
        try {
            await this.client.connect();
            const products = this.client.database?.collection<Product>('products');
            const supplierProducts = await products?.find({ supplierId: new ObjectId(supplierId) }).toArray();
            return supplierProducts ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }

    async getCategoryById (categoryId: string): Promise<any | null> {
        try {
            await this.client.connect();
            const categories = this.client.database?.collection('categories');
            const category = await categories?.findOne({ _id: new ObjectId(categoryId) });
            return category ?? null;
        } finally {
            await this.client.closeConnection();
        }
    }
}

export default ProductRepository;
