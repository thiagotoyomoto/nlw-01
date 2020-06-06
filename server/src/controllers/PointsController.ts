import { Request, Response } from 'express';
import knex from '../database/connection';

import fs from 'fs';
import path from 'path';

import { getImageUrl } from '../utils';

export default class PointsController {
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        if (!items) {
            const points = (await knex('points')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .where({ uf: String(uf), city: String(city) })
                .distinct()
                .select<Point[]>('points.*')).map(point => ({
                    id: point.id,
                    image_url: getImageUrl(point.image),
                    name: point.name,
                    email: point.email,
                    phone: point.phone,
                    latitude: point.latitude,
                    longitude: point.longitude,
                    uf: point.uf,
                    city: point.city
                }));

            return response.json(points);
        }

        const points = (await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .where({
                uf: String(uf),
                city: String(city)
            })
            .whereIn('point_items.item_id', parsedItems)
            .distinct()
            .select('points.*')).map(point => ({
                id: point.id,
                image_url: getImageUrl(point.image),
                name: point.name,
                email: point.email,
                phone: point.phone,
                latitude: point.latitude,
                longitude: point.longitude,
                uf: point.uf,
                city: point.city
            }));

        return response.json(points);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex<Point>('points').where('id', id).first();

        const items = (await knex<Item>('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select<Item[]>('items.*')).map(item => item.title);

        return response.json({
            name: point?.name,
            email: point?.email,
            phone: point?.phone,
            latitude: point?.latitude,
            longitude: point?.longitude,
            uf: point?.uf,
            city: point?.city,
            image_url: getImageUrl(point?.image),
            items
        });
    }

    async create(request: Request, response: Response) {
        const {
            name, email, phone,
            latitude, longitude,
            uf, city,
            items
        } = request.body;

        const point = {
            name, email, phone,
            image: request.file.filename,
            latitude, longitude,
            uf, city
        }

        const trx = await knex.transaction();

        const insertedIds = await trx('points').insert(point);

        const pointItems = items.split(',').map((item: string) => ({
            item_id: Number(item.trim()),
            point_id: insertedIds[0]
        }));

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.status(200).json(point);
    }

    async delete(request: Request, response: Response) {
        let status = 200;

        const { id } = request.params;

        const trx = await knex.transaction();

        const { image } = await trx('points').where('id', id).first();

        await trx('points').where('id', id).first().delete().then(rows => {
            if (rows == 0)
                status = 400;
        });

        await trx('point_items').where('point_id', id).delete().then(rows => {
            if (rows == 0)
                status = 400;
        });

        await trx.commit();

        if (status !== 400) {
            fs.unlink(path.resolve(__dirname, '..', '..', 'uploads', image), () => { });
        }

        return response.status(status).json({});
    }
}