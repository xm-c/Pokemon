import Taro from '@tarojs/taro';
import { 
  PokemonDetail, 
  PokemonListResponse, 
  PokemonSpecies, 
  EvolutionChain,
  SearchParams,
  MoveDetail,
  AbilityDetail
} from './types';
import { API_BASE_URL, POKEMONS_PER_PAGE } from '../utils/constants';
import { POKEMON_CHINESE_NAMES } from '../utils/pokemonNames';

// 缓存所有宝可梦数据，避免重复请求
let cachedPokemons: PokemonListResponse | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 3600000; // 缓存有效期1小时

// 获取宝可梦列表
export async function getPokemonList(offset = 0, limit = POKEMONS_PER_PAGE): Promise<PokemonListResponse> {
  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error('获取宝可梦列表失败:', error);
    throw error;
  }
}

// 获取所有宝可梦用于搜索，带缓存功能
async function getAllPokemonsForSearch(forceRefresh = false): Promise<PokemonListResponse> {
  const now = Date.now();
  
  // 如果有缓存且未过期，直接返回缓存
  if (!forceRefresh && cachedPokemons && (now - lastFetchTime < CACHE_TTL)) {
    console.log('使用缓存的宝可梦数据进行搜索');
    return cachedPokemons;
  }
  
  try {
    console.log('获取所有宝可梦数据用于搜索');
    // 获取数量较大的宝可梦列表，用于搜索
    const response = await getPokemonList(0, 1000);
    
    // 更新缓存
    cachedPokemons = response;
    lastFetchTime = now;
    
    return response;
  } catch (error) {
    console.error('获取所有宝可梦数据失败:', error);
    
    // 如果获取失败但有缓存，仍然使用缓存
    if (cachedPokemons) {
      console.log('API请求失败，使用过期缓存');
      return cachedPokemons;
    }
    
    throw error;
  }
}

// 获取宝可梦详细信息
export async function getPokemonDetail(idOrName: number | string): Promise<PokemonDetail> {
  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}/pokemon/${idOrName}`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error(`获取宝可梦 ${idOrName} 详情失败:`, error);
    throw error;
  }
}

// 获取宝可梦种族信息
export async function getPokemonSpecies(idOrName: number | string): Promise<PokemonSpecies> {
  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}/pokemon-species/${idOrName}`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error(`获取宝可梦 ${idOrName} 种族信息失败:`, error);
    throw error;
  }
}

/**
 * 获取进化链信息
 * @param url 进化链URL
 * @returns 进化链数据
 */
export async function getEvolutionChain(url: string): Promise<EvolutionChain> {
  try {
    // 如果传入的是完整URL，则使用该URL，否则构建URL
    const targetUrl = url.includes('http') ? url : `${API_BASE_URL}/evolution-chain/${url}`;
    
    const response = await Taro.request({
      url: targetUrl,
      method: 'GET'
    });
    
    return response.data;
  } catch (error) {
    console.error('获取宝可梦进化链失败:', error);
    throw error;
  }
}

// 按类型获取宝可梦
export async function getPokemonsByType(type: string): Promise<PokemonListResponse> {
  try {
    console.log(`尝试获取类型: ${type} 的宝可梦`);
    
    // 首先获取该类型的所有宝可梦
    const typeResponse = await Taro.request({
      url: `${API_BASE_URL}/type/${type}`,
      method: 'GET'
    });
    
    // 提取宝可梦列表，并添加URL和ID信息
    const pokemons = typeResponse.data.pokemon.map(entry => {
      // 从URL中提取ID
      const id = extractPokemonId(entry.pokemon.url);
      
      return {
        name: entry.pokemon.name,
        url: entry.pokemon.url,
        id: id
      };
    });
    
    console.log(`成功获取 ${type} 类型的 ${pokemons.length} 只宝可梦`);
    
    // 构造分页响应
    return {
      count: pokemons.length,
      next: null,
      previous: null,
      results: pokemons
    };
  } catch (error) {
    console.error(`获取 ${type} 类型宝可梦失败:`, error);
    
    // 如果API请求失败，返回空结果
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
  }
}

