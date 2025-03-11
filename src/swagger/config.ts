import { authPaths } from './auth';
import { categoriesRoutes } from './categories';
import { consumerRoutes } from './consumer';
import { eventsRoutes } from './events';
import { faqRoutes } from './faq';
import { invitationsRoutes } from './invitations';
import { notificationsRoutes } from './notifications';
import { ordersRoutes } from './orders';
import { organizationsRoutes } from './organizations';
import { otpRoutes } from './otp';
import { queriesRoutes } from './queries';
import { refundsRoutes } from './refunds';
import { ticketsRoutes } from './tickets';

export const swaggerConfig = {
    openapi: '3.0.0',
    info: {
        title: 'Fair Ticket API',
        version: '1.0.0',
        description: 'API documentation for Fair Ticket system'
    },
    servers: [
        {
            url: 'https://fair-ticket-honojs.developer-9ce.workers.dev',
            description: 'Production server'
        },
        {
            url: 'http://localhost:8787',
            description: 'Local development'
        }
    ],
    paths: {
        ...authPaths,
        ...categoriesRoutes,
        ...consumerRoutes,
        ...eventsRoutes,
        ...ordersRoutes,
        ...refundsRoutes,
        ...organizationsRoutes,
        ...ticketsRoutes,
        ...queriesRoutes,
        ...otpRoutes,
        ...invitationsRoutes,
        ...notificationsRoutes,
        ...faqRoutes
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};
