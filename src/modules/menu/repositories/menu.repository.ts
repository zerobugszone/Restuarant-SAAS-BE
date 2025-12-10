import { v4 as uuid } from 'uuid';
import { MenuItemModel } from '../models/menuItem.model';
import { CategoryModel } from '../models/category.model';

const menuItems = new Map<string, MenuItemModel[]>();
const categories = new Map<string, CategoryModel[]>();

const collection = <T>(map: Map<string, T[]>, tenantId: string) => {
  if (!map.has(tenantId)) {
    map.set(tenantId, []);
  }
  return map.get(tenantId)!;
};

export class CategoryRepository {
  async create(tenantId: string, payload: Omit<CategoryModel, 'id'>) {
    const category: CategoryModel = { ...payload, id: uuid() };
    collection(categories, tenantId).push(category);
    return category;
  }

  async findAll(tenantId: string) {
    return collection(categories, tenantId);
  }

  async findById(tenantId: string, id: string) {
    return collection(categories, tenantId).find(category => category.id === id);
  }

  async update(tenantId: string, id: string, payload: Partial<CategoryModel>) {
    const category = await this.findById(tenantId, id);
    if (category) {
      Object.assign(category, payload);
    }
    return category;
  }
}

export class MenuRepository {
  async create(tenantId: string, payload: Omit<MenuItemModel, 'id'>) {
    const item: MenuItemModel = { ...payload, id: uuid() };
    collection(menuItems, tenantId).push(item);
    return item;
  }

  async findAll(tenantId: string) {
    return collection(menuItems, tenantId);
  }

  async findById(tenantId: string, id: string) {
    return collection(menuItems, tenantId).find(item => item.id === id);
  }

  async update(tenantId: string, id: string, payload: Partial<MenuItemModel>) {
    const item = await this.findById(tenantId, id);
    if (item) {
      Object.assign(item, payload);
    }
    return item;
  }
}

export const menuRepository = new MenuRepository();
export const categoryRepository = new CategoryRepository();
