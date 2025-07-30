import Taro, { request } from '@tarojs/taro';

// 添加平台检测
const isH5 = process.env.TARO_ENV === 'h5';

// 缓存过期时间（7天）
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000;

// 缓存键前缀
const CACHE_PREFIX = 'POKEMON_IMG_CACHE_';
const CACHE_META_KEY = 'POKEMON_IMG_CACHE_META';

// 下载重试配置
const MAX_RETRIES = 3; // 增加到3次
const RETRY_DELAY = 800; // 减少延迟时间

// 官方图片URL前缀
const OFFICIAL_SPRITES_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
const OFFICIAL_ARTWORK_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

// 备用CDN (JSDelivr CDN for GitHub, 对国内更友好)
const JSDELIVR_SPRITES_BASE_URL = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/';
const JSDELIVR_ARTWORK_BASE_URL = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/';

// 缓存元数据类型
interface CacheMetadata {
  [key: string]: {
    timestamp: number;
    path: string;
    originalUrl: string; // 添加原始URL以便重试时使用
  }
}

/**
 * 获取缓存元数据
 */
const getCacheMetadata = (): CacheMetadata => {
  try {
    if (isH5) {
      const meta = localStorage.getItem(CACHE_META_KEY);
      return meta ? JSON.parse(meta) : {};
    }
    
    const meta = Taro.getStorageSync(CACHE_META_KEY);
    return meta ? JSON.parse(meta) : {};
  } catch (e) {
    console.error('获取图片缓存元数据失败:', e);
    return {};
  }
};

/**
 * 保存缓存元数据
 */
const saveCacheMetadata = (metadata: CacheMetadata): void => {
  try {
    if (isH5) {
      localStorage.setItem(CACHE_META_KEY, JSON.stringify(metadata));
      return;
    }
    
    Taro.setStorageSync(CACHE_META_KEY, JSON.stringify(metadata));
  } catch (e) {
    console.error('保存图片缓存元数据失败:', e);
    // 尝试清理一部分缓存，可能是存储空间已满
    try {
      const oldMeta = getCacheMetadata();
      const entries = Object.entries(oldMeta);
      // 如果有超过50个缓存项，删除最旧的20个
      if (entries.length > 50) {
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const toDelete = entries.slice(0, 20); // 删除更多项目
        
        toDelete.forEach(([url, item]) => {
          try {
            Taro.removeSavedFile({
              filePath: item.path,
              fail: () => {} // 忽略错误
            });
            delete oldMeta[url];
          } catch {
            // 忽略错误
          }
        });
        
        // 尝试再次保存
        Taro.setStorageSync(CACHE_META_KEY, JSON.stringify(oldMeta));
      }
    } catch {
      // 如果还是失败，尝试完全清空缓存
      try {
        Taro.setStorageSync(CACHE_META_KEY, '{}');
      } catch {
        // 放弃处理
      }
    }
  }
};

/**
 * 检查文件是否存在且可访问
 * @param filePath 文件路径
 * @returns 文件是否存在
 */
