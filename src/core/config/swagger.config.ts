import swaggerJsdoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';
import { envConfig } from './env.config';

const definition: OAS3Definition = {
  openapi: '3.0.3',
  info: {
    title: 'Restaurant Ordering SaaS API',
    version: '1.0.0',
    description: 'API documentation for the multi-tenant restaurant ordering platform',
  },
  servers: [
    {
      url: `http://localhost:${envConfig.port}`,
      description: 'Local server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterDto: {
        type: 'object',
        required: ['email', 'password', 'tenantId', 'role'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          tenantId: { type: 'string' },
          role: { type: 'string' },
        },
      },
      LoginDto: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      CreateTenantDto: {
        type: 'object',
        required: ['name', 'subdomain', 'email', 'plan'],
        properties: {
          name: { type: 'string' },
          subdomain: { type: 'string' },
          email: { type: 'string', format: 'email' },
          plan: { type: 'string' },
          settings: { type: 'object', additionalProperties: true },
        },
      },
      UpdateTenantDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
        },
      },
      SubscriptionCreate: {
        type: 'object',
        required: ['tenantId', 'planType', 'status', 'startDate'],
        properties: {
          tenantId: { type: 'string' },
          planType: { type: 'string' },
          status: { type: 'string', enum: ['active', 'canceled', 'past_due'] },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          amount: { type: 'number' },
        },
      },
      OrderItemDto: {
        type: 'object',
        required: ['menuItemId', 'quantity'],
        properties: {
          menuItemId: { type: 'string' },
          quantity: { type: 'integer', minimum: 1 },
          notes: { type: 'string' },
        },
      },
      CreateOrderDto: {
        type: 'object',
        required: ['customerName', 'total', 'items'],
        properties: {
          customerName: { type: 'string' },
          tableNumber: { type: 'string' },
          total: { type: 'number' },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItemDto' } },
        },
      },
      UpdateOrderDto: {
        type: 'object',
        properties: {
          customerName: { type: 'string' },
          tableNumber: { type: 'string' },
          total: { type: 'number' },
          status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'canceled'] },
        },
      },
      CreateMenuItemDto: {
        type: 'object',
        required: ['name', 'price', 'isAvailable'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          categoryId: { type: 'string' },
          isAvailable: { type: 'boolean' },
        },
      },
      UpdateMenuItemDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          categoryId: { type: 'string' },
          isAvailable: { type: 'boolean' },
        },
      },
      CreateCategoryDto: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
      },
      CreateCustomerDto: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
        },
      },
      UpdateCustomerDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
        },
      },
      ProcessPaymentDto: {
        type: 'object',
        required: ['orderId', 'amount', 'method'],
        properties: {
          orderId: { type: 'string' },
          amount: { type: 'number' },
          method: { type: 'string' },
        },
      },
      UpdateRestaurantDto: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          timezone: { type: 'string' },
          currency: { type: 'string' },
          address: { type: 'string' },
        },
      },
    },
  },
};

const options: OAS3Options = {
  definition,
  apis: ['src/modules/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
