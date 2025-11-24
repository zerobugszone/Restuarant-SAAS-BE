import { RestaurantRepository, restaurantRepository } from '../repositories/restaurant.repository';
import { UpdateRestaurantDto } from '../dto/updateRestaurant.dto';

export class RestaurantService {
  constructor(private readonly repository: RestaurantRepository = restaurantRepository) {}

  getSettings(tenantId: string) {
    return this.repository.get(tenantId);
  }

  updateSettings(tenantId: string, payload: UpdateRestaurantDto) {
    return this.repository.upsert(tenantId, payload);
  }
}