const isFileAccessible = async (filePath: string): Promise<boolean> => {
  try {
    if (isH5) {
      // H5环境：检查localStorage中是否存在
      return !!localStorage.getItem(`cached_image_${btoa(filePath)}`);
    }
    
    await Taro.getFileInfo({
      filePath
    });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 从URL中提取宝可梦ID
 */
const extractPokemonIdFromUrl = (url: string): number | null => {
  try {
    // 尝试从URL中提取ID
    const patterns = [
      /\/pokemon\/(\d+)\.png/i,
      /\/(\d+)\.png/i,
      /pokemon\/other\/official-artwork\/(\d+)\.png/i
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
    }
    
    return null;
  } catch {
    return null;
  }
};

/**
 * 获取多个备用URL
 * 按照网络可访问性排序
 */
const getFallbackImageUrls = (url: string): string[] => {
  const id = extractPokemonIdFromUrl(url);
  if (!id) return [];
  
  return [
    // 首先尝试JSDelivr CDN (适合国内访问)
    `${JSDELIVR_ARTWORK_BASE_URL}${id}.png`,
    `${JSDELIVR_SPRITES_BASE_URL}${id}.png`,
    
    // 然后尝试GitHub官方源
    `${OFFICIAL_ARTWORK_BASE_URL}${id}.png`,
    `${OFFICIAL_SPRITES_BASE_URL}${id}.png`,
  ];
};

/**
 * 修复SOCKS代理错误的图片URL
 */
const fixSocksProxyUrl = (url: string): string => {
  // 如果URL中包含GitHub，尝试将其替换为JSDelivr CDN
  if (url.includes('raw.githubusercontent.com')) {
    const id = extractPokemonIdFromUrl(url);
    if (id) {
      // 如果是官方艺术图片
      if (url.includes('official-artwork')) {
        return `${JSDELIVR_ARTWORK_BASE_URL}${id}.png`;
      } 
      // 普通精灵图片
      return `${JSDELIVR_SPRITES_BASE_URL}${id}.png`;
    }
  }
  return url;
};

/**
 * 清理过期的缓存
 */
const cleanExpiredCache = async (): Promise<void> => {
  try {
    const metadata = getCacheMetadata();
    const now = Date.now();
    let hasExpired = false;
    const entries = Object.entries(metadata);
    
    // 批量处理以提高性能
    const expiredEntries = entries.filter(([_, data]) => now - data.timestamp > CACHE_EXPIRY);
    
    if (expiredEntries.length > 0) {
      for (const [url, data] of expiredEntries) {
        try {
          // 检查文件是否存在
          const fileExists = await isFileAccessible(data.path);
          
          // 删除过期文件
          if (fileExists) {
            if (isH5) {
              // H5环境：删除localStorage中的缓存
              localStorage.removeItem(`cached_image_${btoa(data.path)}`);
            } else {
              // 小程序环境：删除本地文件
              await Taro.removeSavedFile({
                filePath: data.path,
                fail: () => {} // 忽略错误
              });
            }
          }
          
          delete metadata[url];
          hasExpired = true;
        } catch (e) {
          console.warn('清理过期缓存项失败:', url, e);
        }
      }
      
      if (hasExpired) {
        saveCacheMetadata(metadata);
      }
    }
  } catch (e) {
    console.error('清理过期缓存失败:', e);
  }
};

/**
 * 下载文件并重试
 * @param url 图片URL
 * @param retries 剩余重试次数
 * @param useTimestamp 是否使用时间戳避免缓存
 */
const downloadWithRetry = async (
  url: string, 
  retries = MAX_RETRIES, 
  useTimestamp = true
): Promise<string> => {
  // 修复可能存在的SOCKS代理问题
  let fixedUrl = fixSocksProxyUrl(url);
  
  try {
    // 添加时间戳防止缓存问题
    let requestUrl = fixedUrl;
    if (useTimestamp) {
      requestUrl = fixedUrl.includes('?') 
        ? `${fixedUrl}&_t=${Date.now()}` 
        : `${fixedUrl}?_t=${Date.now()}`;
    }
    
    console.log(`尝试下载图片: ${requestUrl.substring(0, 30)}...`);
    
    if (isH5) {
      // H5环境：使用fetch下载
      const response = await fetch(requestUrl);
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64Data = reader.result as string;
          const cacheKey = `cached_image_${btoa(requestUrl)}`;
          
          try {
            // 存储到localStorage
            localStorage.setItem(cacheKey, base64Data);
            console.log(`图片下载成功(H5): ${url.substring(0, 50)}...`);
            resolve(base64Data);
          } catch (storageError) {
            console.warn('localStorage存储失败:', storageError);
            resolve(requestUrl); // 返回原URL作为备用
          }
        };
        reader.onerror = () => reject(new Error('读取图片数据失败'));
        reader.readAsDataURL(blob);
      });
    }
    
    // 小程序环境：使用原有逻辑
    const res = await Taro.downloadFile({
      url: requestUrl,
      timeout: 15000
    });

    if (res.statusCode === 200) {
      try {
        const saveRes = await Taro.saveFile({
          tempFilePath: res.tempFilePath
        });
        
        const savedPath = saveRes && 'savedFilePath' in saveRes ? saveRes.savedFilePath : res.tempFilePath;
        
        if (await isFileAccessible(savedPath)) {
          console.log(`图片下载成功: ${url.substring(0, 50)}...`);
          return savedPath;
        }
        throw new Error('文件保存后无法访问');
      } catch (saveError) {
        console.warn('保存文件失败:', saveError);
        return res.tempFilePath;
      }
    } else {
      throw new Error(`HTTP错误: ${res.statusCode}`);
    }
  } catch (error) {
    // 检查是否是SOCKS代理错误或404错误
    const errorString = String(error);
    const isSocksError = errorString.includes('socks') || 
                          errorString.includes('tunnel') || 
                          errorString.includes('proxy');
    const isNotFoundError = errorString.includes('404') ||
                          errorString.includes('not found');
                          
    console.error(`下载错误(${isSocksError ? 'SOCKS代理错误' : isNotFoundError ? '404错误' : '普通错误'}):`, errorString.substring(0, 100));
    
    if (retries > 0) {
      console.log(`下载重试 (${MAX_RETRIES - retries + 1}/${MAX_RETRIES}): ${url.substring(0, 30)}...`);
      
      // 如果是SOCKS错误或404，立即尝试备用URL
      if (isSocksError || isNotFoundError) {
        const fallbackUrls = getFallbackImageUrls(url);
        
        // 如果有备用URL，立即尝试
        if (fallbackUrls.length > 0) {
          const nextUrl = fallbackUrls[(MAX_RETRIES - retries) % fallbackUrls.length];
          if (nextUrl && nextUrl !== url && nextUrl !== fixedUrl) {
            console.log(`检测到${isSocksError ? 'SOCKS代理错误' : '404错误'}，尝试备用URL: ${nextUrl.substring(0, 30)}...`);
            // 不减少重试次数，直接尝试备用URL
            return downloadWithRetry(nextUrl, retries, true);
          }
        }
      }
      
      // 最后一次尝试使用备用URL
      if (retries === 1) {
        const fallbackUrls = getFallbackImageUrls(url);
        if (fallbackUrls.length > 0) {
          const fallbackUrl = fallbackUrls[0];
          if (fallbackUrl && fallbackUrl !== url && fallbackUrl !== fixedUrl) {
            console.log('最后一次尝试，使用备用URL:', fallbackUrl.substring(0, 30));
            return downloadWithRetry(fallbackUrl, 0, true);
          }
        }
      }
      
      // 延迟重试
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return downloadWithRetry(fixedUrl, retries - 1, true);
    }
    throw error;
  }
};

