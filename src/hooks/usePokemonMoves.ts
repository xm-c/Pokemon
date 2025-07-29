import { useState, useEffect } from 'react';
import { getMoveDetail, getMoveDetails } from '../services/api';
import { MoveDetail } from '../services/types';

interface PokemonMoveInfo {
  name: string;
  url: string;
  level_learned_at: number;
  learn_method: string;
  version_group: string;
}

interface UsePokemonMovesResult {
  moves: PokemonMoveInfo[];
  moveDetails: Record<string, MoveDetail>;
  loading: boolean;
  error: boolean;
  loadMoveDetail: (moveName: string) => Promise<void>;
  loadedMoveNames: string[];
  preloadAllMoves: () => Promise<void>;
  isPreloading: boolean;
}

/**
 * 宝可梦技能Hook，用于管理宝可梦的技能数据
 * @param pokemonMoves 宝可梦的技能数据
 * @returns 处理后的技能数据和相关状态
 */
export function usePokemonMoves(pokemonMoves: any[] = []): UsePokemonMovesResult {
  const [moves, setMoves] = useState<PokemonMoveInfo[]>([]);
  const [moveDetails, setMoveDetails] = useState<Record<string, MoveDetail>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loadedMoveNames, setLoadedMoveNames] = useState<string[]>([]);
  const [isPreloading, setIsPreloading] = useState(false);
  
  // 处理技能数据
  useEffect(() => {
    if (!pokemonMoves || !pokemonMoves.length) return;
    
    // 提取并处理技能信息
    const processedMoves = pokemonMoves.map(moveData => {
      const { move, version_group_details } = moveData;
      
      // 使用最新的版本组数据
      const latestVersionDetail = version_group_details.sort((a, b) => {
        return b.version_group.name.localeCompare(a.version_group.name);
      })[0];
      
      return {
        name: move.name,
        url: move.url,
        level_learned_at: latestVersionDetail.level_learned_at,
        learn_method: latestVersionDetail.move_learn_method.name,
        version_group: latestVersionDetail.version_group.name
      };
    });
    
    // 按学习方式和等级排序
    const sortedMoves = processedMoves.sort((a, b) => {
      // 首先按学习方式排序：level-up, machine, egg, tutor, other
      const methodOrder = {
        'level-up': 1,
        'machine': 2,
        'egg': 3,
        'tutor': 4
      };
      
      const aOrder = methodOrder[a.learn_method] || 5;
      const bOrder = methodOrder[b.learn_method] || 5;
      
      if (aOrder !== bOrder) return aOrder - bOrder;
      
      // 如果学习方式相同，按等级排序
      if (a.learn_method === 'level-up') {
        return a.level_learned_at - b.level_learned_at;
      }
      
      // 其他情况按名称排序
      return a.name.localeCompare(b.name);
    });
    
    setMoves(sortedMoves);
  }, [pokemonMoves]);
  
  // 加载技能详情
  const loadMoveDetail = async (moveName: string) => {
    if (moveDetails[moveName] || loadedMoveNames.includes(moveName)) return;
    
    setLoading(true);
    try {
      const moveData = await getMoveDetail(moveName);
      setMoveDetails(prev => ({
        ...prev,
        [moveName]: moveData
      }));
      setLoadedMoveNames(prev => [...prev, moveName]);
      setError(false);
    } catch (err) {
      console.error(`加载技能详情失败: ${moveName}`, err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 预加载所有技能详情
  const preloadAllMoves = async () => {
    // 如果已经在预加载或没有技能，则直接返回
    if (isPreloading || moves.length === 0) return;
    
    setIsPreloading(true);
    
    // 找出还未加载详情的技能
    const unloadedMoves = moves.filter(move => 
      !loadedMoveNames.includes(move.name) && !moveDetails[move.name]
    );
    
    if (unloadedMoves.length === 0) {
      setIsPreloading(false);
      return;
    }
    
    console.log(`开始批量加载 ${unloadedMoves.length} 个技能详情...`);
    
    // 分批加载详情，每次加载5个技能
    const batchSize = 5;
    const totalBatches = Math.ceil(unloadedMoves.length / batchSize);
    
    try {
      for (let i = 0; i < totalBatches; i++) {
        const batchMoves = unloadedMoves.slice(i * batchSize, (i + 1) * batchSize);
        const moveUrls = batchMoves.map(move => move.url);
        
        const batchDetails = await getMoveDetails(moveUrls);
        
        // 将批量加载的详情添加到状态中
        const newDetails: Record<string, MoveDetail> = {};
        batchMoves.forEach((move, index) => {
          newDetails[move.name] = batchDetails[index];
        });
        
        setMoveDetails(prev => ({
          ...prev,
          ...newDetails
        }));
        
        setLoadedMoveNames(prev => [
          ...prev,
          ...batchMoves.map(move => move.name)
        ]);
        
        console.log(`已加载批次 ${i + 1}/${totalBatches}`);
      }
      
      console.log('所有技能详情加载完成');
      setError(false);
    } catch (err) {
      console.error('批量加载技能详情失败:', err);
      setError(true);
    } finally {
      setIsPreloading(false);
    }
  };
  
  return { 
    moves, 
    moveDetails, 
    loading, 
    error,
    loadMoveDetail,
    loadedMoveNames,
    preloadAllMoves,
    isPreloading
  };
} 