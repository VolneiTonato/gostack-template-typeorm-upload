import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import 'express-async-errors';

import ErrorMidleware from './midleware/error.midleware';
import routes from './routes';
import createConnection from './database';

createConnection();

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

app.use(ErrorMidleware);

export default app;
