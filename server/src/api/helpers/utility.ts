import crypto from 'crypto';

const generateJWTSecret = (): string => {
    return crypto.randomBytes(64).toString('hex');
};

const aggregateAboboxesWithProducts = [
    {
        $unwind: '$products'
    },
    {
        $lookup: {
            from: 'products',
            localField: 'products',
            foreignField: '_id',
            as: 'productDetails'
        }
    },
    {
        $unwind: '$productDetails'
    },
    {
        $lookup: {
            from: 'categories',
            localField: 'productDetails.categories',
            foreignField: '_id',
            as: 'productDetails.categoryDetails'
        }
    },
    {
        $lookup: {
            from: 'suppliers',
            localField: 'productDetails.supplierId',
            foreignField: '_id',
            as: 'productDetails.supplierDetails'
        }
    },
    {
        $group: {
            _id: '$_id',
            boxType: { $first: '$boxType' },
            size: { $first: '$size' },
            price: { $first: '$price' },
            products: { $push: '$productDetails' }
        }
    },
    {
        $project: {
            _id: 1,
            boxType: 1,
            size: 1,
            price: 1,
            products: {
                _id: 1,
                name: 1,
                description: 1,
                productPrice: 1,
                stockLevel: 1,
                categoryDetails: 1,
                supplierDetails: 1
            }
        }
    }
];

const aggregateProductsWithCategoriesAndSuppliers = [
    {
        $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categoryInfo'
        }
    },
    {
        $lookup: {
            from: 'suppliers',
            localField: 'supplierId',
            foreignField: '_id',
            as: 'supplierInfo'
        }
    },
    {
        $unwind: {
            path: '$supplierInfo',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            _id: 1,
            name: 1,
            description: 1,
            productPrice: 1,
            stockLevel: 1,
            categories: '$categoryInfo',
            supplier: '$supplierInfo'
        }
    }
];

const aggregateUserWithPreferenceCategories = [
    {
        $unwind: {
            path: '$preferences',
            // This ensures that users with no preferences are also included
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: 'categories',
            localField: 'preferences.categoryId',
            foreignField: '_id',
            as: 'preferences.categoryDetails'
        }
    },
    {
        $unwind: {
            path: '$preferences.categoryDetails',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: '$_id',
            root: { $first: '$$ROOT' },
            preferences: {
                $push: {
                    category: '$preferences.categoryDetails',
                    preferenceLevel: '$preferences.preferenceLevel',
                    source: '$preferences.source'
                }
            }
        }
    },
    {
        $project: {
            _id: '$_id',
            email: '$root.email',
            password: '$root.password',
            firstName: '$root.firstName',
            lastName: '$root.lastName',
            subscriptionStatus: '$root.subscriptionStatus',
            role: '$root.role',
            referredBy: '$root.referredBy',
            preferences: {
                $filter: {
                    input: '$preferences',
                    as: 'pref',
                    cond: { $ne: ['$$pref', {}] }
                }
            }
        }
    }
];

export {
    generateJWTSecret,
    aggregateUserWithPreferenceCategories,
    aggregateProductsWithCategoriesAndSuppliers,
    aggregateAboboxesWithProducts
};
