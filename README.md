# 宝可梦图鉴小程序

一款基于Taro框架的宝可梦检索小程序。

## 性能优化

### 虚拟列表实现

为了解决长列表性能问题，我们使用了Taro的高级组件`VirtualList`来实现只渲染可见区域内的宝可梦卡片，这样可以大大提高列表的渲染性能和滚动流畅度。

#### 关键实现

1. **引入虚拟列表组件**
   ```typescript
   import VirtualList from '@tarojs/components-advanced/dist/components/virtual-list/react';
   ```

2. **创建列表项渲染组件**
   ```typescript
   const PokemonItem = React.memo((props: any) => {
     const { id, index, data } = props;
     const pokemon = data[index];
     return (
       <View id={id} className='pokemon-grid-item'>
         <PokemonCard name={pokemon.name} url={pokemon.url} />
       </View>
     );
   });
   ```

3. **使用VirtualList组件渲染列表**
   ```typescript
   <VirtualList
     className='virtual-list'
     height={viewportHeight}
     width='100%'
     itemCount={pokemons.length}
     itemData={pokemons}
     itemSize={ITEM_HEIGHT}
     overscanCount={5}
     onScroll={handleScroll}
     item={PokemonItem}
     onScrollToLower={tryLoadMore}
     lowerThreshold={50}
   />
   ```

4. **处理滚动事件和加载更多**
   ```typescript
   const handleScroll = (e) => {
     const { scrollDirection, scrollOffset } = e;
     setScrollTop(scrollOffset);
     
     // 滚动到底部加载更多
     if (scrollDirection === 'forward' && scrollOffset > 0) {
       const maxScrollOffset = ITEM_HEIGHT * pokemons.length - viewportHeight - 100;
       if (scrollOffset >= maxScrollOffset && hasMore && !loading && !isLoadingRef.current) {
         tryLoadMore();
       }
     }
   };
   ```

5. **添加加载锁防止重复加载**
   ```typescript
   const tryLoadMore = () => {
     // 如果已经在加载中，或没有更多数据，则不触发
     if (loading || !hasMore || isLoadingRef.current) {
       return;
     }
     
     // 设置加载锁，防止重复触发
     isLoadingRef.current = true;
     
     // 添加防抖，避免短时间内多次触发
     loadMoreTimerRef.current = setTimeout(() => {
       loadMore().finally(() => {
         // 加载完成后释放锁
         setTimeout(() => {
           isLoadingRef.current = false;
         }, 800);
       });
     }, 300);
   };
   ```

#### 优化效果

1. **大幅降低内存占用**：只渲染可见区域及附近的项目，而不是所有数据
2. **提高列表滚动流畅度**：减少了DOM节点数量，降低了渲染压力
3. **缩短了初始加载时间**：不需要等待所有项目渲染完成
4. **防止重复加载请求**：通过加载锁和防抖机制避免频繁触发加载

## 运行环境要求

- Node.js 20+
- Taro 4.1.4+

## 启动项目

```bash
# 安装依赖
npm install

# 开发模式启动微信小程序
npm run dev:weapp
``` 