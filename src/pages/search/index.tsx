import React, { useState, useEffect } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { POKEMON_TYPES, REGIONS } from '../../utils/constants';
import TypeBadge from '../../components/TypeBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import './index.less';

interface SearchHistoryItem {
  name?: string;
  type?: string;
  region?: string;
  timestamp: number;
}

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 每次进入页面时重置搜索状态
  useDidShow(() => {
    setIsSearching(false);
    setError(null);
  });

  // 从本地存储加载搜索历史
  useEffect(() => {
    try {
      const storedHistory = Taro.getStorageSync('searchHistory');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (err) {
      console.error('加载搜索历史失败:', err);
    }
  }, []);

  // 保存搜索历史到本地存储
  const saveSearchToHistory = (params: { name?: string; type?: string; region?: string }) => {
    try {
      // 只有当至少有一个搜索条件时才保存
      if (!params.name && !params.type && !params.region) return;
      
      const newSearch: SearchHistoryItem = {
        ...params,
        timestamp: Date.now()
      };
      
      // 防止重复添加相同的搜索条件
      const isDuplicate = searchHistory.some(item => 
        item.name === newSearch.name &&
        item.type === newSearch.type &&
        item.region === newSearch.region
      );
      
      if (isDuplicate) {
        // 如果是重复的搜索，更新时间戳，并移到最前面
        const updatedHistory = searchHistory
          .filter(item => 
            item.name !== newSearch.name || 
            item.type !== newSearch.type || 
            item.region !== newSearch.region
          );
        const newHistory = [newSearch, ...updatedHistory].slice(0, 10);
        setSearchHistory(newHistory);
        Taro.setStorageSync('searchHistory', JSON.stringify(newHistory));
      } else {
        // 添加到历史记录，保持最新的10条
        const updatedHistory = [newSearch, ...searchHistory].slice(0, 10);
        setSearchHistory(updatedHistory);
        Taro.setStorageSync('searchHistory', JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error('保存搜索历史失败:', err);
    }
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    try {
      setSearchHistory([]);
      Taro.removeStorageSync('searchHistory');
      Taro.showToast({
        title: '搜索历史已清除',
        icon: 'success',
        duration: 1500
      });
    } catch (err) {
      console.error('清除搜索历史失败:', err);
    }
  };

  // 执行搜索
  const handleSearch = () => {
    try {
      // 验证搜索条件
      const hasSearchCriteria = searchText || selectedType || selectedRegion;
      if (!hasSearchCriteria) {
        setError('请输入搜索内容或选择筛选条件');
        return;
      }
      
      setError(null);
      setIsSearching(true);
      
      const searchParams = {
        name: searchText.trim() || undefined,
        type: selectedType || undefined,
        region: selectedRegion || undefined
      };
      
      // 保存到历史记录
      saveSearchToHistory(searchParams);
      
      // 将搜索参数存储到本地，供首页使用
      Taro.setStorageSync('currentSearchParams', searchParams);
      
      // 设置一个标志，表示需要在首页执行搜索
      Taro.setStorageSync('shouldSearch', true);
      
      // 跳转回主页
      Taro.navigateBack({
        success: () => {
          console.log('已返回首页，搜索参数已保存:', searchParams);
        },
        fail: (err) => {
          console.error('返回主页失败:', err);
          setError('返回主页失败，请重试');
          setIsSearching(false);
        },
        complete: () => {
          // 无论成功还是失败，重置搜索状态
          setTimeout(() => setIsSearching(false), 100);
        }
      });
    } catch (err) {
      console.error('搜索操作失败:', err);
      setError('搜索过程中出错，请重试');
      setIsSearching(false);
    }
  };

  // 从历史记录执行搜索
  const searchFromHistory = (item: SearchHistoryItem) => {
    try {
      setSearchText(item.name || '');
      setSelectedType(item.type || null);
      setSelectedRegion(item.region || null);
      setIsSearching(true);
      
      // 将搜索参数存储到本地，供首页使用
      const searchParams = {
        name: item.name || undefined,
        type: item.type || undefined,
        region: item.region || undefined
      };
      
      Taro.setStorageSync('currentSearchParams', searchParams);
      
      // 设置一个标志，表示需要在首页执行搜索
      Taro.setStorageSync('shouldSearch', true);
      
      // 跳转回主页
      Taro.navigateBack({
        success: () => {
          console.log('已返回首页，搜索参数已保存:', searchParams);
        },
        fail: (err) => {
          console.error('返回主页失败:', err);
          setError('返回主页失败，请重试');
          setIsSearching(false);
        },
        complete: () => {
          // 无论成功还是失败，重置搜索状态
          setTimeout(() => setIsSearching(false), 100);
        }
      });
    } catch (err) {
      console.error('从历史记录搜索失败:', err);
      setError('搜索过程中出错，请重试');
      setIsSearching(false);
    }
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchText('');
    setSelectedType(null);
    setSelectedRegion(null);
    setError(null);
  };

  return (
    <View className='search-page'>
      <View className='search-animation' />
      
      {/* 搜索框 */}
      <View className='p-4'>
        <View className='search-box mb-4'>
          <View className='relative flex items-center bg-white rounded-full shadow-md px-5 py-3'>
            <Text className='text-xl text-gray-400 font-bold mr-3'>🔍</Text>
            <Input
              className='flex-1 text-base'
              type='text'
              placeholder='搜索宝可梦...'
              value={searchText}
              onInput={(e) => setSearchText(e.detail.value)}
              onConfirm={handleSearch}
              disabled={isSearching}
              focus
            />
            {searchText && (
              <View className='ml-2' onClick={() => setSearchText('')}>
                <Text className='text-xl text-gray-400'>✕</Text>
              </View>
            )}
          </View>
        </View>

        {/* 错误提示 */}
        {error && (
          <View className='bg-red-100 rounded-lg p-2 mb-4'>
            <Text className='text-red-600 text-sm'>{error}</Text>
          </View>
        )}

        <ScrollView className='pb-safe' scrollY>
          {/* 类型筛选 */}
          <View className='filter-section bg-white rounded-lg p-4 mb-4'>
            <View className='filter-title mb-3'>
              <Text className='text-base font-medium'>按类型筛选</Text>
            </View>
            <View className='filter-grid'>
              {Object.entries(POKEMON_TYPES).map(([key, { name, color }]) => (
                <View 
                  key={key}
                  className={`filter-chip ${selectedType === key ? 'filter-chip-selected' : ''}`}
                  style={{ 
                    backgroundColor: selectedType === key ? color : '#f1f1f1',
                    color: selectedType === key ? '#fff' : '#333'
                  }}
                  onClick={() => setSelectedType(selectedType === key ? null : key)}
                >
                  <Text className='text-base'>{name}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* 地区筛选 */}
          <View className='filter-section bg-white rounded-lg p-4 mb-4'>
            <View className='filter-title mb-3'>
              <Text className='text-base font-medium'>按地区筛选</Text>
            </View>
            <View className='filter-grid'>
              {REGIONS.map(({ id, name }) => (
                <View
                  key={id}
                  className={`filter-chip ${selectedRegion === id ? 'filter-chip-selected' : ''}`}
                  style={{ 
                    backgroundColor: selectedRegion === id ? '#3B4CCA' : '#f1f1f1',
                    color: selectedRegion === id ? '#fff' : '#333'
                  }}
                  onClick={() => setSelectedRegion(selectedRegion === id ? null : id)}
                >
                  <Text className='text-base'>{name}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* 操作按钮 */}
          <View className='flex justify-between px-4 mb-6'>
            <View 
              className='px-6 py-3 bg-gray-200 rounded-lg flex items-center justify-center'
              onClick={resetFilters}
            >
              <Text className='text-base text-gray-700'>重置</Text>
            </View>
            <View 
              className={`px-6 py-3 bg-primary rounded-lg flex items-center justify-center ${isSearching ? 'opacity-70' : ''}`}
              onClick={isSearching ? undefined : handleSearch}
            >
              {isSearching ? (
                <LoadingSpinner size='small' />
              ) : (
                <Text className='text-base text-white'>搜索</Text>
              )}
            </View>
          </View>
          
          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <View className='recent-searches px-4'>
              <View className='flex justify-between items-center mb-3'>
                <Text className='text-base text-gray-600'>最近搜索</Text>
                <View onClick={clearSearchHistory}>
                  <Text className='text-sm text-primary'>清除</Text>
                </View>
              </View>
              
              {searchHistory.map((item, index) => (
                <View 
                  key={`history-${index}`}
                  className='search-history-item'
                  onClick={() => !isSearching && searchFromHistory(item)}
                >
                  <View>
                    {item.name && (
                      <Text className='text-base'>{item.name}</Text>
                    )}
                    <View className='flex gap-2 mt-1'>
                      {item.type && (
                        <TypeBadge type={item.type} className='type-badge' />
                      )}
                      {item.region && (
                        <View className='bg-secondary px-2 py-1 rounded-full'>
                          <Text className='text-white text-sm'>{
                            REGIONS.find(r => r.id === item.region)?.name || item.region
                          }</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text className='text-sm text-gray-400'>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Search; 