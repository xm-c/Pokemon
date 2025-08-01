import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { usePokemonMoves } from '../../hooks/usePokemonMoves';
import { MoveDetail } from '../../services/types';
import { POKEMON_TYPES } from '../../utils/constants';
import LoadingSpinner from '../LoadingSpinner';
import { 
  formatPokemonName, 
  getMoveChineseName, 
  extractMoveChineseDescription 
} from '../../utils/pokemonNames';

interface MovesListProps {
  moves: any[];
}

interface MoveItemProps {
  name: string;
  level: number;
  method: string;
  moveDetail: MoveDetail | null;
  onExpand: () => void;
  isExpanded: boolean;
  isLoading: boolean;
}

// 格式化学习方式名称
const formatLearnMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    'level-up': '升级',
    'machine': '技能机',
    'egg': '蛋技能',
    'tutor': '导师',
    'form-change': '形态变化'
  };
  
  return methodMap[method] || method;
};

// 格式化伤害类型
const formatDamageClass = (damageClass: string): string => {
  const damageClassMap: Record<string, string> = {
    'physical': '物理',
    'special': '特殊',
    'status': '变化'
  };
  
  return damageClassMap[damageClass] || damageClass;
};

// 单个技能展示组件
const MoveItem: React.FC<MoveItemProps> = ({
  name,
  level,
  method,
  moveDetail,
  onExpand,
  isExpanded,
  isLoading
}) => {
  // 获取中英文对照的技能名称
  const displayName = moveDetail 
    ? getMoveChineseName(name, moveDetail) 
    : `${formatPokemonName(name)}`;  // 未加载时仅显示格式化的英文名
  
  const methodDisplay = formatLearnMethod(method);
  const levelDisplay = method === 'level-up' ? `Lv.${level}` : '';
  
  // 获取技能类型颜色
  const getTypeColor = (typeName: string): string => {
    return POKEMON_TYPES[typeName]?.color || '#A8A878';
  };
  
  // 获取技能描述，优先使用中文
  const getMoveDescription = (): string => {
    if (!moveDetail) return '无描述';
    
    // 尝试获取中文描述
    const chineseDescription = extractMoveChineseDescription(moveDetail);
    if (chineseDescription) return chineseDescription;
    
    // 如果没有中文描述，使用英文描述
    const englishEntry = moveDetail.effect_entries.find(entry => entry.language.name === 'en');
    return englishEntry?.short_effect || '无描述';
  };
  
  return (
    <View className='mb-3 bg-white rounded-lg overflow-hidden shadow-sm'>
      <View 
        className='p-3 flex justify-between items-center cursor-pointer'
        onClick={onExpand}
      >
        <View className='flex items-center flex-wrap'>
          <Text className={`font-medium text-lg ${!moveDetail ? 'text-gray-500' : ''}`}>
            {displayName}
          </Text>
          {levelDisplay && (
            <View className='ml-2 px-2 py-0.5 bg-gray-200 rounded text-xs text-gray-700'>
              {levelDisplay}
            </View>
          )}
          {methodDisplay && (
            <View className='ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600'>
              {methodDisplay}
            </View>
          )}
          {moveDetail && (
            <View 
              className='ml-2 px-2 py-0.5 rounded text-xs text-white'
              style={{ backgroundColor: getTypeColor(moveDetail.type.name) }}
            >
              {POKEMON_TYPES[moveDetail.type.name]?.name || moveDetail.type.name}
            </View>
          )}
        </View>
        <Text className='text-gray-500 text-xl'>{isExpanded ? '▲' : '▼'}</Text>
      </View>
      
      {isExpanded && (
        <View className='p-4 border-t border-gray-100'>
          {isLoading || !moveDetail ? (
            <View className='flex justify-center p-4'>
              <LoadingSpinner size='small' />
            </View>
          ) : (
            <View>
              <View className='flex flex-wrap gap-2 mb-3'>
                <View 
                  className='px-2 py-1 rounded text-white text-xs'
                  style={{ backgroundColor: getTypeColor(moveDetail.type.name) }}
                >
                  {POKEMON_TYPES[moveDetail.type.name]?.name || moveDetail.type.name}
                </View>
                <View className='px-2 py-1 bg-gray-100 rounded text-xs'>
                  {formatDamageClass(moveDetail.damage_class.name)}
                </View>
                {moveDetail.power && (
                  <View className='px-2 py-1 bg-gray-100 rounded text-xs'>
                    威力: {moveDetail.power}
                  </View>
                )}
                {moveDetail.accuracy && (
                  <View className='px-2 py-1 bg-gray-100 rounded text-xs'>
                    命中: {moveDetail.accuracy}%
                  </View>
                )}
                <View className='px-2 py-1 bg-gray-100 rounded text-xs'>
                  PP: {moveDetail.pp}
                </View>
              </View>
              
              <Text className='text-gray-700'>
                {getMoveDescription()}
              </Text>
              
              {/* 额外效果信息 */}
              {moveDetail.meta && (
                <View className='mt-3 pt-3 border-t border-gray-100'>
                  <View className='grid grid-cols-2 gap-2'>
                    {moveDetail.meta.min_hits !== undefined && moveDetail.meta.max_hits !== undefined && (
                      <View className='text-xs text-gray-600'>
                        命中次数: {moveDetail.meta.min_hits}-{moveDetail.meta.max_hits}
                      </View>
                    )}
                    {moveDetail.meta.drain !== 0 && moveDetail.meta.drain !== undefined && (
                      <View className='text-xs text-gray-600'>
                        吸取: {moveDetail.meta.drain}%
                      </View>
                    )}
                    {moveDetail.meta.healing !== 0 && moveDetail.meta.healing !== undefined && (
                      <View className='text-xs text-gray-600'>
                        回复: {moveDetail.meta.healing}%
                      </View>
                    )}
                    {moveDetail.meta.crit_rate !== undefined && moveDetail.meta.crit_rate > 0 && (
                      <View className='text-xs text-gray-600'>
                        要害几率: +{moveDetail.meta.crit_rate}
                      </View>
                    )}
                    {moveDetail.meta.flinch_chance !== undefined && moveDetail.meta.flinch_chance > 0 && (
                      <View className='text-xs text-gray-600'>
                        畏缩几率: {moveDetail.meta.flinch_chance}%
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const MovesList: React.FC<MovesListProps> = ({ moves }) => {
  const { 
    moves: processedMoves, 
    moveDetails, 
    loading, 
    loadMoveDetail, 
    preloadAllMoves, 
    isPreloading 
  } = usePokemonMoves(moves);
  const [expandedMove, setExpandedMove] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('level-up'); // 默认只显示升级技能
  const [loadedMovesCount, setLoadedMovesCount] = useState(0);

  // 在组件挂载时启动后台预加载，但不阻塞界面
  useEffect(() => {
    if (processedMoves.length > 0) {
      console.log('在后台开始预加载技能详情...');
      // 启动后台预加载，不会阻塞界面显示
      preloadAllMoves();
    }
  }, [processedMoves, preloadAllMoves]);

  // 跟踪已加载的技能数量
  useEffect(() => {
    const count = Object.keys(moveDetails).length;
    setLoadedMovesCount(count);
  }, [moveDetails]);

  // 根据过滤条件筛选技能
  const filteredMoves = processedMoves.filter(move => {
    if (filter === 'all') return true;
    return move.learn_method === filter;
  });
  
  // 计算各类别技能数量
  const learnMethodCounts = processedMoves.reduce((acc, move) => {
    acc[move.learn_method] = (acc[move.learn_method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const handleMoveClick = (moveName: string) => {
    if (expandedMove === moveName) {
      setExpandedMove(null);
    } else {
      setExpandedMove(moveName);
      // 如果展开技能但还没有加载详情，则加载详情
      if (!moveDetails[moveName]) {
        loadMoveDetail(moveName);
      }
    }
  };

  return (
    <View className='moves-list'>
      <View className='section-title mb-4 flex justify-between items-center'>
        <Text>技能</Text>
        {isPreloading && (
          <View className='flex items-center'>
            <LoadingSpinner size='mini' />
            <Text className='ml-2 text-xs text-gray-500'>
              加载中 ({loadedMovesCount}/{processedMoves.length})
            </Text>
          </View>
        )}
      </View>
      
      {/* 过滤器 */}
      <ScrollView scrollX className='pb-2 mb-4 whitespace-nowrap'>
        <View className='flex'>
          <View 
            className={`mr-2 px-4 py-2 rounded-full ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            <Text className={filter === 'all' ? 'text-white' : 'text-gray-700'}>
              全部 ({processedMoves.length})
            </Text>
          </View>
          
          {/* 🎯 默认只显示"升级"技能，其他学习方式已注释 */}
          <View 
            className={`mr-2 px-4 py-2 rounded-full ${filter === 'level-up' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setFilter('level-up')}
          >
            <Text className={filter === 'level-up' ? 'text-white' : 'text-gray-700'}>
              升级 ({learnMethodCounts['level-up'] || 0})
            </Text>
          </View>
          
          {/* 
          // 🔒 注释其他学习方式的过滤器
          {Object.entries(learnMethodCounts)
            .filter(([method]) => method !== 'level-up') // 排除已显示的升级
            .map(([method, count]) => (
            <View 
              key={method}
              className={`mr-2 px-4 py-2 rounded-full ${filter === method ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setFilter(method)}
            >
              <Text className={filter === method ? 'text-white' : 'text-gray-700'}>
                {formatLearnMethod(method)} ({count})
              </Text>
            </View>
          ))}
          */}
        </View>
      </ScrollView>

      {/* 技能列表 */}
      <View className='moves-container'>
        {filteredMoves.length > 0 ? (
          filteredMoves.map((move, index) => (
            <MoveItem
              key={`${move.name}-${index}`}
              name={move.name}
              level={move.level_learned_at}
              method={move.learn_method}
              moveDetail={moveDetails[move.name] || null}
              onExpand={() => handleMoveClick(move.name)}
              isExpanded={expandedMove === move.name}
              isLoading={loading && expandedMove === move.name && !moveDetails[move.name]}
            />
          ))
        ) : (
          <View className='text-center p-4'>
            <Text className='text-gray-500'>没有找到技能</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MovesList; 