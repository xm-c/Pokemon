import React from 'react';
import { View } from '@tarojs/components';
import './style.less';

interface LoadingSpinnerProps {
  size?: 'mini' | 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className = ''
}) => {
  // 根据尺寸设置样式 - 使用固定尺寸
  const sizeClass = {
    mini: 'w-6 h-6',     // 24px × 24px
    small: 'w-10 h-10',  // 40px × 40px
    medium: 'w-16 h-16', // 64px × 64px
    large: 'w-24 h-24'   // 96px × 96px
  };

  return (
    <View className={`flex justify-center items-center ${className}`}>
      {/* 使用固定尺寸的容器 */}
      <View className={`pokeball-container ${sizeClass[size]}`}>
        {/* 精灵球主体 */}
        <View className='pokeball'>
          {/* 精灵球顶部（红色部分） */}
          <View className='pokeball-top'>
            <View className='pokeball-shine'></View>
          </View>
          
          {/* 精灵球底部（白色部分） */}
          <View className='pokeball-bottom'></View>
          
          {/* 精灵球中间黑色带 */}
          <View className='pokeball-band'></View>
          
          {/* 精灵球中间按钮外圈（黑色） */}
          <View className='pokeball-button-outer'></View>
          
          {/* 精灵球中间按钮（白色） */}
          <View className='pokeball-button'></View>
          
          {/* 按钮内圈（发光） */}
          <View className='pokeball-button-inner'></View>
          
          {/* 捕获特效容器 */}
          <View className='pokeball-capture-effect'>
            {/* 捕获光线 */}
            <View className='capture-rays'></View>
            
            {/* 捕获环 */}
            <View className='capture-ring'></View>
            
            {/* 捕获星星 */}
            <View className='capture-star star-1'></View>
            <View className='capture-star star-2'></View>
            <View className='capture-star star-3'></View>
            <View className='capture-star star-4'></View>
            <View className='capture-star star-5'></View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoadingSpinner; 