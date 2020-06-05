import { Response, Request } from 'express';
import ip from 'ip';
import connection from '../database/connection';

interface IItem {
  id: number;
  title: string;
  image: string;
}
class ItemController {
  public async index(request: Request, response: Response): Promise<Response> {
    const items = await connection<IItem>('items').select('*');

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://${ip.address()}:3333/uploads/${item.image}`,
      };
    });

    return response.json(serializedItems);
  }
}
export default new ItemController();
