const feedbackSchema = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        aboBoxId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        rating: { type: 'number', minimum: 1, maximum: 5 },
        comment: { type: 'string' }
    },
    required: ['userId', 'aboBoxId', 'rating', 'comment'],
    additionalProperties: false
};

const orderAboBoxItemSchema = {
    type: 'object',
    properties: {
        aboBoxId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' }, // MongoDB ObjectId as string
        quantity: { type: 'number' },
        orderPrice: { type: 'number', exclusiveMinimum: 0 },
        subscriptionStatus: { type: 'string', enum: ['pending', 'active', 'expired', 'cancelled'] },
        subscription_months: { type: 'number', minimum: 1 }
    },
    required: ['aboBoxId', 'quantity', 'orderPrice', 'subscription_months'],
    additionalProperties: false
};

const orderProductItemSchema = {
    type: 'object',
    properties: {
        productId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        quantity: { type: 'number' },
        orderPrice: { type: 'number', exclusiveMinimum: 0 }
    },
    required: ['productId', 'quantity', 'orderPrice'],
    additionalProperties: false
};

const orderSchema = {
    type: 'object',
    properties: {
        userId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
        orderDate: { type: 'string', format: 'date-time' },
        paymentMethod: { type: 'string' },
        deliveryAddress: { type: 'string' },
        type: { type: 'string', enum: ['aboBox', 'product'] },
        orderStatus: { type: 'string', enum: ['pending', 'completed', 'cancelled'] },
        items: {
            type: 'array',
            items: {
                oneOf: [orderAboBoxItemSchema, orderProductItemSchema]
            }
        }
    },
    required: ['userId', 'paymentMethod', 'deliveryAddress', 'type', 'items'],
    additionalProperties: false
};

const loginSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string'
        }
    },
    required: ['email', 'password'],
    additionalProperties: true
};

const roleSchema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: ['user', 'admin', 'supplier']
        },
        description: {
            type: 'string'
        }
    },
    required: ['type', 'description'],
    additionalProperties: false
};

const preferenceSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            categoryId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
            preferenceLevel: { type: 'number' },
            source: {
                type: 'string',
                enum: ['user', 'system', 'registration']
            }
        },
        required: ['categoryId', 'preferenceLevel', 'source'],
        additionalProperties: false
    }
};

const userSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string'
        },
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        },
        subscriptionStatus: {
            type: 'boolean'
        },
        role: roleSchema,
        referredBy: {
            type: ['string', 'null']
        },
        preferences: preferenceSchema
    },
    required: ['email', 'password', 'firstName', 'lastName', 'preferences'],
    additionalProperties: false
};

const productSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        productPrice: {
            type: 'number'
        },
        stockLevel: {
            type: 'number'
        },
        categories: {
            type: 'array',
            items: {
                $ref: '#/definitions/category'
            }
        },
        supplierId: {
            type: 'string'
        }
    },
    required: ['name', 'description', 'productPrice', 'stockLevel', 'categories', 'supplierId'],
    additionalProperties: false,
    definitions: {
        category: {
            type: 'string'
        }
    }
};

const productStockSchema = {
    type: 'object',
    properties: {
        supplierId: {
            type: 'string'
        },
        productId: {
            type: 'string'
        },
        stockLevel: {
            type: 'number'
        }
    },
    required: ['productId', 'stockLevel'],
    additionalProperties: false
};

const supplierTrendReportSchema = {
    type: 'object',
    properties: {
        startDate: {
            type: 'string',
            format: 'date-time'
        },
        endDate: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: ['startDate', 'endDate'],
    additionalProperties: false
};

export {
    preferenceSchema,
    feedbackSchema,
    orderSchema,
    userSchema,
    loginSchema,
    productSchema,
    productStockSchema,
    supplierTrendReportSchema
};
