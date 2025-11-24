import { MenuRepository, menuRepository, CategoryRepository, categoryRepository } from '../repositories/menu.repository';
import { CreateMenuItemDto } from '../dto/createMenuItem.dto';
import { UpdateMenuItemDto } from '../dto/updateMenuItem.dto';

export class MenuService {
  constructor(
    private readonly items: MenuRepository = menuRepository,
    private readonly categoriesRepo: CategoryRepository = categoryRepository
  ) {}

  createMenuItem(tenantId: string, payload: CreateMenuItemDto) {
    return this.items.create(tenantId, { tenantId, ...payload });
  }

  listMenuItems(tenantId: string) {
    return this.items.findAll(tenantId);
  }

  updateMenuItem(tenantId: string, id: string, payload: UpdateMenuItemDto) {
    return this.items.update(tenantId, id, payload);
  }

  createCategory(tenantId: string, payload: { name: string; description?: string }) {
    return this.categoriesRepo.create(tenantId, { tenantId, ...payload });
  }

  listCategories(tenantId: string) {
    return this.categoriesRepo.findAll(tenantId);
  }
}
