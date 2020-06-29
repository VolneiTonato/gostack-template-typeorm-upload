import { Router } from 'express';
import transactionRouter from './transactions.routes';

const router = Router();

const routes = [transactionRouter];

routes.map(route => router.use(route.action, route.router));

export default router;