// 按地区获取宝可梦
export async function getPokemonsByRegion(region: string): Promise<PokemonListResponse> {
  try {
    // 地区映射表（处理API中的特殊命名）
    const regionMappings: Record<string, string> = {
      'kanto': 'kanto',
      'johto': 'johto',
      'hoenn': 'hoenn',
      'sinnoh': 'sinnoh',
      'unova': 'unova',
      'kalos': 'kalos-central',  // PokéAPI中卡洛斯地区使用central版本
      'alola': 'alola',
      'galar': 'galar',
      'hisui': 'hisui',
      'paldea': 'paldea'
    };
    
    // 获取对应地区的图鉴名称
    const pokedexName = regionMappings[region] || region;
    console.log(`尝试获取地区: ${pokedexName} 的宝可梦`);
    
    // 获取对应世代的图鉴
    const pokedexResponse = await Taro.request({
      url: `${API_BASE_URL}/pokedex/${pokedexName}`,
      method: 'GET'
    });
    
    // 提取宝可梦列表
    const pokemons = pokedexResponse.data.pokemon_entries.map(entry => ({
      name: entry.pokemon_species.name,
      url: `${API_BASE_URL}/pokemon/${entry.entry_number}`,
      id: entry.entry_number
    }));
    
    console.log(`成功获取 ${pokedexName} 地区的 ${pokemons.length} 只宝可梦`);
    
    // 构造分页响应
    return {
      count: pokemons.length,
      next: null,
      previous: null,
      results: pokemons
    };
  } catch (error) {
    console.error(`获取 ${region} 地区宝可梦失败:`, error);
    
    // 如果找不到该地区的图鉴，返回空结果
    return {
      count: 0,
      next: null,
      previous: null,
      results: []
    };
  }
}

// 搜索宝可梦
export async function searchPokemons(params: SearchParams): Promise<PokemonListResponse> {
  try {
    const { name, type, region, limit = POKEMONS_PER_PAGE, offset = 0 } = params;
    
    // 如果指定了类型，按类型搜索
    if (type) {
      return await getPokemonsByType(type);
    }
    
    // 如果指定了地区，按地区搜索
    if (region) {
      return await getPokemonsByRegion(region);
    }
    
    // 如果指定了名称，搜索宝可梦
    if (name) {
      // 检查是否是中文搜索
        const isChinese = /[\u4e00-\u9fa5]/.test(name);
        
        if (isChinese) {
          // 中文名称搜索逻辑
          console.log('检测到中文搜索:', name);
        return await searchPokemonsByChinese(name, offset, limit);
      } else {
        // 英文名称搜索
        return await searchPokemonsByEnglish(name, offset, limit);
      }
    }
    
    // 如果没有指定搜索条件，返回分页列表
    return await getPokemonList(offset, limit);
  } catch (error) {
    console.error('搜索宝可梦失败:', error);
    throw error;
  }
}

// 中文搜索实现
async function searchPokemonsByChinese(keyword: string, offset = 0, limit = POKEMONS_PER_PAGE): Promise<PokemonListResponse> {
  try {
    const searchTerm = keyword.trim().toLowerCase();
    
    // 获取所有宝可梦用于搜索
    const allPokemonsResponse = await getAllPokemonsForSearch();
    const matchedPokemons: typeof allPokemonsResponse.results = [];
    
    // 创建一个映射表，用于快速查找中文名
    const chineseNameMap: Record<string, string[]> = {};
            for (const [engName, chineseName] of Object.entries(POKEMON_CHINESE_NAMES)) {
      // 如果一个中文名对应多个宝可梦，把这些宝可梦都加进去
      if (!chineseNameMap[chineseName]) {
        chineseNameMap[chineseName] = [];
      }
      chineseNameMap[chineseName].push(engName);
              }
    
    // 首先尝试精确匹配
    if (chineseNameMap[searchTerm]) {
      console.log(`找到精确匹配的中文名: ${searchTerm}`);
      
      for (const engName of chineseNameMap[searchTerm]) {
        // 在所有宝可梦中查找对应的英文名
        const pokemon = allPokemonsResponse.results.find(p => 
          p.name.toLowerCase() === engName.toLowerCase()
        );
        
        if (pokemon) {
          matchedPokemons.push(pokemon);
        }
            }
    }
    
    // 如果没有精确匹配或匹配结果为空，尝试模糊搜索
    if (matchedPokemons.length === 0) {
      console.log(`没有找到精确匹配的中文名，进行模糊搜索: ${searchTerm}`);
            
      // 遍历所有宝可梦
            for (const pokemon of allPokemonsResponse.results) {
              const chineseName = POKEMON_CHINESE_NAMES[pokemon.name.toLowerCase()];
        
        // 如果中文名包含搜索关键词，加入结果集
        if (chineseName && chineseName.includes(searchTerm)) {
                matchedPokemons.push(pokemon);
              }
            }
    }
    
    console.log(`中文搜索 "${searchTerm}" 找到 ${matchedPokemons.length} 个结果`);
            
    // 返回搜索结果
              return {
                count: matchedPokemons.length,
                next: null,
                previous: null,
      results: matchedPokemons.slice(offset, offset + limit) // 应用分页
              };
  } catch (error) {
    console.error('中文搜索失败:', error);
          return {
            count: 0,
            next: null,
            previous: null,
            results: []
          };
        }
}
        
