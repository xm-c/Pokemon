import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { PokemonDetail, PokemonSpecies, PokemonType, PokemonStat } from '../../services/types';
import { getPokemonDetail, getPokemonSpecies, extractPokemonId } from '../../services/api';
import { getPokemonChineseName } from '../../utils/pokemonNames';
import { getCachedImagePath } from '../../utils/imageCache';
import TypeBadge from '../TypeBadge';
import './PokemonCard.less';

// 最大重试次数
const MAX_IMAGE_RETRIES = 3;

interface PokemonCardProps {
  name: string;
  url: string;
  onClick?: (id: number) => void;
}

interface TypeBadgesProps {
  types: PokemonType[];
}

interface StatsInfoProps {
  stats: PokemonStat[];
}

// 使用memo优化，防止不必要的重渲染
const TypeBadges = React.memo<TypeBadgesProps>(({ types }) => (
  <View className='flex flex-wrap justify-start mt-2'>
    {types?.map((type, index) => (
      <TypeBadge key={index} type={type.type.name} />
    ))}
  </View>
));

// 使用memo优化统计信息显示
const StatsInfo = React.memo<StatsInfoProps>(({ stats }) => {
  // 只显示攻击和防御
  const attack = stats?.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
  const defense = stats?.find(stat => stat.stat.name === 'defense')?.base_stat || 0;
  
  return (
    <View className='flex justify-between text-xs text-gray-600 mt-2'>
      <Text>攻击: {attack}</Text>
      <Text>防御: {defense}</Text>
    </View>
  );
});

