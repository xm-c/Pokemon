# PokemonCard 组件

## 简介

PokemonCard 组件是一个展示单个宝可梦信息的卡片组件，包含基本信息、类型标签、统计数据和图片。

## 特点

- 独立的加载状态与动画效果
- 图片缓存优化
- 中文名称支持
- 统计数据可视化
- 类型标签展示

## 文件结构

- `index.tsx`: 组件主要逻辑与渲染
- `style.less`: 组件专用样式，包含加载动画
- `README.md`: 组件文档

## 使用方法

```tsx
import PokemonCard from '../../components/PokemonCard';

// 在组件中使用
<PokemonCard 
  name="bulbasaur" 
  url="https://pokeapi.co/api/v2/pokemon/1/" 
  onClick={(id) => handlePokemonClick(id)}
/>
```

## 参数说明

| 参数名 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 宝可梦名称 |
| url | string | 是 | 宝可梦API URL |
| onClick | (id: number) => void | 否 | 点击卡片回调函数 |

## 加载状态

组件内部实现了独立的加载动画，具有以下特点：

- 精灵球摇摆动画
- 卡片专用样式命名空间（card-*）
- 纯CSS实现，无依赖

## 注意事项

- 组件会自动从URL中提取ID进行数据请求
- 会同时获取species数据以显示中文名称
- 图片使用`getCachedImagePath`进行本地缓存 