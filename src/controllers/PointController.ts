import { Response, Request } from 'express';
import connection from '../database/connection';

interface IPoint {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  items: number[];
}

class PointController {
  public async store(request: Request, response: Response): Promise<Response> {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    }: IPoint = request.body;

    const point = {
      image:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const trx = await connection.transaction();

    const insertedIds = await trx('points').insert(point);

    const pointId = insertedIds[0];

    const pointItems = items.map((itemId) => ({
      item_id: itemId,
      point_id: pointId,
    }));

    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({ status: true, id: pointId, ...point });
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { city, uf, items } = request.query;

    const parseItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()));

    const points = await connection('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parseItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return response.json(points);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const point = await connection<IPoint>('points').where('id', id).first();

    if (!point)
      return response.status(400).json({ message: 'Point not found!' });

    const items = await connection('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ ...point, items });
  }
}
export default new PointController();
