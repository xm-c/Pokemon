import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { usePokemonDetail } from '../../hooks/usePokemonData';
import { getPokemonChineseName, getAbilityChineseName } from '../../utils/pokemonNames';
import { POKEMON_TYPES } from '../../utils/constants';

import TypeBadge from '../../components/TypeBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EvolutionChain from '../../components/EvolutionChain';
import MovesList from '../../components/MovesList';
import OptimizedImage from '../../components/OptimizedImage';
import './index.less';
import { getAbilityDetail, getAbilityDetails } from '../../services/api';
import { AbilityDetail } from '../../services/types';
import { 
  getPokemonMainImageUrls, 
  getPokemonAnimatedImageUrls, 
  getPokemonPlaceholderUrl 
} from '../../utils/pokemonImageUrls';

interface StatDisplayProps {
  name: string;
  value: number;
  max?: number;
  color?: string;
}

// 状态条组件
const StatDisplay: React.FC<StatDisplayProps> = ({
  name, 
  value,
  max = 255, 
  color = '#FF5350'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const statNameMap = {
    hp: '生命',
    attack: '攻击',
    defense: '防御',
    'special-attack': '特攻',
    'special-defense': '特防',
    speed: '速度'
  };
  
  return (
    <View className='mb-3'>
      <View className='flex justify-between mb-1'>
        <Text className='text-sm font-medium'>{statNameMap[name] || name}</Text>
        <Text className='text-sm'>{value}</Text>
      </View>
      <View className='stats-bar'>
        <View 
          className='stats-bar-fill' 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
};

const Detail: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;
  const { pokemon, species, loading, error, refreshing, refresh } = usePokemonDetail(Number(id));
  const [abilityDetails, setAbilityDetails] = useState<Record<string, AbilityDetail>>({});
  const [scrollTop, setScrollTop] = useState(0);
  
  // 🎯 新增：下拉刷新状态管理
  const [isPullingDown, setIsPullingDown] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState(0);

  // 🎯 移除动态图片状态管理，交由OptimizedImage组件处理

  // 🎯 修改：简化的滚动事件处理
  const handleScroll = (e) => {
    const newScrollTop = e.detail.scrollTop;
    setScrollTop(newScrollTop);
    
    // 不在顶部时重置下拉状态
    if (newScrollTop > 0 && isPullingDown) {
      setIsPullingDown(false);
      setPullDistance(0);
    }
    
    // 开发环境调试信息
    if (process.env.NODE_ENV === 'development' && newScrollTop === 0 && scrollTop !== 0) {
      console.log('📍 到达页面顶部，可以下拉刷新');
    }
  };

  // 🎯 新增：触摸事件处理
  const handleTouchStart = (e) => {
    if (scrollTop !== 0 || isRefreshing) return;
    
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setTouchStartTime(Date.now());
  };

  const handleTouchMove = (e) => {
    if (touchStartY === 0 || scrollTop !== 0 || isRefreshing) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY;
    
    // 只处理向下拖拽
    if (deltaY > 0) {
      e.preventDefault(); // 阻止默认滚动
      const distance = Math.min(deltaY * 0.5, 100); // 阻尼效果
      setPullDistance(distance);
      setIsPullingDown(true);
    } else {
      // 向上拖拽时重置
      if (isPullingDown) {
        setIsPullingDown(false);
        setPullDistance(0);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (touchStartY === 0 || scrollTop !== 0 || isRefreshing) {
      // 重置状态
      setTouchStartY(0);
      setTouchStartTime(0);
      setPullDistance(0);
      setIsPullingDown(false);
      return;
    }
    
    // 检查是否应该触发刷新
    if (pullDistance > 60 && isPullingDown) {
      console.log('🔄 触发下拉刷新, pullDistance:', pullDistance);
      await handlePullRefresh();
    }
    
    // 重置状态
    setTouchStartY(0);
    setTouchStartTime(0);
    setPullDistance(0);
    setIsPullingDown(false);
  };

  // 🎯 新增：下拉刷新处理函数
  const handlePullRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setIsPullingDown(false);
    setPullDistance(0);
    
    try {
      console.log('🔄 开始刷新宝可梦数据...');
      
      // 重置所有状态
      setAbilityDetails({});
      
      // 刷新主要数据
      await refresh();
      
      console.log('✅ 刷新完成');
      
      // 显示刷新成功提示
      Taro.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      });
    } catch (err) {
      console.error('❌ 刷新失败:', err);
      // 显示刷新失败提示
      Taro.showToast({
        title: '刷新失败，请重试',
        icon: 'none',
        duration: 2000
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // 🎯 移除：原来的handleRefresh函数（不再需要）

  // 获取特性详情
  useEffect(() => {
    const fetchAbilityDetails = async () => {
      if (!pokemon || !pokemon.abilities || pokemon.abilities.length === 0) return;

      try {
        console.log('正在获取特性详情...');
        // 提取特性URL列表
        const abilityUrls = pokemon.abilities.map(item => item.ability.url);

        // 批量获取特性详情
        const details = await getAbilityDetails(abilityUrls);

        // 将特性详情存储到状态中
        const detailsMap: Record<string, AbilityDetail> = {};
        details.forEach((detail, index) => {
          const abilityName = pokemon.abilities[index].ability.name;
          detailsMap[abilityName] = detail;
        });

        console.log('特性详情获取完成:', detailsMap);
        setAbilityDetails(detailsMap);
      } catch (err) {
        console.error('获取特性详情失败:', err);
      }
    };

    fetchAbilityDetails();
  }, [pokemon]);

  // 获取第一个中文描述
  const getChineseDescription = () => {
    if (!species || !species.flavor_text_entries || !Array.isArray(species.flavor_text_entries)) return '';
    
    const chineseEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'zh-Hans' || entry.language.name === 'zh-Hant'
    );
    
    return chineseEntry ? chineseEntry.flavor_text : '';
  };

  // 获取宝可梦主色调（第一个类型的颜色）
  const getMainColor = () => {
    if (!pokemon || pokemon.types.length === 0) return '#FF5350';
    
    const firstType = pokemon.types[0].type.name;
    return POKEMON_TYPES[firstType]?.color || '#FF5350';
  };

  if (loading) {
    return (
      <View className='detail-page flex justify-center items-center h-screen'>
        <LoadingSpinner size='large' />
      </View>
    );
  }

  if (error || !pokemon || !species) {
    return (
      <View className='detail-page flex justify-center items-center h-screen'>
        <View className='text-center'>
          <Text className='text-xl text-red-500 mb-4'>加载失败</Text>
          <View 
            className='bg-primary text-white px-4 py-2 rounded-full'
            onClick={() => Taro.navigateBack()}
          >
            <Text className='text-white'>返回</Text>
          </View>
        </View>
      </View>
    );
  }

  const mainColor = getMainColor();
  const description = getChineseDescription();
  
  // 调试输出，查看species数据结构
  console.log('Detail页面 species数据:', {
    id: species.id,
    name: species.name,
    names: species.names ? species.names.length : 0,
    namesData: species.names,
    genera: species.genera ? species.genera.length : 0,
    generaData: species.genera,
    hasEvolutionChain: !!species.evolution_chain,
    evolutionChainUrl: species.evolution_chain?.url
  });
  
  return (
    <View className='detail-page'>
      {/* 头部 */}
      <View className='pokemon-header'>
        <View 
          className='pokemon-header-gradient'
          style={{ background: `linear-gradient(170deg, ${mainColor} 0%, ${mainColor}88 70%, ${mainColor}44 100%)` }}
        />
        
        {/* 宝可梦ID */}
        <View className='pokemon-id'>
          #{pokemon.id.toString().padStart(3, '0')}
        </View>
        
        {/* 宝可梦图片 */}
        <View className='pokemon-image-container pokemon-main-image'>
          <OptimizedImage
            primarySrc={pokemon.sprites.other?.['official-artwork']?.front_default}
            fallbackSrcs={getPokemonMainImageUrls(pokemon.id, pokemon.sprites)}
            placeholder={getPokemonPlaceholderUrl(pokemon.id)}
            className='pokemon-image'
            mode='aspectFit'
            debugMode={process.env.NODE_ENV === 'development'}
            imageName={`${pokemon.name}-main`}
            retryDelay={600}
          />
        </View>
        
        {/* 宝可梦名称 */}
        <View className='pokemon-name'>
          {species ? getPokemonChineseName(pokemon.name, species) : pokemon.name}
        </View>
        
        {/* 类型标签 */}
        <View className='flex justify-center mt-3 pb-4 z-10 relative'>
          <View className='flex flex-row gap-3'>
            {pokemon.types.map((type) => (
              <TypeBadge 
                key={type.type.name} 
                type={type.type.name} 
              />
            ))}
          </View>
        </View>
      </View>
      
      {/* 内容区 */}
      <ScrollView 
        className='px-4 pb-safe -mt-5 box-border' 
        scrollY
        onScroll={handleScroll}
        scrollTop={scrollTop}
        enableBackToTop={false}
        scrollWithAnimation={false}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPullingDown ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        
        {/* 🎯 下拉刷新指示器 */}
        {(isPullingDown || isRefreshing) && (
          <View className='flex justify-center items-center py-3 bg-gray-50 rounded-lg mx-2 mb-3'>
            {isRefreshing ? (
              <View className='flex flex-row items-center'>
                <LoadingSpinner size='small' />
                <Text className='text-sm text-blue-600 ml-2'>正在刷新...</Text>
              </View>
            ) : (
              <View className='flex flex-col items-center'>
                <Text className='text-sm text-gray-600'>
                  {pullDistance > 60 ? '释放即可刷新' : `下拉刷新 (${Math.round(pullDistance)}/60)`}
                </Text>
                {pullDistance > 60 && (
                  <Text className='text-xs text-green-600 mt-1'>已达到刷新阈值</Text>
                )}
              </View>
            )}
          </View>
        )}
        
        <View className='animate-fade-in-up' style={{ animationDelay: '0.1s' }}>
          {/* 基本信息 */}
          <View className='info-box'>
            <Text className='section-title'>基本信息</Text>
            
            <View className='grid grid-cols-3 gap-4 mt-3'>
              <View className='flex flex-col items-center'>
                <Text className='text-gray-500 text-xs mb-1'>身高</Text>
                <Text className='font-medium'>{pokemon.height / 10} m</Text>
              </View>
              <View className='flex flex-col items-center'>
                <Text className='text-gray-500 text-xs mb-1'>体重</Text>
                <Text className='font-medium'>{pokemon.weight / 10} kg</Text>
              </View>
              <View className='flex flex-col items-center'>
                <Text className='text-gray-500 text-xs mb-1'>基础经验</Text>
                <Text className='font-medium'>{pokemon.base_experience}</Text>
              </View>
            </View>
            
            {/* 描述 */}
            {description && (
              <View className='mt-4'>
                <Text className='text-gray-700'>{description}</Text>
              </View>
            )}
            
            {/* 特性 */}
            <View className='mt-4'>
              <Text className='text-gray-500 text-xs mb-1'>特性</Text>
              <View className='flex flex-wrap gap-2'>
                {pokemon.abilities.map((ability) => {
                  const abilityDetail = abilityDetails[ability.ability.name];
                  const displayName = abilityDetail 
                    ? getAbilityChineseName(ability.ability.name, abilityDetail) 
                    : ability.ability.name;
                  
                  // 提取特性描述
                  let abilityDescription = '';
                  if (abilityDetail) {
                    const chineseDescription = abilityDetail.effect_entries?.find(entry => 
                      entry.language?.name === 'zh-Hans' || entry.language?.name === 'zh-Hant'
                    )?.short_effect || abilityDetail.effect_entries?.find(entry => 
                      entry.language?.name === 'en'
                    )?.short_effect;
                    
                    if (chineseDescription) {
                      abilityDescription = chineseDescription;
                    }
                  }
                  
                  return (
                  <View 
                    key={ability.ability.name} 
                    className={`ability-chip px-3 py-1 rounded-full text-xs ${ability.is_hidden ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
                  >
                      <Text>
                        {ability.is_hidden ? '隐藏: ' : ''}
                        {displayName}
                      </Text>
                      
                      {/* 特性描述 - 悬停显示 */}
                      {abilityDescription && (
                        <View className='ability-description'>
                          <Text className='text-gray-800'>{abilityDescription}</Text>
                        </View>
                      )}
                  </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
        
        {/* 动态图 */}
        {pokemon && (
          <View className='animate-fade-in-up info-box' style={{ animationDelay: '0.2s' }}>
            <Text className='section-title'>动态图</Text>
            <View className='flex justify-center my-2 pokemon-animated-image'>
              <OptimizedImage
                primarySrc={pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default}
                fallbackSrcs={getPokemonAnimatedImageUrls(pokemon.id, pokemon.sprites)}
                placeholder={getPokemonPlaceholderUrl(pokemon.id)}
                mode='aspectFit'
                debugMode={process.env.NODE_ENV === 'development'}
                imageName={`${pokemon.name}-animated`}
                retryDelay={800}
              />
            </View>
          </View>
        )}
        
        {/* 能力值 */}
        <View className='animate-fade-in-up info-box' style={{ animationDelay: '0.3s' }}>
          <Text className='section-title'>能力值</Text>
          <View className='mt-3'>
            {pokemon.stats.map((stat) => (
              <StatDisplay 
                key={stat.stat.name} 
                name={stat.stat.name}
                value={stat.base_stat}
                color={mainColor}
              />
            ))}
          </View>
        </View>
        
        {/* 进化链 */}
        {species.evolution_chain && (
          <View className='animate-fade-in-up info-box' style={{ animationDelay: '0.4s' }}>
            <Text className='section-title'>进化链</Text>
            <View className='mt-3'>
            <EvolutionChain evolutionChainUrl={species.evolution_chain.url} />
            </View>
            {/* 添加调试信息，仅开发环境显示 */}
            {process.env.NODE_ENV === 'development' && (
              <View className='mt-2 p-2 bg-gray-100 rounded text-xs'>
                <Text className='text-gray-500'>进化链URL: {species.evolution_chain.url}</Text>
              </View>
            )}
          </View>
        )}
        
        {/* 技能列表 */}
        {pokemon.moves && pokemon.moves.length > 0 && (
          <View className='animate-fade-in-up info-box' style={{ animationDelay: '0.5s' }}>
              <MovesList moves={pokemon.moves} />
          </View>
        )}
        
        {/* 更多信息 */}
        <View className='animate-fade-in-up info-box' style={{ animationDelay: '0.6s' }}>
          <Text className='section-title'>更多信息</Text>
          <View className='grid grid-cols-2 gap-4'>
            {species.is_legendary && (
              <View className='flex items-center border rounded-lg p-2 border-yellow-400'>
                <Text className='text-yellow-600 font-bold'>传说宝可梦</Text>
              </View>
            )}
            {species.is_mythical && (
              <View className='flex items-center border rounded-lg p-2 border-purple-400'>
                <Text className='text-purple-600 font-bold'>神话宝可梦</Text>
              </View>
            )}
            {species.is_baby && (
              <View className='flex items-center border rounded-lg p-2 border-pink-400'>
                <Text className='text-pink-600 font-bold'>幼年宝可梦</Text>
              </View>
            )}
          </View>
          
          <View className='mt-4 grid grid-cols-2 gap-3'>
            <View>
              <Text className='text-gray-500 text-xs'>捕获率</Text>
              <Text className='font-medium'>{species.capture_rate}</Text>
            </View>
            <View>
              <Text className='text-gray-500 text-xs'>基础友好度</Text>
              <Text className='font-medium'>{species.base_happiness}</Text>
            </View>
          </View>
        </View>
        
        {/* 底部间距 */}
        <View className='h-8' />
      </ScrollView>
    </View>
  );
};

export default Detail; 