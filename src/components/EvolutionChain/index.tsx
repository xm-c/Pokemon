import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { EvolutionChain as EvolutionChainType, EvolutionChainLink } from '../../services/types';
import { getEvolutionChain, getPokemonDetail, getPokemonSpecies } from '../../services/api';
import { getPokemonChineseName, formatPokemonName } from '../../utils/pokemonNames';
import LoadingSpinner from '../LoadingSpinner';

interface EvolutionChainProps {
  evolutionChainUrl: string;
}

interface EvolutionNode {
  id: number;
  name: string;
  imageUrl: string;
  condition?: string;
}

const EvolutionChain: React.FC<EvolutionChainProps> = ({ evolutionChainUrl }) => {
  const [evolutionStages, setEvolutionStages] = useState<EvolutionNode[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 🎯 格式化Pokemon名称为"中文（英文）"格式
  const formatDisplayName = (name: string, species: any): string => {
    const chineseName = getPokemonChineseName(name, species);
    // 确保中文名称是纯中文（不包含英文部分）
    const pureName = chineseName && chineseName.includes('（') ? chineseName.split('（')[0] : chineseName;
    return pureName ? `${pureName}（${formatPokemonName(name)}）` : formatPokemonName(name);
  };

  // 使用useCallback包装fetchEvolutionChain函数，以便于重试功能
  const fetchEvolutionChain = useCallback(async () => {
    if (!evolutionChainUrl) {
      setError(true);
      setErrorMessage('无效的进化链URL');
      setLoading(false);
      return;
    }
    
      try {
        setLoading(true);
      setError(false);
      console.log(`[EvolutionChain] 开始获取进化链数据，URL: ${evolutionChainUrl}`);
      
        const chainData = await getEvolutionChain(evolutionChainUrl);
      console.log('[EvolutionChain] 获取到进化链数据:', chainData);
      
      if (!chainData || !chainData.chain) {
        throw new Error('进化链数据格式错误');
      }
      
        const processedChain = await processEvolutionChain(chainData.chain);
      console.log('[EvolutionChain] 处理后的进化链数据:', processedChain);
      
      if (processedChain.length === 0 || processedChain.every(stage => stage.length === 0)) {
        throw new Error('处理进化链数据失败，没有找到有效的进化阶段');
      }
      
        setEvolutionStages(processedChain);
        setError(false);
      } catch (err) {
        console.error('获取进化链失败:', err);
        setError(true);
      setErrorMessage(err instanceof Error ? err.message : '获取进化链失败');
      } finally {
        setLoading(false);
      }
  }, [evolutionChainUrl]);

  // 组件挂载时获取进化链数据
  useEffect(() => {
    fetchEvolutionChain();
  }, [fetchEvolutionChain]);

  // 处理进化链数据，转换为便于渲染的格式
  const processEvolutionChain = async (chain: EvolutionChainLink): Promise<EvolutionNode[][]> => {
    const stages: EvolutionNode[][] = [];
    let currentChain = chain;
    let currentStage: EvolutionNode[] = [];

    console.log('[processEvolutionChain] 开始处理进化链，起始物种:', currentChain.species);

    try {
    // 处理第一个宝可梦（进化链的起点）
    const baseSpeciesId = extractSpeciesId(currentChain.species.url);
      console.log('[processEvolutionChain] 基础物种ID:', baseSpeciesId);
      
    if (baseSpeciesId) {
        try {
          console.log(`[processEvolutionChain] 获取基础宝可梦详情, ID: ${baseSpeciesId}`);
      const pokemonData = await getPokemonDetail(String(baseSpeciesId));
          
          console.log(`[processEvolutionChain] 获取基础物种信息, ID: ${baseSpeciesId}`);
      const speciesData = await getPokemonSpecies(String(baseSpeciesId));
      
      currentStage.push({
        id: baseSpeciesId,
        name: formatDisplayName(currentChain.species.name, speciesData),
        imageUrl: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default
      });
          
          console.log('[processEvolutionChain] 添加基础宝可梦到第一阶段:', currentStage);
        } catch (err) {
          console.error(`[processEvolutionChain] 处理基础宝可梦时出错, ID: ${baseSpeciesId}:`, err);
        }
    }
    
    stages.push([...currentStage]);
      console.log('[processEvolutionChain] 第一阶段完成:', stages);
    
    // 处理进化链的后续阶段
    while (currentChain.evolves_to && currentChain.evolves_to.length > 0) {
        console.log(`[processEvolutionChain] 处理下一进化阶段，有 ${currentChain.evolves_to.length} 个进化分支`);
      currentStage = [];
      
      for (const evolution of currentChain.evolves_to) {
        const speciesId = extractSpeciesId(evolution.species.url);
          console.log('[processEvolutionChain] 处理进化宝可梦:', {
            species: evolution.species.name,
            id: speciesId,
            details: evolution.evolution_details
          });
          
        if (speciesId) {
            try {
              console.log(`[processEvolutionChain] 获取进化宝可梦详情, ID: ${speciesId}`);
          const pokemonData = await getPokemonDetail(String(speciesId));
              
              console.log(`[processEvolutionChain] 获取进化宝可梦物种信息, ID: ${speciesId}`);
          const speciesData = await getPokemonSpecies(String(speciesId));
          
          // 提取进化条件
          let condition = '';
          const details = evolution.evolution_details[0];
          if (details) {
            if (details.min_level) {
              condition = `等级 ${details.min_level}`;
            } else if (details.min_happiness) {
              condition = `亲密度 ${details.min_happiness}`;
            } else if (details.item) {
              condition = `使用 ${details.item.name}`;
            } else if (details.trigger && details.trigger.name) {
              condition = `${details.trigger.name}`;
            }
          }
          
          currentStage.push({
            id: speciesId,
            name: formatDisplayName(evolution.species.name, speciesData),
            imageUrl: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default,
            condition
          });
              
              console.log('[processEvolutionChain] 添加进化宝可梦到当前阶段:', {
                id: speciesId,
                name: evolution.species.name,
                condition
              });
            } catch (err) {
              console.error(`[processEvolutionChain] 处理进化宝可梦时出错, ID: ${speciesId}:`, err);
            }
        }
      }
      
      stages.push([...currentStage]);
        console.log(`[processEvolutionChain] 添加新的进化阶段，现有 ${stages.length} 个阶段`);
        
        if (currentChain.evolves_to.length > 1) {
          console.log('[processEvolutionChain] 警告: 多个进化分支，只处理第一个分支');
        }
        
      currentChain = currentChain.evolves_to[0]; // 移动到下一个进化阶段
    }
    
      console.log('[processEvolutionChain] 进化链处理完成，总共有 ' + stages.length + ' 个阶段');
    return stages;
    } catch (err) {
      console.error('[processEvolutionChain] 处理进化链时发生错误:', err);
      return stages.length > 0 ? stages : [];
    }
  };

  // 从URL中提取物种ID
  const extractSpeciesId = (url: string): number | null => {
    const matches = url.match(/\/pokemon-species\/(\d+)\/?$/);
    return matches ? parseInt(matches[1], 10) : null;
  };

  // 点击进化链中的宝可梦，跳转到其详情页
  const handlePokemonClick = (id: number) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  };

  // 重试获取进化链
  const handleRetry = () => {
    fetchEvolutionChain();
  };

  if (loading) {
    return (
      <View className='flex justify-center items-center p-4'>
        <LoadingSpinner size='small' />
        <Text className='text-gray-500 mt-2'>加载进化链...</Text>
      </View>
    );
  }

  if (error || evolutionStages.length === 0) {
    return (
      <View className='p-4 text-center'>
        <Text className='text-red-500'>{errorMessage || '无法加载进化链'}</Text>
        <View 
          className='mt-2 px-4 py-2 bg-blue-500 rounded-full inline-block'
          onClick={handleRetry}
        >
          <Text className='text-white'>重试加载</Text>
        </View>
        <Text className='text-xs text-gray-500 mt-2 block'>URL: {evolutionChainUrl}</Text>
      </View>
    );
  }

  return (
    <View className='p-4 bg-white'>
      {evolutionStages.map((stage, stageIndex) => (
        <View key={`stage-${stageIndex}`} className='mb-6'>
          <View className='flex flex-wrap justify-center items-center'>
            {stage.map((pokemon, pokemonIndex) => (
              <View key={`pokemon-${pokemon.id}`} className='flex flex-col items-center mx-2 my-2'>
                <View 
                  className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow-md'
                  onClick={() => handlePokemonClick(pokemon.id)}
                >
                  {pokemon.imageUrl && (
                    <Image 
                      src={pokemon.imageUrl} 
                      className='w-16 h-16 object-contain' 
                      mode='aspectFit'
                    />
                  )}
                </View>
                <Text className='text-sm font-medium mt-2 text-center'>{pokemon.name}</Text>
                
                {/* 进化条件 */}
                {pokemon.condition && (
                  <Text className='text-xs text-gray-500 mt-1'>{pokemon.condition}</Text>
                )}
                
                {/* 进化箭头 */}
                {stageIndex < evolutionStages.length - 1 && pokemonIndex === 0 && (
                  <View className='my-2'>
                    <Text className='text-lg'>↓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default EvolutionChain;
