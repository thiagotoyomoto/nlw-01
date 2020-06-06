import express from 'express';
import helmet from 'helmet';
import routes from './routes'
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(
    process.env.PORT || 3333,
    () => {
        console.log(`Server running in http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3333}`);
        console.log('Press Ctrl+C to close.');
    }
);