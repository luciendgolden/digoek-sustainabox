import { type ObjectId } from 'mongodb';

// Collection
interface User {
    email: string
    password: string
    firstName: string
    lastName: string
    subscriptionStatus: boolean
    role: Role
    referredBy: ObjectId | null
    preferences: Preference[]
}

interface Role {
    type: string
    description: string
}

interface Preference {
    categoryId: ObjectId
    preferenceLevel: number
    source: string
}

// Collection
interface Category {
    type: string
    description: string
    seoTag: string
}

// Collection
interface AboBox {
    boxType: string
    size: string
    price: number
    // growth of the relationship determined see https://www.mongodb.com/docs/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/
    products: ObjectId[]
}

interface Feedback {
    userId: ObjectId
    // To avoid mutable, growing arrays in AboBox see https://www.mongodb.com/docs/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/
    aboBoxId: ObjectId
    rating: number
    comment: string
}

// Collection
interface Product {
    name: string
    description: string
    productPrice: number
    stockLevel: number
    categories: ObjectId[]
    // To avoid mutable, growing arrays in Supplier see https://www.mongodb.com/docs/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/
    supplierId: ObjectId
}

// Collection
interface Supplier {
    name: string
    email: string
    address: string
    isPartner: boolean
}

// Collection
interface Order {
    userId: ObjectId
    orderDate: Date
    paymentMethod: string
    deliveryAddress: string
    type: 'aboBox' | 'product'
    orderStatus: 'pending' | 'completed' | 'cancelled'
    items: OrderAboBoxItem[] | OrderProductItem[]
}

interface OrderAboBoxItem {
    aboBoxId: ObjectId
    quantity: number
    orderPrice: number
    subscriptionStatus: 'pending' | 'active' | 'expired' | 'cancelled'
    subscription_months: number
}

interface OrderProductItem {
    productId: ObjectId
    quantity: number
    orderPrice: number
}

interface ReportObject {
    productId: ObjectId
    quantity: number
    productName: string
}

export type {
    User,
    Role,
    AboBox,
    Feedback,
    Product,
    Category,
    Supplier,
    Preference,
    Order,
    OrderAboBoxItem,
    OrderProductItem,
    ReportObject
};
