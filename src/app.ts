import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import swaggerUi from 'swagger-ui-express';
import { envConfig } from '@/core/config/env.config';
import { errorHandler } from '@/core/middleware/errorHandler.middleware';
import { swaggerSpec } from '@/core/config/swagger.config';
import tenantRoutes from '@/modules/tenant-management/routes/tenant.routes';
import subscriptionRoutes from '@/modules/subscription/routes/subscription.routes';
import authRoutes from '@/modules/auth/routes/auth.routes';
import orderRoutes from '@/modules/orders/routes/order.routes';
import menuRoutes from '@/modules/menu/routes/menu.routes';
import customerRoutes from '@/modules/customers/routes/customer.routes';
import paymentRoutes from '@/modules/payments/routes/payment.routes';
import restaurantRoutes from '@/modules/restaurant/routes/restaurant.routes';
import userRoutes from '@/modules/users/routes/user.routes';
import userRolesRoutes from '@/modules/users/routes/userRoles.routes';
import rolesRoutes from '@/modules/roles/routes/roles.routes';
import rolePermissionsRoutes from '@/modules/roles/routes/rolePermissions.routes';
import permissionsRoutes from '@/modules/permissions/routes/permissions.routes';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(json());
  app.use(urlencoded({ extended: true }));

  const { apiPrefix } = envConfig;

  app.use(`${apiPrefix}/admin/tenants`, tenantRoutes);
  app.use(`${apiPrefix}/admin/subscriptions`, subscriptionRoutes);
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/orders`, orderRoutes);
  app.use(`${apiPrefix}/menu`, menuRoutes);
  app.use(`${apiPrefix}/customers`, customerRoutes);
  app.use(`${apiPrefix}/payments`, paymentRoutes);
  app.use(`${apiPrefix}/restaurant`, restaurantRoutes);
  app.use(`${apiPrefix}/users`, userRoutes);
  app.use(`${apiPrefix}/user-roles`, userRolesRoutes);
  app.use(`${apiPrefix}/roles`, rolesRoutes);
  app.use(`${apiPrefix}/role-permissions`, rolePermissionsRoutes);
  app.use(`${apiPrefix}/permissions`, permissionsRoutes);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(errorHandler);

  return app;
};