/**
 * 获取图片，优先使用缓存
 * @param url 图片URL
 * @returns 本地图片路径或原始URL
 */
export const getCachedImagePath = async (url: string): Promise<string> => {
  // 如果URL为空，直接返回
  if (!url) return '';

  try {
    const metadata = getCacheMetadata();
    
    // 如果缓存中存在且未过期，则使用缓存
    if (metadata[url] && (Date.now() - metadata[url].timestamp < CACHE_EXPIRY)) {
      try {
        // 检查文件是否存在
        const fileExists = await isFileAccessible(metadata[url].path);
        if (fileExists) {
          if (isH5) {
            // H5环境：返回缓存的base64数据
            const cachedData = localStorage.getItem(`cached_image_${btoa(metadata[url].path)}`);
            if (cachedData) {
              return cachedData;
            }
          }
          return metadata[url].path;
        }
        
        console.log('缓存文件不存在，重新下载:', url.substring(0, 30));
        // 文件不存在，移除缓存记录
        delete metadata[url];
        saveCacheMetadata(metadata);
      } catch (e) {
        console.warn('检查缓存文件失败:', e);
        // 继续下面的下载流程
      }
    }

    // 没有缓存或缓存已过期，下载图片
    const savedPath = await downloadWithRetry(url);

    // 更新缓存元数据
    if (savedPath) {
      metadata[url] = {
        timestamp: Date.now(),
        path: savedPath,
        originalUrl: url
      };
      saveCacheMetadata(metadata);
      
      // 触发清理过期缓存（异步）
      setTimeout(() => {
        cleanExpiredCache().catch(() => {});
      }, 100);
    }

    return savedPath || url;
  } catch (error) {
    console.error('图片缓存获取失败:', url.substring(0, 30), error);
    
    // 尝试使用备用URL
    try {
      const fallbackUrls = getFallbackImageUrls(url);
      if (fallbackUrls.length > 0) {
        console.log('缓存失败，尝试备用URL:', fallbackUrls[0].substring(0, 30));
        const result = await downloadWithRetry(fallbackUrls[0], 1, false);
        return result;
      }
    } catch {}
    
    return url; // 所有尝试失败，返回原URL
  }
};

/**
 * 预加载一批图片
 * @param urls 图片URL数组
 */
export const preloadImages = (urls: string[]): void => {
  if (!urls || urls.length === 0) return;
  
  // 去重
  const uniqueUrls = [...new Set(urls)];
  
  // 限制并发下载数量
  const MAX_CONCURRENT = 2; // 降低并发数，减少资源竞争
  let active = 0;
  let index = 0;
  
  const startNext = () => {
    if (index >= uniqueUrls.length) return;
    
    const url = uniqueUrls[index++];
    active++;
    
    // 异步下载图片
    getCachedImagePath(url)
      .catch(err => console.warn('预加载图片失败:', url.substring(0, 30), err))
      .finally(() => {
        active--;
        startNext();
      });
  };
  
  // 启动初始批次下载
  for (let i = 0; i < MAX_CONCURRENT && i < uniqueUrls.length; i++) {
    startNext();
  }
};

/**
 * 获取缓存使用情况
 */
export const getCacheStats = async (): Promise<{count: number, size: number}> => {
  try {
    const metadata = getCacheMetadata();
    const count = Object.keys(metadata).length;
    
    // 获取缓存文件总大小
    const fileInfoPromises = Object.values(metadata).map(item => 
      Taro.getFileInfo({
        filePath: item.path,
        fail: () => ({ size: 0 })
      }).then(res => (res as any).size || 0)
        .catch(() => 0)
    );
    
    const fileSizes = await Promise.all(fileInfoPromises);
    const totalSize = fileSizes.reduce((sum, size) => sum + size, 0);
    
    return {
      count,
      size: totalSize
    };
  } catch (e) {
    console.error('获取缓存统计信息失败:', e);
    return { count: 0, size: 0 };
  }
};

/**
 * 清空所有图片缓存
 */
export const clearImageCache = async (): Promise<void> => {
  try {
    const metadata = getCacheMetadata();
    
    // 删除所有缓存文件
    const deletePromises = Object.values(metadata).map(item => 
      Taro.removeSavedFile({
        filePath: item.path,
        fail: () => {} // 忽略不存在的文件错误
      })
    );
    
    await Promise.all(deletePromises);
    
    // 清除元数据
    Taro.setStorageSync(CACHE_META_KEY, '{}');
    
    console.log('图片缓存已清空');
  } catch (e) {
    console.error('清空图片缓存失败:', e);
    throw e;
  }
}; 