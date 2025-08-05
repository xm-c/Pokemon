import React, { useState, useEffect, useRef } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import SearchBar from '../../components/SearchBar';
import PokemonCard from '../../components/PokemonCard/';
import LoadingSpinner from '../../components/LoadingSpinner/';
import { usePokemonList } from '../../hooks/usePokemonData';
// import { useBatchChineseNames } from '../../hooks/useChineseName'; // 可选优化：批量获取中文名称
import './index.less';

// 底部状态组件
const BottomStatus = ({ loading, hasMore, pagesLoaded = 1, cachingImages = false, className = '' }) => {
  return (
    <View className={`py-2 flex justify-center items-center text-sm text-gray-500 ${className}`}>
      {loading ? (
        <View className='flex items-center'>
          <LoadingSpinner size='mini' />
          <Text className='ml-2'>加载中...</Text>
        </View>
      ) : hasMore ? (
        <Text>上滑加载更多</Text>
      ) : (
        <View className='flex flex-col items-center'>
          <Text>已加载全部 {pagesLoaded} 页数据</Text>
          {cachingImages && (
            <Text className='text-xs mt-1 text-gray-400'>正在缓存图片...</Text>
          )}
        </View>
      )}
    </View>
  );
};

const Index: React.FC = () => {
  // 追踪组件是否已挂载
  const isMounted = useRef(false);
  // 追踪是否正在下拉刷新状态
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  // 需要滚动到顶部的标记
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  // 防止重复加载
  const isLoadingRef = useRef(false);
  const loadMoreTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 滚动节流控制
  const lastScrollTimeRef = useRef(0);
  // 视口高度
  const [viewportHeight, setViewportHeight] = useState(600);
  
  const { 
    pokemons, 
    loading, 
    hasMore, 
    totalCount,
    searchPokemon,
    resetSearch,
    loadMore 
  } = usePokemonList();

  // 🎯 可选优化：批量获取中文名称以提升列表性能
  // const pokemonNames = pokemons.map(p => p.name);
  // const chineseNamesMap = useBatchChineseNames(pokemonNames);
  
  // 获取设备信息以设置视口高度
  useEffect(() => {
    const getSystemInfo = async () => {
      try {
        const info = await Taro.getSystemInfo();
        const height = info.windowHeight;
        // 减去搜索栏和统计信息的高度（根据实际情况调整）
        const listHeight = height - 120;
        setViewportHeight(listHeight > 0 ? listHeight : 600);
      } catch (e) {
        console.error('获取设备信息失败', e);
      }
    };
    
    getSystemInfo();
  }, []);
  
  // 处理滚动事件，仅用于监控滚动位置
  const handleScroll = () => {
    const now = Date.now();
    // 每16ms才处理一次滚动事件（约60fps）
    if (now - lastScrollTimeRef.current < 16) {
      return;
    }
    
    lastScrollTimeRef.current = now;
    
    // 用户已经开始滚动，清除滚动到顶部的标记
    if (shouldScrollToTop) {
      setShouldScrollToTop(false);
    }
  };

  // 处理滚动到底部，触发加载更多
  const handleScrollToLower = () => {
    tryLoadMore();
  };

  // 尝试加载更多数据
  const tryLoadMore = () => {
    // 如果已经在加载中，或没有更多数据，则不触发
    if (loading || !hasMore || isLoadingRef.current) {
      return;
    }
    
    // 设置加载锁，防止重复触发
    isLoadingRef.current = true;
    
    // 清除之前的定时器
    if (loadMoreTimerRef.current) {
      clearTimeout(loadMoreTimerRef.current);
    }
    
    // 添加防抖，避免短时间内多次触发
    loadMoreTimerRef.current = setTimeout(() => {
      loadMore().finally(() => {
        // 加载完成后释放锁
        setTimeout(() => {
          isLoadingRef.current = false;
        }, 500); // 减少锁定时间，提高响应性
      });
    }, 200);
  };
  
  // 处理下拉刷新
  const handlePullDownRefresh = async () => {
    // 如果已经在刷新中，则不重复触发
    if (isPullRefreshing) {
      return;
    }
    
    setIsPullRefreshing(true);
    // 标记需要滚动到顶部
    setShouldScrollToTop(true);
    
    try {
      await resetSearch();
    } finally {
      // 延迟重置刷新状态，确保动画效果
      setTimeout(() => {
        setIsPullRefreshing(false);
      }, 600); // 减少延迟时间
    }
  };

  // 处理搜索
  const handleSearch = (params) => {
    // 搜索时标记需要滚动到顶部
    setShouldScrollToTop(true);
    searchPokemon(params);
  };

  // 清除定时器
  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current) {
        clearTimeout(loadMoreTimerRef.current);
      }
    };
  }, []);

  // 监听loading状态变化
  useEffect(() => {
    // 当加载状态结束，重置加载锁
    if (!loading) {
      // 延迟释放锁，避免连续触发
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 200);
    }
  }, [loading]);

  // 设置组件挂载标志
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 当页面显示时检查是否有待处理的搜索请求
  useDidShow(() => {
    // 延迟处理以确保页面完全加载
    setTimeout(() => {
      if (!isMounted.current) return;
      
      try {
        // 检查是否有待处理的搜索请求
        const shouldSearch = Taro.getStorageSync('shouldSearch');
        
        if (shouldSearch) {
          // 获取搜索参数
          const searchParams = Taro.getStorageSync('currentSearchParams');
          
          if (searchParams) {
            console.log('检测到待处理的搜索请求:', searchParams);
            // 执行搜索
            handleSearch(searchParams);
          }
          
          // 清除标志和搜索参数
          Taro.removeStorageSync('shouldSearch');
          Taro.removeStorageSync('currentSearchParams');
        }
      } catch (err) {
        console.error('处理待搜索请求失败:', err);
      }
    }, 300);
  });

  return (
    <View className='index-page'>
      {/* 背景层 - 使用pointer-events: none避免干扰交互 */}
      <View className='background-layer'>
        {/* 炫酷动态背景 */}
        <View className='animated-background'>
          {/* 浮动圆形装饰 */}
          {[...Array(8)].map((_, i) => (
            <View key={i} className={`floating-circle circle-${i + 1}`} />
          ))}
          
          {/* 宝可梦元素装饰 */}
          <View className='poke-element element-1'></View>
          <View className='poke-element element-2'></View>
          <View className='poke-element element-3'></View>
          
          {/* 渐变气泡 */}
          <View className='gradient-bubble bubble-1'></View>
          <View className='gradient-bubble bubble-2'></View>
          <View className='gradient-bubble bubble-3'></View>
          
          {/* 光线效果 */}
          <View className='light-beam beam-1'></View>
          <View className='light-beam beam-2'></View>
          
          {/* 波浪效果 */}
          <View className='wave-container'>
            <View className='wave wave-1'></View>
            <View className='wave wave-2'></View>
            <View className='wave wave-3'></View>
          </View>
        </View>
      </View>
      
      {/* 顶部动画 */}
      <View className='header-animation'>
        <View className='pokemon-logo-container'>
          <View className='pokemon-logo-highlight'></View>
        </View>
      </View>
      
      {/* 内容区域 */}
      <View className='content-area'>
        {/* 固定区域：搜索栏和统计信息 */}
        <View className='p-4 pb-0 box-border'>
          <SearchBar onSearch={handleSearch} />
        </View>
        
        <View className='px-4 mb-2 flex justify-between box-border'>
          <Text className='text-sm text-gray-600'>
            总计: {totalCount} 只宝可梦
          </Text>
          {loading && pokemons.length > 0 && (
            <Text className='text-sm text-gray-600'>加载中...</Text>
          )}
        </View>

        {/* 列表区域 */}
        {pokemons.length > 0 ? (
          <ScrollView 
            className='pokemon-list px-4 box-border gpu-accelerated'
            scrollY
            enableBackToTop
            enhanced
            showScrollbar={false}
            scrollTop={shouldScrollToTop ? 0 : undefined}
            onScroll={handleScroll}
            refresherEnabled
            refresherTriggered={isPullRefreshing}
            onRefresherRefresh={handlePullDownRefresh}
            onScrollToLower={handleScrollToLower}
            lowerThreshold={50}
            scrollWithAnimation
            style={{ height: `${viewportHeight}px` }}
          >
            {/* 下拉刷新提示 */}
            {isPullRefreshing && (
              <View className='py-2 flex justify-center items-center'>
                <LoadingSpinner size='small' />
                <Text className='text-sm text-gray-500 ml-2'>刷新中...</Text>
              </View>
            )}
            
            {/* 宝可梦列表 */}
            <View className='pokemon-grid'>
              {pokemons.map(pokemon => (
                <View key={pokemon.name} className='pokemon-grid-item'>
                  <PokemonCard name={pokemon.name} url={pokemon.url} />
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          /* 当没有数据或者在加载中时显示 */
          <View className='flex-1 flex justify-center items-center'>
            {loading ? (
              <View className='py-4 flex justify-center'>
                <LoadingSpinner size='medium' />
              </View>
            ) : (
              /* 无搜索结果 */
              <View className='py-8 flex flex-col items-center justify-center'>
                <Text className='text-xl text-gray-400 mb-2'>ヽ(。_°)ノ</Text>
                <Text className='text-gray-500'>未找到符合条件的宝可梦</Text>
                <View 
                  className='mt-4 px-4 py-2 bg-primary rounded-full'
                  onClick={() => resetSearch()}
                >
                  <Text className='text-white'>重置搜索</Text>
                </View>
              </View>
            )}
          </View>
        )}
        
        {/* 底部加载状态 - 只在虚拟列表外显示，用作提示 */}
        <BottomStatus 
          loading={loading}
          hasMore={hasMore}
          pagesLoaded={Math.ceil(pokemons.length / 20)}
          cachingImages={pokemons.length > 0}
          className='mb-0'
        />
        
        {/* 底部安全区域间距 */}
        <View style={{height: 'env(safe-area-inset-bottom)'}} />
      </View>
      
      {/* 免责声明 - 固定在页面最底部 */}
      <View className='disclaimer-fixed'>
        <Text className='disclaimer-text'>
          ⚠️ 非官方应用，页面仅供展示学习使用
        </Text>
      </View>
    </View>
  );
};

export default Index;
