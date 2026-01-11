// Define the Feedback schema
const feedbackSchema = {
    bsonType: 'object',
    required: ['userId', 'aboBoxId', 'rating', 'comment'],
    properties: {
        userId: {
            bsonType: 'objectId',
            description: 'must be an objectId and is required'
        },
        aboBoxId: {
            bsonType: 'objectId',
            description: 'must be an objectId and is required'
        },
        rating: {
            bsonType: 'int',
            minimum: 1,
            maximum: 5,
            description: 'must be an integer between 1 and 5 and is required'
        },
        comment: {
            bsonType: 'string',
            description: 'must be a string and is required'
        }
    }
};

// Define the Role schema
const roleSchema = {
    bsonType: 'object',
    required: ['type', 'description'],
    properties: {
        type: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        description: {
            bsonType: 'string',
            description: 'must be a string'
        }
    }
};

const preferenceSchema = {
    bsonType: 'array',
    minItems: 0,
    description: 'must be an array and is required',
    items: {
        bsonType: 'object',
        required: ['categoryId', 'preferenceLevel', 'source'],
        properties: {
            categoryId: {
                bsonType: 'objectId',
                description: 'must be an objectId and is required'
            },
            preferenceLevel: {
                bsonType: 'int',
                description: 'must be an integer and is required'
            },
            source: {
                bsonType: 'string',
                description: 'must be a string and is required'
            }
        }
    }
};

// Define the User schema
const userSchema = {
    bsonType: 'object',
    required: ['email', 'password', 'firstName', 'lastName', 'subscriptionStatus', 'role', 'referredBy', 'preferences'],
    properties: {
        email: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        password: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        firstName: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        lastName: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        subscriptionStatus: {
            bsonType: 'bool',
            description: 'must be a bool and is required'
        },
        role: roleSchema,
        referredBy: {
            bsonType: ['objectId', 'null'],
            description: 'must be an objectId or null and is required'
        },
        preferences: preferenceSchema
    }
};

// Define the Category schema
const categorySchema = {
    bsonType: 'object',
    required: ['type', 'description', 'seoTag'],
    properties: {
        type: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        description: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        seoTag: {
            bsonType: 'string',
            description: 'must be a string and is required'
        }
    }
};

// Define the Product schema
const productSchema = {
    bsonType: 'object',
    required: ['name', 'description', 'productPrice', 'stockLevel', 'categories', 'supplierId'],
    properties: {
        name: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        description: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        productPrice: {
            bsonType: 'number',
            description: 'must be a number and is required'
        },
        stockLevel: {
            bsonType: 'number',
            description: 'must be a number and is required'
        },
        categories: {
            bsonType: 'array',
            items: {
                bsonType: 'objectId'
            },
            description: 'must be an array of ObjectIds and is required'
        },
        supplierId: {
            bsonType: 'objectId',
            description: 'must be an ObjectId and is required'
        }
    }
};

const supplierSchema = {
    bsonType: 'object',
    required: ['name', 'email', 'address', 'isPartner'],
    properties: {
        name: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        email: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        address: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        isPartner: {
            bsonType: 'bool',
            description: 'must be a boolean and is required'
        }
    }
};

const aboxSchema = {
    bsonType: 'object',
    required: ['boxType', 'size', 'price', 'products'],
    properties: {
        boxType: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        size: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        price: {
            bsonType: 'number',
            description: 'must be a number and is required'
        },
        products: {
            bsonType: 'array',
            minItems: 0,
            items: {
                bsonType: 'objectId'
            },
            description: 'must be an array of ObjectIds and is required'
        }
    }
};

const orderAboBoxItemSchema = {
    bsonType: 'object',
    required: ['aboBoxId', 'quantity', 'orderPrice', 'subscriptionStatus', 'subscription_months'],
    properties: {
        aboBoxId: {
            bsonType: 'objectId',
            description: 'must be an objectId and is required'
        },
        quantity: {
            bsonType: 'int',
            minimum: 1,
            description: 'must be an integer greater than 0 and is required'
        },
        orderPrice: {
            bsonType: 'number',
            description: 'must be a number and is required'
        },
        subscriptionStatus: {
            enum: ['pending', 'active', 'expired', 'cancelled'],
            description: 'can only be one of the enum values and is required'
        },
        subscription_months: {
            bsonType: 'int',
            minimum: 1,
            description: 'must be an integer greater than 0 and is required'
        }
    }
};

const orderProductItemSchema = {
    bsonType: 'object',
    required: ['productId', 'quantity', 'orderPrice'],
    properties: {
        productId: {
            bsonType: 'objectId',
            description: 'must be an objectId and is required'
        },
        quantity: {
            bsonType: 'int',
            minimum: 1,
            description: 'must be an integer greater than 0 and is required'
        },
        orderPrice: {
            bsonType: 'number',
            description: 'must be a number and is required'
        }
    }
};

const orderSchema = {
    bsonType: 'object',
    required: ['userId', 'orderDate', 'paymentMethod', 'deliveryAddress', 'type', 'orderStatus', 'items'],
    properties: {
        userId: {
            bsonType: 'objectId',
            description: 'must be an ObjectId and is required'
        },
        orderDate: {
            bsonType: 'date',
            description: 'must be a date and is required'
        },
        paymentMethod: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        deliveryAddress: {
            bsonType: 'string',
            description: 'must be a string and is required'
        },
        type: {
            enum: ['aboBox', 'product'],
            description: "can only be 'aboBox' or 'product' and is required"
        },
        orderStatus: {
            enum: ['pending', 'completed', 'cancelled'],
            description: "can only be 'pending', 'completed', or 'cancelled' and is required"
        },
        items: {
            bsonType: 'array',
            items: {
                anyOf: [
                    orderAboBoxItemSchema,
                    orderProductItemSchema
                ]
            }
        }
    }
};

export {
    feedbackSchema,
    categorySchema,
    roleSchema,
    userSchema,
    productSchema,
    supplierSchema,
    aboxSchema,
    orderSchema
};
