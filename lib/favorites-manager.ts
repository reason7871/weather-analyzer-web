/**
 * Favorites Manager
 * 收藏管理 - 使用 LocalStorage 存储用户收藏的城市
 */

export interface FavoriteCity {
  id: string;
  name: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  addedAt: string;
  order: number;
}

export interface FavoritesData {
  defaultCity: string | null;
  favorites: FavoriteCity[];
  version: string;
}

const STORAGE_KEY = "weather-analyzer-favorites";
const VERSION = "1.0";

// 获取所有收藏
export function getFavorites(): FavoritesData {
  if (typeof window === "undefined") {
    return { defaultCity: null, favorites: [], version: VERSION };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { defaultCity: null, favorites: [], version: VERSION };
    }

    const data: FavoritesData = JSON.parse(stored);

    // 版本检查和迁移
    if (data.version !== VERSION) {
      // 可以在这里添加版本迁移逻辑
      data.version = VERSION;
      saveFavorites(data);
    }

    return data;
  } catch (error) {
    console.error("Failed to load favorites:", error);
    return { defaultCity: null, favorites: [], version: VERSION };
  }
}

// 保存收藏
export function saveFavorites(data: FavoritesData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save favorites:", error);
  }
}

// 添加收藏
export function addFavorite(city: Omit<FavoriteCity, "id" | "addedAt" | "order">): void {
  const data = getFavorites();

  // 检查是否已存在
  const exists = data.favorites.some(
    (f) => f.name === city.name && f.latitude === city.latitude
  );

  if (exists) {
    throw new Error("该城市已在收藏列表中");
  }

  const newFavorite: FavoriteCity = {
    ...city,
    id: `${city.name}-${city.latitude}-${city.longitude}`.replace(/\s+/g, "-"),
    addedAt: new Date().toISOString(),
    order: data.favorites.length,
  };

  data.favorites.push(newFavorite);
  saveFavorites(data);
}

// 删除收藏
export function removeFavorite(cityId: string): void {
  const data = getFavorites();

  data.favorites = data.favorites.filter((f) => f.id !== cityId);

  // 重新排序
  data.favorites.forEach((f, index) => {
    f.order = index;
  });

  // 如果删除的是默认城市，清除默认设置
  if (data.defaultCity && !data.favorites.find((f) => f.id === data.defaultCity)) {
    data.defaultCity = null;
  }

  saveFavorites(data);
}

// 设置默认城市
export function setDefaultCity(cityId: string): void {
  const data = getFavorites();

  const city = data.favorites.find((f) => f.id === cityId);
  if (!city) {
    throw new Error("该城市不在收藏列表中");
  }

  data.defaultCity = cityId;
  saveFavorites(data);
}

// 获取默认城市
export function getDefaultCity(): FavoriteCity | null {
  const data = getFavorites();

  if (!data.defaultCity) {
    return null;
  }

  return data.favorites.find((f) => f.id === data.defaultCity) || null;
}

// 检查是否已收藏
export function isFavorite(name: string, latitude: number, longitude: number): boolean {
  const data = getFavorites();
  return data.favorites.some(
    (f) => f.name === name && f.latitude === latitude && f.longitude === longitude
  );
}

// 获取收藏数量
export function getFavoritesCount(): number {
  const data = getFavorites();
  return data.favorites.length;
}

// 清空所有收藏
export function clearAllFavorites(): void {
  saveFavorites({
    defaultCity: null,
    favorites: [],
    version: VERSION,
  });
}

// 导出收藏数据（用于备份）
export function exportFavorites(): string {
  const data = getFavorites();
  return JSON.stringify(data, null, 2);
}

// 导入收藏数据
export function importFavorites(jsonString: string): void {
  try {
    const data: FavoritesData = JSON.parse(jsonString);

    // 验证数据格式
    if (!data.favorites || !Array.isArray(data.favorites)) {
      throw new Error("无效的收藏数据格式");
    }

    // 更新版本
    data.version = VERSION;

    saveFavorites(data);
  } catch (error) {
    throw new Error("导入收藏数据失败：" + (error as Error).message);
  }
}

// 获取收藏列表（按排序）
export function getFavoritesList(): FavoriteCity[] {
  const data = getFavorites();
  return data.favorites.sort((a, b) => a.order - b.order);
}

// 更新收藏城市信息
export function updateFavorite(
  cityId: string,
  updates: Partial<Omit<FavoriteCity, "id" | "addedAt">>
): void {
  const data = getFavorites();

  const index = data.favorites.findIndex((f) => f.id === cityId);
  if (index === -1) {
    throw new Error("收藏城市不存在");
  }

  data.favorites[index] = {
    ...data.favorites[index],
    ...updates,
  };

  saveFavorites(data);
}

// 重新排序收藏
export function reorderFavorites(cityIds: string[]): void {
  const data = getFavorites();

  // 创建映射
  const cityMap = new Map(data.favorites.map((f) => [f.id, f]));

  // 检查所有城市ID都存在
  const missingIds = cityIds.filter((id) => !cityMap.has(id));
  if (missingIds.length > 0) {
    throw new Error("部分城市不存在：" + missingIds.join(", "));
  }

  // 重新排序
  data.favorites = cityIds.map((id, index) => {
    const city = cityMap.get(id)!;
    city.order = index;
    return city;
  });

  saveFavorites(data);
}
