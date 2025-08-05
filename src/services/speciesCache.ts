import { getPokemonSpecies } from './api';
import { PokemonSpecies } from './types';

// Species缓存接口
interface SpeciesCache {
  [key: string]: {
    data: PokemonSpecies;
    timestamp: number;
    chineseName?: string;
  };
}

// 缓存管理类
class SpeciesCacheManager {
  private cache: SpeciesCache = {};
  private pendingRequests: Map<string, Promise<PokemonSpecies | null>> = new Map();
  private readonly CACHE_TTL = 3600000; // 1小时缓存有效期
  // private readonly MAX_CONCURRENT_REQUESTS = 3; // 最大并发请求数 (未使用)
  private readonly BATCH_SIZE = 5; // 批量处理大小

  /**
   * 获取宝可梦的中文名称
   * @param nameOrId 宝可梦名称或ID
   * @returns 中文名称，如果未找到则返回null
   */
  async getChineseName(nameOrId: string | number): Promise<string | null> {
    const key = String(nameOrId).toLowerCase();
    
    // 检查缓存
    const cached = this.cache[key];
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.chineseName || null;
    }

    // 获取species数据
    const species = await this.getSpecies(nameOrId);
    if (!species) return null;

    // 提取中文名称
    const chineseName = this.extractChineseName(species);
    
    // 更新缓存
    this.cache[key] = {
      data: species,
      timestamp: Date.now(),
      chineseName: chineseName || undefined
    };

    return chineseName;
  }

  /**
   * 批量获取多个宝可梦的中文名称
   * @param nameOrIds 宝可梦名称或ID数组
   * @returns 中文名称映射表
   */
  async getBatchChineseNames(nameOrIds: (string | number)[]): Promise<Record<string, string | null>> {
    const result: Record<string, string | null> = {};
    const toFetch: (string | number)[] = [];

    // 检查缓存，收集需要获取的项目
    for (const nameOrId of nameOrIds) {
      const key = String(nameOrId).toLowerCase();
      const cached = this.cache[key];
      
      if (cached && this.isCacheValid(cached.timestamp)) {
        result[key] = cached.chineseName || null;
      } else {
        toFetch.push(nameOrId);
      }
    }

    // 如果没有需要获取的项目，直接返回
    if (toFetch.length === 0) {
      return result;
    }

    // 分批处理，避免过多并发请求
    const batches = this.chunkArray(toFetch, this.BATCH_SIZE);
    
    for (const batch of batches) {
      const promises = batch.map(nameOrId => 
        this.getChineseName(nameOrId).then(name => ({ key: String(nameOrId).toLowerCase(), name }))
      );

      try {
        const batchResults = await Promise.allSettled(promises);
        
        batchResults.forEach((promiseResult, index) => {
          if (promiseResult.status === 'fulfilled') {
            const { key, name } = promiseResult.value;
            result[key] = name;
          } else {
            const key = String(batch[index]).toLowerCase();
            result[key] = null;
          }
        });

        // 在批次之间添加小延迟，避免API限制
        if (batches.indexOf(batch) < batches.length - 1) {
          await this.delay(100);
        }
      } catch (error) {
        console.warn('批量获取species数据时出错:', error);
      }
    }

    return result;
  }

  /**
   * 获取单个species数据
   */
  private async getSpecies(nameOrId: string | number): Promise<PokemonSpecies | null> {
    const key = String(nameOrId).toLowerCase();
    
    // 检查是否已有进行中的请求
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // 创建新的请求
    const promise = this.fetchSpecies(nameOrId);
    this.pendingRequests.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  /**
   * 实际获取species数据的方法
   */
  private async fetchSpecies(nameOrId: string | number): Promise<PokemonSpecies | null> {
    try {
      const species = await getPokemonSpecies(nameOrId);
      return species;
    } catch (error) {
      console.warn(`获取${nameOrId}的species数据失败:`, error);
      return null;
    }
  }

  /**
   * 从species数据中提取中文名称
   */
  private extractChineseName(species: PokemonSpecies): string | null {
    if (!species?.names) return null;

    // 查找中文名称（简体中文优先，繁体中文次之）
    for (const nameEntry of species.names) {
      if (nameEntry.language?.name === 'zh-Hans') {
        return nameEntry.name;
      }
    }

    for (const nameEntry of species.names) {
      if (nameEntry.language?.name === 'zh-Hant') {
        return nameEntry.name;
      }
    }

    return null;
  }

  /**
   * 检查缓存是否有效
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  /**
   * 数组分块工具函数
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 延迟工具函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 清理过期缓存
   */
  cleanExpiredCache(): void {
    Object.keys(this.cache).forEach(key => {
      if (!this.isCacheValid(this.cache[key].timestamp)) {
        delete this.cache[key];
      }
    });
  }

  /**
   * 获取缓存统计信息
   */
  getCacheStats(): { total: number; expired: number } {
    const total = Object.keys(this.cache).length;
    const expired = Object.values(this.cache).filter(
      item => !this.isCacheValid(item.timestamp)
    ).length;

    return { total, expired };
  }

  /**
   * 清空所有缓存
   */
  clearAll(): void {
    this.cache = {};
    this.pendingRequests.clear();
  }
}

// 创建全局缓存管理器实例
export const speciesCacheManager = new SpeciesCacheManager();

// 定期清理过期缓存（每5分钟）
setInterval(() => {
  speciesCacheManager.cleanExpiredCache();
}, 5 * 60 * 1000);

export default speciesCacheManager; 