// 英文搜索实现
async function searchPokemonsByEnglish(keyword: string, offset = 0, limit = POKEMONS_PER_PAGE): Promise<PokemonListResponse> {
  try {
    const searchTerm = keyword.trim().toLowerCase();
    
    // 先尝试精确匹配
    try {
      const pokemon = await getPokemonDetail(searchTerm);
        return {
          count: 1,
          next: null,
          previous: null,
          results: [{
            name: pokemon.name,
            url: `${API_BASE_URL}/pokemon/${pokemon.id}`
          }]
        };
      } catch (error) {
      // 精确匹配失败，尝试模糊搜索
      console.log('精确匹配失败，进行英文模糊搜索...');
      
      const allPokemonsResponse = await getAllPokemonsForSearch();
          
          // 过滤包含搜索词的宝可梦
          const filteredResults = allPokemonsResponse.results.filter(
            pokemon => pokemon.name.toLowerCase().includes(searchTerm)
          );
      
      console.log(`英文搜索 "${searchTerm}" 找到 ${filteredResults.length} 个结果`);
          
          return {
            count: filteredResults.length,
            next: null,
            previous: null,
        results: filteredResults.slice(offset, offset + limit) // 应用分页
          };
    }
  } catch (error) {
    console.error('英文搜索失败:', error);
          return {
            count: 0,
            next: null,
            previous: null,
            results: []
          };
  }
}

// 获取宝可梦ID
export function extractPokemonId(url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\/?$/);
  return matches ? parseInt(matches[1], 10) : 0;
}

// 获取技能详情
export async function getMoveDetail(idOrName: string | number): Promise<MoveDetail> {
  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}/move/${idOrName}`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error(`获取技能 ${idOrName} 详情失败:`, error);
    throw error;
  }
}

// 批量获取技能详情
export async function getMoveDetails(urls: string[]): Promise<MoveDetail[]> {
  try {
    // 限制同时请求的数量，避免过多并发请求
    const batchSize = 5;
    const results: MoveDetail[] = [];
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const promises = batch.map(url => 
        Taro.request({ url, method: 'GET' }).then(response => response.data)
      );
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }
    
    return results;
  } catch (error) {
    console.error('批量获取技能详情失败:', error);
    throw error;
  }
}

// 获取特性详情
export async function getAbilityDetail(idOrName: string | number): Promise<AbilityDetail> {
  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}/ability/${idOrName}`,
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    console.error(`获取特性 ${idOrName} 详情失败:`, error);
    throw error;
  }
}

// 批量获取特性详情
export async function getAbilityDetails(urls: string[]): Promise<AbilityDetail[]> {
  try {
    // 限制同时请求的数量，避免过多并发请求
    const batchSize = 5;
    const results: AbilityDetail[] = [];
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const promises = batch.map(url => 
        Taro.request({ url, method: 'GET' }).then(response => response.data)
      );
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }
    
    return results;
  } catch (error) {
    console.error('批量获取特性详情失败:', error);
    throw error;
  }
}
 