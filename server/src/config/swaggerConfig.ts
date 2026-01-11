import path from 'path';

// get url and port
const SWAGGER_BASE = process.env.SWAGGER_BASE ?? 'http://localhost:5000';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Sustainabox API',
        version: '1.0.0',
        description: 'In an ever-changing world where awareness of environmental protection and sustainability is increasing, the company SustainaBox GmbH offers users a subscription box model for carefully selected environmentally friendly products arranged in boxes. The company offers sustainable household goods, zero-waste products, organic food and eco-friendly fashion to create awareness about sustainable use of the products. Before starting the subscription, a questionnaire should be filled out to help adapt the boxes to individual needs and interests. This ensures that each article is useful and put together just right for users. All products in the boxes come from responsible, local suppliers in Austria. The origin of each item and the associated production process should be as traceable as possible. In addition to the products, users receive information material and tips to help them maintain a more environmentally friendly lifestyle.'
    },
    servers: [
        {
            url: SWAGGER_BASE,
            description: 'Backend server'
        }
    ]
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: [path.join(__dirname, '../api/routes/*.{ts,js}')]
};

export default options;
