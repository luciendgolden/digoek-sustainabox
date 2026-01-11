import { ObjectId, type UpdateResult, type WithId } from 'mongodb';
import OrderRepository from '../repositories/orderRepository';
import { type OrderProductItem, type Order, type OrderAboBoxItem, Product, type ReportObject } from '../models';
import ApiRepository from '../repositories/apiRepository';
import ProductRepository from '../repositories/productRepository';

class OrderService {
    private readonly orderRepository: OrderRepository;
    private readonly apiRepository: ApiRepository;
    private readonly productRepository: ProductRepository;

    constructor () {
        this.orderRepository = new OrderRepository();
        this.apiRepository = new ApiRepository();
        this.productRepository = new ProductRepository();
    }

    async getOrders (): Promise<Array<WithId<Order>> | null> {
        const orders = await this.orderRepository.getOrders();

        if (orders == null) {
            throw new Error('No orders found');
        }

        return orders;
    }

    async getOrderById (orderId: string): Promise<WithId<Order> | null> {
        const order = await this.orderRepository.getOrderById(orderId);

        if (order == null) {
            throw new Error('No order found');
        }

        return order;
    }

    async createOrder (obj: any): Promise<{ _id: ObjectId } | null> {
        let items: OrderAboBoxItem[] | OrderProductItem[] = [];

        if (obj.type === 'aboBox') {
            items = obj.items.map((item: OrderAboBoxItem) => {
                return {
                    aboBoxId: new ObjectId(item.aboBoxId),
                    quantity: item.quantity,
                    orderPrice: item.orderPrice,
                    subscriptionStatus: 'pending',
                    subscription_months: item.subscription_months
                } satisfies OrderAboBoxItem;
            });
        }

        if (obj.type === 'product') {
            items = obj.items.map((item: OrderProductItem) => {
                return {
                    productId: new ObjectId(item.productId),
                    quantity: item.quantity,
                    orderPrice: item.orderPrice
                } satisfies OrderProductItem;
            });
        }

        const order: Order = {
            userId: new ObjectId(String(obj.userId)),
            orderDate: new Date(),
            paymentMethod: obj.paymentMethod,
            deliveryAddress: obj.deliveryAddress,
            type: obj.type,
            orderStatus: 'pending',
            items
        } satisfies Order;

        const idObj = await this.orderRepository.createOrder(order);

        if (idObj == null) {
            throw new Error('Order could not be created');
        }

        return idObj;
    }

    async updateOrder (orderId: string, obj: any): Promise<UpdateResult<Order> | null> {
        // check if order exists
        const existingOrder = await this.orderRepository.getOrderById(orderId);

        if (existingOrder == null) {
            throw new Error('Order does not exist');
        }

        if (obj.items != null && obj.items.length > 0) {
            for (const item of obj.items) {
                if ('aboBoxId' in item) {
                    item.aboBoxId = new ObjectId(String(item.aboBoxId));
                }

                if ('productId' in item) {
                    item.productId = new ObjectId(String(item.productId));
                }
            }
        }

        const order = {
            userId: new ObjectId(String(obj.userId)),
            orderDate: new Date(String(obj.orderDate)),
            paymentMethod: obj.paymentMethod,
            deliveryAddress: obj.deliveryAddress,
            type: obj.type,
            orderStatus: obj.orderStatus,
            items: obj.items
        } satisfies Order;

        const updatedOrder = await this.orderRepository.updateOrder(orderId, order);

        if (updatedOrder == null) {
            throw new Error('Order could not be updated');
        }

        return updatedOrder;
    }

    async cancelOrder (): Promise<any> {
        return 'deleteOrder';
    }

    async getSupplierTrendReport (supplierId: string, startDate: string, endDate: string): Promise<any> {
        // get all the products of the supplier
        const products = await this.productRepository.getProductsBySupplierId(supplierId);

        if (products == null) {
            throw new Error('No products found');
        }

        // create an array of the product ids
        const supplierproductIds: string[] = [];
        for (const product of products) {
            supplierproductIds.push(String(product._id));
        }

        // get all the orders between the start and end date
        const orders = await this.orderRepository.getOrdersByDate(startDate, endDate);
        if (orders == null) {
            throw new Error('No Orders found for the given dates');
        }

        // get all the order items of the supplier
        const supplierOrderProducts: ReportObject[] = [];
        for (const order of orders) {
            for (const item of order.items) {
                if ('productId' in item) {
                    // product
                    if (supplierproductIds.includes(String(item.productId))) {
                        // get name of the product
                        const product = await this.productRepository.getProductById(String(item.productId));
                        if (product == null) {
                            throw new Error('No product found');
                        }
                        // create a map of the product id, product name and order quantity
                        const productMap = { productId: item.productId, productName: product.name, quantity: item.quantity };
                        supplierOrderProducts.push(productMap);
                    }
                }
                if ('aboBoxId' in item) {
                    // get adoboxid
                    const aboBoxId = item.aboBoxId;
                    const tempQuantity = item.quantity;
                    const tempSubscriptionMonths = item.subscription_months;
                    // get the abobox
                    const abobox = await this.apiRepository.getAboboxProductsByAboboxId(String(aboBoxId));
                    if (abobox == null) {
                        throw new Error('No abobox with the id provided in the order found');
                    }
                    const aboboxProducts = abobox.products;
                    for (const product of aboboxProducts) {
                        // get product with id
                        const productDetails = await this.productRepository.getProductById(String(product));
                        if (productDetails == null) {
                            throw new Error('No product with the id provided in the abobox found found');
                        }
                        // check if the product is from the supplier
                        if (supplierproductIds.includes(String(product))) {
                            // create a map of the product id, product name and order quantity
                            const productMap = { productId: product, productName: productDetails.name, quantity: tempQuantity * tempSubscriptionMonths };
                            supplierOrderProducts.push(productMap);
                        }
                    }
                }
            }
        }
        // if there are duplicate products, add the quantities
        for (let i = 0; i < supplierOrderProducts.length; i++) {
            for (let j = i + 1; j < supplierOrderProducts.length; j++) {
                if (String(supplierOrderProducts[i].productId) === String(supplierOrderProducts[j].productId)) {
                    supplierOrderProducts[i].quantity += supplierOrderProducts[j].quantity;
                    supplierOrderProducts.splice(j, 1);
                }
            }
        }

        return supplierOrderProducts;
    }
}

export default OrderService;
