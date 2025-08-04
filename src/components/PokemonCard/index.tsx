import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { formatPokemonName } from '../../utils/pokemonNames';
import { useChineseName } from '../../hooks/useChineseName';
import { POKEMON_TYPES } from '../../utils/constants';
import { getPokemonBaseInfo, getTypesByIdRange, getOptimizedImageUrls } from '../../utils/pokemonBaseData';
import './style.less';

interface PokemonCardProps {
  name: string;
  url: string;
  onClick?: (id: number) => void;
}

// 🎯 从URL提取Pokemon ID
const extractPokemonId = (url: string): number => {
  const id = url.split('/').filter(Boolean).pop();
  return parseInt(id || '0', 10);
};

// 🎯 轻量级类型标签组件
const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const typeInfo = POKEMON_TYPES[type];
  if (!typeInfo) return null;
  
  return (
    <View 
      className='type-badge'
      style={{ 
        backgroundColor: typeInfo.color,
        color: '#fff',
        fontSize: '10px',
        padding: '2px 6px',
        borderRadius: '10px',
        marginRight: '4px'
      }}
    >
      <Text className='text-xs'>{typeInfo.name}</Text>
    </View>
  );
};

// 🎯 优化图片组件 - 多图片源 + 重试机制
const PokemonImage: React.FC<{ id: number; name: string }> = ({ id, name }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 🎯 使用优化的图片URL列表
  const imageUrls = useMemo(() => getOptimizedImageUrls(id, name), [id, name]);

  const currentImageUrl = imageUrls[currentImageIndex];

  const handleImageError = useCallback(() => {
    console.log(`图片加载失败: ${currentImageUrl}`);
    
    if (currentImageIndex < imageUrls.length - 1) {
      // 尝试下一个图片源
      setCurrentImageIndex(prev => prev + 1);
      setImageError(false);
      setImageLoaded(false);
    } else {
      // 所有图片源都失败了
      setImageError(true);
      setImageLoaded(true);
    }
  }, [currentImageIndex, imageUrls.length, currentImageUrl]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  return (
    <View className='w-16 h-16 relative flex items-center justify-center'>
      {/* 加载中和错误状态的占位符 */}
      {(!imageLoaded || imageError) && (
        <View className={`w-full h-full rounded-full flex items-center justify-center ${
          imageError ? 'bg-gray-300' : 'bg-gray-200 animate-pulse'
        }`}
        >
          {imageError ? (
            <Text className='text-xs text-gray-500'>图片</Text>
          ) : (
            <View className='w-8 h-8 bg-gray-300 rounded-full animate-bounce'></View>
          )}
        </View>
      )}
      
      {/* 实际图片 */}
      {currentImageUrl && !imageError && (
        <Image
          src={currentImageUrl}
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          mode='aspectFit'
          onLoad={handleImageLoad}
          onError={handleImageError}
          lazyLoad
        />
      )}
    </View>
  );
};

// 🎯 轻量级Pokemon卡片
const PokemonCard: React.FC<PokemonCardProps> = ({ name, url, onClick }) => {
        const id = extractPokemonId(url);
  
  // 🎯 渐进式中文名称获取 - 先显示本地名称，再异步获取官方名称
  const { chineseName, isLoading, source } = useChineseName(name, undefined, {
    priority: 'both', // 优先本地，后台获取API
    enableApiUpdate: true // 启用API更新
  });
  
  // 🎯 格式化显示名称为"中文（英文）"格式
  const displayName = chineseName ? `${chineseName}（${formatPokemonName(name)}）` : formatPokemonName(name);
        
  // 🎯 获取Pokemon类型 - 优先使用基础数据映射，否则使用ID范围推测
  const pokemonTypes = useMemo(() => {
    const baseInfo = getPokemonBaseInfo(name);
    if (baseInfo) {
      return baseInfo.types;
    }
    // 如果没有精确映射，使用ID范围推测
    return getTypesByIdRange(id);
  }, [name, id]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(id);
            } else {
      Taro.navigateTo({
        url: `/pages/detail/index?id=${id}`,
        fail: (err) => {
          console.error('导航失败:', err);
          Taro.showToast({
            title: '打开详情失败',
            icon: 'none'
          });
        }
      });
    }
  }, [id, onClick]);

  // 🎯 根据主要类型生成背景渐变
  const mainType = pokemonTypes[0];
  const typeColor = POKEMON_TYPES[mainType]?.color || '#A8A878';
  
  const bgGradient = useMemo(() => {
    const baseColor = typeColor;
    return {
      background: `linear-gradient(135deg, ${baseColor}15 0%, ${baseColor}08 100%)`,
      borderLeft: `3px solid ${baseColor}60`
    };
  }, [typeColor]);
  
  return (
    <View 
      className='pokemon-card-light rounded-lg p-3 shadow-sm border border-gray-100 mb-3 transition-all duration-200 hover:shadow-md active:scale-95'
      style={bgGradient}
      onClick={handleClick}
    >
      {/* ID水印 */}
      <Text className='absolute top-1 right-2 text-lg font-bold text-gray-300 opacity-50 z-0'>
        #{id.toString().padStart(3, '0')}
      </Text>
      
      <View className='flex items-center justify-between relative z-10'>
        {/* 左侧信息 */}
        <View className='flex-1 pr-2'>
          <View className='flex flex-row items-center mb-1'>
            <Text className='font-semibold text-base text-gray-800 flex-1'>
              {displayName}
            </Text>
            {process.env.NODE_ENV === 'development' && (
              <Text className='text-xs ml-1' style={{ opacity: 0.6 }}>
                {source === 'api' ? '📡' : source === 'local' ? '📚' : '🔤'}
              </Text>
            )}
            {isLoading && (
              <Text className='text-xs ml-1 animate-pulse'>⏳</Text>
            )}
          </View>
          
          {/* 类型标签 */}
          <View className='flex flex-row flex-wrap'>
            {pokemonTypes.map(type => (
              <TypeBadge key={type} type={type} />
            ))}
          </View>
          
          {/* 简化的统计信息 */}
          <Text className='text-xs text-gray-500 mt-1'>
            点击查看详细信息
          </Text>
        </View>
        
        {/* 右侧图片 */}
        <PokemonImage id={id} name={name} />
      </View>
    </View>
  );
};

export default PokemonCard; 