# LoadingSpinner 组件

一个生动的精灵球加载动画组件，用于指示内容加载状态。

## 特性

- 高度逼真的精灵球设计
- 多种动画效果组合（弹跳、旋转、脉冲、发光和捕获效果）
- 四种尺寸选项：mini、small、medium、large
- 性能优化：使用 GPU 加速，最小化重绘

## 用法

```tsx
import LoadingSpinner from '../../components/LoadingSpinner';

// 默认尺寸 (medium)
<LoadingSpinner />

// 小尺寸
<LoadingSpinner size='small' />

// 大尺寸
<LoadingSpinner size='large' />

// 自定义类名
<LoadingSpinner className='my-custom-class' />
```

## 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| size | 'mini' \| 'small' \| 'medium' \| 'large' | 'medium' | 组件的尺寸 |
| className | string | '' | 自定义CSS类名 |

## 尺寸对照表

- mini: 24px × 24px
- small: 40px × 40px
- medium: 64px × 64px
- large: 96px × 96px

## 文件结构

```
LoadingSpinner/
├── index.tsx    # 组件主文件
├── style.less   # 样式文件
└── README.md    # 文档
``` 