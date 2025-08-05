import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { getPokemonDetail, searchPokemons, getPokemonSpecies, getEvolutionChain } from '../services/api';
import { PokemonBasic, PokemonDetail, PokemonSpecies, EvolutionChain } from '../services/types';

// 每页加载的宝可梦数量
export const POKEMONS_PER_PAGE = 20;

// 搜索参数类型
export interface SearchParams {
  name?: string;
  type?: string;
  region?: string;
}

/**
 * 用于获取和管理宝可梦列表的Hook
 */
export const usePokemonList = () => {
  const [pokemons, setPokemons] = useState<PokemonBasic[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // 获取宝可梦列表
  const fetchPokemons = async (newOffset = offset, customParams?: SearchParams) => {
    try {
      setLoading(true);
      setError(false);
      
      // 使用传入的自定义参数或者当前的搜索参数
      const params = {
        ...(customParams !== undefined ? customParams : searchParams),
        offset: newOffset,
        limit: POKEMONS_PER_PAGE
      };
      
      const { results, count } = await searchPokemons(params);
      setTotalCount(count);
      
      // 如果是第一页，直接设置结果；否则，追加结果
      if (newOffset === 0) {
        setPokemons(results);
      } else {
        setPokemons(prev => [...prev, ...results]);
      }
      
      // 预加载图片
      preloadPokemonImages(results);
      
      // 判断是否还有更多数据
      setHasMore(newOffset + results.length < count);
    } catch (err) {
      console.error('获取宝可梦列表失败:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 跨平台图片预加载策略
  const preloadPokemonImages = async (pokemonList: PokemonBasic[]) => {
    if (!pokemonList || pokemonList.length === 0) return;
    
    // 批量预加载，限制并发数量避免过载
    const BATCH_SIZE = 5;
    const CONCURRENT_LIMIT = 2; // 降低并发数，提高成功率
    
    // 提取图片URL（只预加载第一优先级的图片源）
    const imageUrls = pokemonList.slice(0, BATCH_SIZE).map(pokemon => {
      const id = pokemon.url.split('/').filter(Boolean).pop();
      const paddedId = parseInt(id || '0', 10).toString().padStart(3, '0');
      
      // 优先预加载官方高质量图片
      return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`;
    });
    
    // 🎯 跨平台预加载实现
    const preloadSingleImage = async (url: string): Promise<void> => {
      return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          console.log(`⏰ 预加载超时: ${url.substring(url.lastIndexOf('/') + 1)}`);
          resolve();
        }, 5000);
        
        // 检查运行环境
        if (typeof window !== 'undefined' && window.Image) {
          // 🌐 H5环境: 使用Image对象
          const img = new Image();
          img.onload = () => {
            clearTimeout(timeout);
            console.log(`✅ 预加载成功(H5): ${url.substring(url.lastIndexOf('/') + 1)}`);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            console.log(`❌ 预加载失败(H5): ${url.substring(url.lastIndexOf('/') + 1)}`);
            resolve();
          };
          img.src = url;
        } else {
          // 📱 小程序环境: 使用Taro.getImageInfo
          Taro.getImageInfo({
            src: url,
            success: () => {
              clearTimeout(timeout);
              console.log(`✅ 预加载成功(小程序): ${url.substring(url.lastIndexOf('/') + 1)}`);
              resolve();
            },
            fail: (err) => {
              clearTimeout(timeout);
              console.log(`❌ 预加载失败(小程序): ${url.substring(url.lastIndexOf('/') + 1)}`, err.errMsg);
              resolve();
            }
          });
        }
      });
    };
    
    // 分批并发预加载，避免同时加载太多图片
    for (let i = 0; i < imageUrls.length; i += CONCURRENT_LIMIT) {
      const batch = imageUrls.slice(i, i + CONCURRENT_LIMIT);
      
      await Promise.all(
        batch.map(url => preloadSingleImage(url))
      );
      
      // 批次间稍作延迟，避免网络拥堵
      if (i + CONCURRENT_LIMIT < imageUrls.length) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log(`🖼️ 预加载完成，共处理 ${Math.min(BATCH_SIZE, pokemonList.length)} 张图片`);
  };

  // 首次加载
  useEffect(() => {
    fetchPokemons(0);
  }, []);

  // 搜索宝可梦
  const searchPokemon = async (params: SearchParams) => {
    setSearchParams(params);
    setOffset(0);
    await fetchPokemons(0, params);
  };

  // 加载更多
  const loadMore = async () => {
    if (loading || !hasMore) return;
    const newOffset = offset + POKEMONS_PER_PAGE;
    setOffset(newOffset);
    await fetchPokemons(newOffset);
  };

  // 重置搜索
  const resetSearch = async () => {
    const emptyParams = {};
    setSearchParams(emptyParams);
    setOffset(0);
    await fetchPokemons(0, emptyParams);
  };

  return { 
    pokemons, 
    loading, 
    error, 
    hasMore, 
    totalCount,
    searchPokemon,
    resetSearch,
    loadMore
  };
};

/**
 * 用于获取单个宝可梦详情的Hook
 */
export const usePokemonDetail = (id: number) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolution, setEvolution] = useState<EvolutionChain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPokemonData = async (isRefresh = false) => {
      try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
        
        // 获取宝可梦基本信息
        const pokemonData = await getPokemonDetail(`${id}`);
        setPokemon(pokemonData);
        
        // 直接使用ID获取宝可梦种类信息，而不是通过URL
        try {
          const speciesData = await getPokemonSpecies(id);
          console.log(`使用ID ${id} 获取到的物种数据:`, {
            id: speciesData.id,
            name: speciesData.name,
            hasNames: !!speciesData.names,
            namesCount: speciesData.names?.length
          });
        setSpecies(speciesData);
          
          // 获取进化链
          if (speciesData.evolution_chain?.url) {
            const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);
            setEvolution(evolutionData);
          }
        } catch (speciesErr) {
          console.error(`使用ID ${id} 获取物种信息失败:`, speciesErr);
          
          // 尝试使用URL作为备选方案
          console.log(`尝试通过URL获取物种信息: ${pokemonData.species.url}`);
          const speciesDataByUrl = await getPokemonSpecies(pokemonData.species.url);
          setSpecies(speciesDataByUrl);
          
          if (speciesDataByUrl.evolution_chain?.url) {
            const evolutionData = await getEvolutionChain(speciesDataByUrl.evolution_chain.url);
            setEvolution(evolutionData);
          }
        }
        
        setError(false);
      } catch (err) {
        console.error('获取宝可梦详情失败:', err);
        setError(true);
      } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // 刷新数据的方法
  const refresh = async () => {
    await fetchPokemonData(true);
    };

  useEffect(() => {
    if (id) {
    fetchPokemonData();
}
  }, [id]);
  
  return { pokemon, species, evolution, loading, error, refreshing, refresh };
};
