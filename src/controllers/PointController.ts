import { Response, Request } from 'express';
import ip from 'ip';
import connection from '../database/connection';

interface IPoint {
  id: number;
  name: string;
  email: string;
  image: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  items: string;
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
      image: request.file.filename,
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

    const itemsArray = items.split(',').map((item) => Number(item.trim()));

    const pointItems = itemsArray.map((itemId) => ({
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

    const serializedPoints = points.map((point) => {
      return {
        ...point,
        image_url: `http://${ip.address()}:3333/uploads/${point.image}`,
      };
    });

    return response.json(serializedPoints);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const point = await connection<IPoint>('points').where('id', id).first();

    if (!point)
      return response.status(400).json({ message: 'Point not found!' });

    const serializedPoint = {
      ...point,
      image_url: `http://${ip.address()}:3333/uploads/${point.image}`,
    };

    const items = await connection('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ ...serializedPoint, items });
  }
}
export default new PointController();
