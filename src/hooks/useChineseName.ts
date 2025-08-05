import { useState, useEffect } from 'react';
import { getPokemonChineseName } from '../utils/pokemonNames';
import { speciesCacheManager } from '../services/speciesCache';

interface UseChineseNameOptions {
  priority?: 'local' | 'api' | 'both'; // 优先级策略
  enableApiUpdate?: boolean; // 是否启用API更新
}

interface UseChineseNameResult {
  chineseName: string | null;
  isLoading: boolean;
  source: 'local' | 'api' | 'none';
  error: string | null;
}

/**
 * 渐进式中文名称获取Hook
 * 1. 首先显示本地映射表中的名称（快速显示）
 * 2. 异步获取API官方名称（更准确）
 * 3. 如果API有更好的名称，则更新显示
 */
export function useChineseName(
  name: string, 
  species?: any,
  options: UseChineseNameOptions = {}
): UseChineseNameResult {
  const {
    priority = 'both',
    enableApiUpdate = true
  } = options;

  const [chineseName, setChineseName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<'local' | 'api' | 'none'>('none');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    let mounted = true;
    let currentLocalName: string | null = null;
    
    const loadChineseName = async () => {
      try {
        // 重置状态
        setError(null);
        
        // 策略1: 优先使用本地映射表（快速显示）
        if (priority === 'local' || priority === 'both') {
          const localName = getPokemonChineseName(name, species);
          currentLocalName = localName;
          if (localName && mounted) {
            // 确保返回纯中文名称，不包含英文部分
            const pureName = localName.includes('（') ? localName.split('（')[0] : localName;
            setChineseName(pureName);
            setSource('local');
          }
        }

        // 策略2: 如果启用API更新，异步获取官方名称
        if (enableApiUpdate && (priority === 'api' || priority === 'both')) {
          setIsLoading(true);
          
          try {
            const apiName = await speciesCacheManager.getChineseName(name);
            
            if (mounted && apiName) {
              // 只有当API名称与本地名称不同时才更新
              if (apiName !== currentLocalName) {
                setChineseName(apiName);
                setSource('api');
              }
            }
          } catch (apiError) {
            console.warn(`获取${name}的API中文名称失败:`, apiError);
            setError('API获取失败');
          } finally {
            if (mounted) {
              setIsLoading(false);
            }
          }
        }

        // 策略3: 如果仍然没有中文名称，保持为null（由显示组件决定格式）
        if (!currentLocalName && mounted && !chineseName) {
          setChineseName(null);
          setSource('none');
        }

      } catch (err) {
        if (mounted) {
          setError(`加载中文名称失败: ${err}`);
          setChineseName(null); // 错误时不设置中文名称
          setSource('none');
          setIsLoading(false);
        }
      }
    };

    loadChineseName();

    return () => {
      mounted = false;
    };
  }, [name, species, priority, enableApiUpdate]);

  return {
    chineseName,
    isLoading,
    source,
    error
  };
}

/**
 * 批量中文名称获取Hook
 * 用于列表页面的批量优化
 */
export function useBatchChineseNames(names: string[]): Record<string, UseChineseNameResult> {
  const [results, setResults] = useState<Record<string, UseChineseNameResult>>({});

  useEffect(() => {
    if (!names || names.length === 0) return;

    let mounted = true;

    const loadBatchNames = async () => {
      
      try {
        // 首先设置本地名称
        const localResults: Record<string, UseChineseNameResult> = {};
        names.forEach(name => {
          const localName = getPokemonChineseName(name);
          // 确保返回纯中文名称，不包含英文部分
          const pureName = localName && localName.includes('（') ? localName.split('（')[0] : localName;
          localResults[name] = {
            chineseName: pureName || null,
            isLoading: !!pureName, // 如果有本地名称，标记为加载中以获取API名称
            source: pureName ? 'local' : 'none',
            error: null
          };
        });

        if (mounted) {
          setResults(localResults);
        }

        // 批量获取API名称
        const apiResults = await speciesCacheManager.getBatchChineseNames(names);
        
        if (mounted) {
          const updatedResults = { ...localResults };
          Object.entries(apiResults).forEach(([key, apiName]) => {
            const originalName = names.find(n => n.toLowerCase() === key);
            if (originalName && apiName) {
              // 确保API返回的也是纯中文名称
              const pureApiName = apiName.includes('（') ? apiName.split('（')[0] : apiName;
              updatedResults[originalName] = {
                chineseName: pureApiName,
                isLoading: false,
                source: 'api',
                error: null
              };
            } else if (originalName) {
              updatedResults[originalName] = {
                ...updatedResults[originalName],
                isLoading: false
              };
            }
          });
          
          setResults(updatedResults);
        }
      } catch (error) {
        console.warn('批量获取中文名称失败:', error);
        if (mounted) {
          const errorResults: Record<string, UseChineseNameResult> = {};
          names.forEach(name => {
            errorResults[name] = {
              chineseName: null, // 错误时不返回任何中文名称
              isLoading: false,
              source: 'none',
              error: '批量获取失败'
            };
          });
          setResults(errorResults);
        }
      } finally {
        // Batch loading completed
      }
    };

    loadBatchNames();

    return () => {
      mounted = false;
    };
  }, [names]);

  return results;
} 