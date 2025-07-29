import { useEffect, useState } from 'react';
import { getPokemonList, getPokemonDetail, searchPokemons, getPokemonSpecies, getEvolutionChain } from '../services/api';
import { PokemonBasic, PokemonDetail, PokemonSpecies, EvolutionChain } from '../services/types';
import { preloadImages } from '../utils/imageCache';

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

  // 预加载宝可梦图片
  const preloadPokemonImages = async (pokemonList: PokemonBasic[]) => {
    // 提取ID用于构建图片URL
    const imageUrls = pokemonList.map(pokemon => {
      // 从URL提取宝可梦ID
      const id = pokemon.url.split('/').filter(Boolean).pop();
      // 构建官方图片URL
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    });
    
    // 预加载图片
    preloadImages(imageUrls);
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

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        
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
        setLoading(false);
      }
    };

    if (id) {
    fetchPokemonData();
}
  }, [id]);
  
  return { pokemon, species, evolution, loading, error };
};
