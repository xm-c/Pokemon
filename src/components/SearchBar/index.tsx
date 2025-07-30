import React, { useState } from 'react';
import { View, Input, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';

interface SearchBarProps {
  onSearch: (params: { name?: string; type?: string; region?: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 搜索处理函数
  const handleSearch = () => {
    // 重置错误状态
    setError(null);
    
    try {
      setIsSearching(true);
      
      // 构建搜索参数
      const searchParams = {
        name: searchText.trim() || undefined
      };
      
      // 判断是否有搜索条件
      const hasSearchCriteria = searchParams.name;
      
      // 如果没有搜索条件，显示提示（除非是重置搜索）
      if (!hasSearchCriteria && searchText !== '') {
        setError('请输入搜索内容');
        setIsSearching(false);
        return;
      }
      
      // 执行搜索
      onSearch(searchParams);
      console.log('执行搜索:', searchParams);
    } catch (e) {
      console.error('搜索出错:', e);
      setError('搜索过程中出错，请重试');
    } finally {
      setIsSearching(false);
    }
  };

  // 前往高级搜索页面
  const goToAdvancedSearch = () => {
    Taro.navigateTo({
      url: '/pages/search/index'
    });
  };

  // 重置搜索
  const resetSearch = () => {
    setSearchText('');
    setError(null);
    onSearch({});
  };

  return (
    <View className='mb-4'>
      {/* 搜索框 */}
      <View className='relative flex items-center bg-white rounded-full shadow-md px-4 py-2 mb-2'>
        <View className='mr-2'>
          <Text className='text-lg text-gray-400 font-bold'>🔍</Text>
        </View>
        <Input
          className='flex-1 text-base'
          type='text'
          placeholder='搜索宝可梦...'
          value={searchText}
          onInput={(e) => setSearchText(e.detail.value)}
          onConfirm={handleSearch}
          disabled={isSearching}
        />
        {searchText && (
          <View 
            className='ml-1 mr-2 p-1'
            onClick={() => {
              setSearchText('');
              setError(null);
            }}
          >
            <Text className='text-lg text-gray-400'>✕</Text>
          </View>
        )}
        <View className='ml-1 flex'>
          <View 
            className={`p-1 rounded-full bg-primary ${isSearching ? 'opacity-70' : ''}`}
            onClick={isSearching ? undefined : handleSearch}
          >
            <Text className='text-white text-sm px-2'>
              {isSearching ? '搜索中...' : '搜索'}
            </Text>
          </View>
        </View>
      </View>

      {/* 错误提示 */}
      {error && (
        <View className='bg-red-100 rounded-lg p-2 mb-2'>
          <Text className='text-red-600 text-sm'>{error}</Text>
        </View>
      )}
      
      {/* 高级搜索链接 */}
      <View className='flex justify-between items-center'>
        <View>
          {searchText && (
            <View 
              className='px-2 py-1 rounded-md bg-gray-200'
              onClick={resetSearch}
            >
              <Text className='text-xs text-gray-700'>清除</Text>
            </View>
          )}
        </View>
        <View
          className='px-2 py-1'
          onClick={goToAdvancedSearch}
        >
          <Text className='text-xs text-primary'>高级搜索</Text>
        </View>
      </View>
    </View>
  );
};

export default SearchBar;