const PokemonCard: React.FC<PokemonCardProps> = ({ name, url, onClick }) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageError, setImageError] = useState(false);
  const [imageRetries, setImageRetries] = useState(0);

  // 图片源选项，使用useMemo缓存
  const imageOptions = useMemo(() => {
    if (!pokemon) return [];
    return [
      pokemon.sprites.other['official-artwork'].front_default,
      pokemon.sprites.front_default,
      pokemon.sprites.other.home?.front_default,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
    ].filter(Boolean);
  }, [pokemon]);

  // 处理图片加载错误
  const handleImageError = useCallback(() => {
    if (imageRetries < MAX_IMAGE_RETRIES && pokemon && imageOptions.length > 0) {
      console.log(`图片加载失败，重试 (${imageRetries + 1}/${MAX_IMAGE_RETRIES}):`, imageSrc?.substring(0, 30));
      setImageError(true);
      setImageLoaded(false);
      
      // 选择下一个可用的图片URL
      const nextIndex = (imageRetries + 1) % imageOptions.length; // 循环使用图片源
      const nextImageUrl = imageOptions[nextIndex];
      
      if (nextImageUrl) {
        // 添加时间戳防止缓存
        const timestamp = Date.now();
        const timestampedUrl = nextImageUrl.includes('?') 
          ? `${nextImageUrl}&_t=${timestamp}` 
          : `${nextImageUrl}?_t=${timestamp}`;
          
        console.log(`尝试加载下一个图片源(${nextIndex + 1}/${imageOptions.length}): ${nextImageUrl.substring(0, 30)}`);
        
        // 延迟一点时间再重试，避免快速连续失败
        setTimeout(() => {
          setImageSrc(timestampedUrl);
          setImageRetries(prev => prev + 1);
        }, 300);
      } else {
        setImageError(true);
        setImageLoaded(true);
      }
    } else {
      console.error('图片加载失败，已达到最大重试次数或无更多图片源');
      setImageError(true);
      setImageLoaded(true); // 标记为已加载，显示占位符
    }
  }, [imageRetries, imageSrc, pokemon, imageOptions]);

  // 处理图片加载成功
  const handleImageLoad = useCallback(() => {
    console.log('图片加载成功:', imageSrc?.substring(0, 30));
    setImageLoaded(true);
    setImageError(false);
  }, [imageSrc]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        
        // 从URL中提取ID
        const id = extractPokemonId(url);
        if (!id) {
          console.error('无法从URL提取Pokemon ID:', url);
          setLoading(false);
          return;
        }
        
        // 使用ID获取Pokemon详情
        const pokemonData = await getPokemonDetail(id);
        setPokemon(pokemonData);
        
        // 获取Species数据以获取中文名称
        const speciesData = await getPokemonSpecies(id);
        setSpecies(speciesData);
        
        // 获取首选图像URL
        const imageUrl = pokemonData.sprites.other['official-artwork'].front_default || 
                         pokemonData.sprites.front_default;
        
        if (imageUrl) {
          try {
            // 尝试获取缓存图片
            console.log('开始获取图片:', imageUrl.substring(0, 30));
            const cachedPath = await getCachedImagePath(imageUrl);
            
            if (cachedPath) {
              console.log('使用缓存图片:', cachedPath.substring(0, 30));
              setImageSrc(cachedPath);
            } else {
              // 缓存获取失败时，直接使用原始URL
              console.log('无缓存，使用原始URL:', imageUrl.substring(0, 30));
              setImageSrc(imageUrl);
            }
          } catch (imgError) {
            console.error('图片缓存获取错误:', imgError);
            // 出错时使用原始URL，添加时间戳避免缓存问题
            const timestamp = Date.now();
            const timestampedUrl = `${imageUrl}?_t=${timestamp}`;
            setImageSrc(timestampedUrl);
          }
        }
      } catch (error) {
        console.error('获取Pokemon数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [url]);

  // 重置图片重试计数器当URL变化时
  useEffect(() => {
    setImageRetries(0);
    setImageError(false);
    setImageLoaded(false);
  }, [url]);

  const handleClick = () => {
    if (pokemon && onClick) {
      onClick(pokemon.id);
    } else if (pokemon) {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${pokemon.id}`,
        fail: (err) => {
          console.error('导航到详情页面失败:', err);
          Taro.showToast({
            title: '打开详情失败，请稍后再试',
            icon: 'none'
          });
        }
      });
    }
  };

  if (loading) {
    return (
      <View className='pokemon-card bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 animate-pulse rounded-lg p-4 shadow-md h-32 mb-3 box-border flex justify-center'>
        <View className='card-loading'>
          {/* 卡片专用精灵球加载动画 */}
          <View className='card-pokeball-container'>
            <View className='card-pokeball'>
              {/* 精灵球顶部（红色部分） */}
              <View className='card-pokeball-top'>
                <View className='card-pokeball-shine'></View>
              </View>
              
              {/* 精灵球底部（白色部分） */}
              <View className='card-pokeball-bottom'></View>
              
              {/* 精灵球中间黑色带 */}
              <View className='card-pokeball-band'></View>
              
              {/* 精灵球中间按钮外圈（黑色） */}
              <View className='card-pokeball-button-outer'></View>
              
              {/* 精灵球中间按钮（白色） */}
              <View className='card-pokeball-button'></View>
            </View>
          </View>
          <Text className='card-loading-text'>精灵球摇摆中...</Text>
        </View>
      </View>
    );
  }

  if (!pokemon) {
    return null;
  }

  const chineseName = getPokemonChineseName(pokemon.name, species);
  const displayName = chineseName || pokemon.name;
  
  // 获取宝可梦的所有类型
  const types = pokemon.types || [];
  const primaryType = types.length > 0 ? types[0].type.name : 'normal';
  const secondaryType = types.length > 1 ? types[1].type.name : null;

  // 类型对应的颜色映射
  const typeColors = {
    grass: { from: 'from-green-200', to: 'to-green-300' },
    fire: { from: 'from-orange-200', to: 'to-red-300' },
    water: { from: 'from-blue-200', to: 'to-sky-300' },
    electric: { from: 'from-yellow-200', to: 'to-amber-300' },
    ice: { from: 'from-cyan-200', to: 'to-blue-300' },
    fighting: { from: 'from-red-200', to: 'to-rose-300' },
    poison: { from: 'from-purple-200', to: 'to-fuchsia-300' },
    ground: { from: 'from-amber-200', to: 'to-yellow-300' },
    flying: { from: 'from-sky-200', to: 'to-indigo-300' },
    psychic: { from: 'from-pink-200', to: 'to-rose-300' },
    bug: { from: 'from-lime-200', to: 'to-green-300' },
    rock: { from: 'from-stone-200', to: 'to-amber-300' },
    ghost: { from: 'from-indigo-200', to: 'to-purple-300' },
    dark: { from: 'from-gray-300', to: 'to-gray-400' },
    dragon: { from: 'from-blue-200', to: 'to-indigo-300' },
    steel: { from: 'from-slate-200', to: 'to-gray-300' },
    fairy: { from: 'from-rose-200', to: 'to-pink-300' },
    normal: { from: 'from-gray-200', to: 'to-slate-300' },
  };

  // 根据宝可梦的类型生成渐变色
  const getBgGradient = () => {
    const primaryColor = typeColors[primaryType] || typeColors.normal;
    
    // 如果有第二属性，从第一属性颜色到第二属性颜色渐变
    if (secondaryType && typeColors[secondaryType]) {
      return `bg-gradient-to-br ${primaryColor.from} ${typeColors[secondaryType].to}`;
    }
    
    // 单属性渐变
    return `bg-gradient-to-br ${primaryColor.from} ${primaryColor.to}`;
  };
  
  const bgGradient = getBgGradient();
  
  return (
    <View 
      className={`pokemon-card ${bgGradient} rounded-lg p-4 shadow-md flex flex-col mb-3 relative overflow-hidden hover:shadow-lg active:translate-y-0.5 transform transition-all duration-300`}
      hoverClass='shadow-xl'
      onClick={handleClick}
    >
      {/* ID 水印 */}
      <Text className='absolute top-1 right-3 text-3xl font-extrabold tracking-tight text-gray-200 opacity-40 z-0 select-none'>
        #{pokemon.id.toString().padStart(3, '0')}
      </Text>
      
      <View className='flex justify-between items-start z-10 relative'>
        <View className='flex flex-col'>
          <Text className='font-bold text-lg text-gray-800'>{displayName}</Text>
          
          {/* 宝可梦类型标签 */}
          <TypeBadges types={pokemon.types} />
          
          {/* 宝可梦统计信息 */}
          <StatsInfo stats={pokemon.stats} />
        </View>
        
        <View className='w-20 h-20 relative'>
          {(!imageLoaded || imageError) && (
            <View className='w-full h-full flex items-center justify-center'>
              <View className={`${imageError && imageRetries >= MAX_IMAGE_RETRIES ? 'bg-gray-300' : 'bg-gray-200'} w-16 h-16 rounded-full ${!imageError && 'animate-pulse'}`}>
                {imageError && imageRetries >= MAX_IMAGE_RETRIES && (
                  <View className='flex items-center justify-center h-full text-gray-500 text-xs'>
                    加载失败
                  </View>
                )}
              </View>
            </View>
          )}
          {imageSrc && (
            <Image
              src={imageSrc}
              className={`w-full h-full ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              mode='aspectFit'
              onLoad={handleImageLoad}
              onError={handleImageError}
              lazyLoad
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default PokemonCard; 