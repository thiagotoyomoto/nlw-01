import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import printRouteAndMethod from './middlewares/printRouteAndMethod';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const pointsController = new PointsController();
const itemsController = new ItemsController();

const routes = express.Router();
const upload = multer(multerConfig);

routes.use(printRouteAndMethod);

routes.get('/items', itemsController.index);
routes.get('/items/:id', itemsController.show);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.delete('/points/:id', pointsController.delete);

routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            phone: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            uf: Joi.string().required(),
            city: Joi.string().required(),
            items: Joi.string().required()
        })
    }, {
        abortEarly: false
    }),
    pointsController.create
);

export default routes;