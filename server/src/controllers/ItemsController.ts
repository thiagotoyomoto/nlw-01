import { Request, Response } from 'express';
import knex from '../database/connection';

import { getImageUrl } from '../utils';

export default class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex<Item>('items').select('*');

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: getImageUrl(item.image)
            };
        });

        return response.json(serializedItems);
    }

    async show(request: Request, response: Response) {
        const id = request.params.id;
        const item = await knex<Item>('items').where('id', id).first();

        if (!item)
            return response.status(404);

        const serializedItems = {
            id: item.id,
            title: item.title,
            image_url: getImageUrl(item.image)
        }

        return response.json(serializedItems);
    }
}