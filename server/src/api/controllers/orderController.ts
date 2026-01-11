import { type Request, type Response } from 'express';
import OrderService from '../services/orderService';

class OrderController {
    private readonly orderService: OrderService;

    constructor () {
        this.orderService = new OrderService();
    }

    async getOrders (req: Request, res: Response): Promise<void> {
        try {
            const orders = await this.orderService.getOrders();
            res.status(200).json(orders);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOrderById (req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;
            const order = await this.orderService.getOrderById(orderId);
            res.status(200).json(order);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async createOrder (req: Request, res: Response): Promise<void> {
        try {
            const order = await this.orderService.createOrder(req.body);
            res.status(200).json(order);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateOrder (req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;
            const order = await this.orderService.updateOrder(orderId, req.body);
            res.status(200).json(order);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async cancelOrder (req: Request, res: Response): Promise<void> {
        try {
            const order = await this.orderService.cancelOrder();
            res.status(200).json(order);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSupplierTrendReport (req: Request, res: Response): Promise<void> {
        try {
            const supplierId = req.params.supplierId;
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const report = await this.orderService.getSupplierTrendReport(supplierId, startDate, endDate);
            res.status(200).json(report);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default OrderController;
