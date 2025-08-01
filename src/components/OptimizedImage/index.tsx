import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Image, Text } from '@tarojs/components';
import LoadingSpinner from '../LoadingSpinner';
import './style.less';

interface OptimizedImageProps {
  // 图片源配置
  primarySrc?: string;
  fallbackSrcs?: string[];
  placeholder?: string;
  
  // 样式配置
  className?: string;
  style?: React.CSSProperties;
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix';
  
  // 功能配置
  showLoadingSpinner?: boolean;
  showErrorPlaceholder?: boolean;
  retryDelay?: number;
  
  // 事件回调
  onLoad?: () => void;
  onError?: (error: any) => void;
  onRetry?: (attempt: number) => void;
  
  // 调试信息
  debugMode?: boolean;
  imageName?: string;
}

interface ImageSource {
  url: string;
  type: 'primary' | 'fallback' | 'placeholder';
  label?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  primarySrc,
  fallbackSrcs = [],
  placeholder,
  className = '',
  style = {},
  mode = 'aspectFit',
  showLoadingSpinner = true,
  showErrorPlaceholder = true,
  retryDelay = 1000,
  onLoad,
  onError,
  onRetry,
  debugMode = false,
  imageName = 'Image'
}) => {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🎯 构建图片源列表
  const imageSources = useMemo((): ImageSource[] => {
    const sources: ImageSource[] = [];
    
    // 主要图片源
    if (primarySrc) {
      sources.push({ url: primarySrc, type: 'primary', label: 'Primary Source' });
    }
    
    // 备选图片源
    fallbackSrcs.forEach((src, index) => {
      if (src) {
        sources.push({ 
          url: src, 
          type: 'fallback', 
          label: `Fallback ${index + 1}` 
        });
      }
    });
    
    // 占位符
    if (placeholder) {
      sources.push({ url: placeholder, type: 'placeholder', label: 'Placeholder' });
    }
    
    return sources.filter(source => source.url);
  }, [primarySrc, fallbackSrcs, placeholder]);

  const currentSource = imageSources[currentSourceIndex];

  // 🎯 重置状态（当图片源变化时）
  useEffect(() => {
    setCurrentSourceIndex(0);
    setImageLoaded(false);
    setImageError(false);
    setIsLoading(true);
    setRetryAttempts(0);
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, [primarySrc, fallbackSrcs.join(','), placeholder]);

  // 🎯 图片加载成功处理
  const handleImageLoad = useCallback(() => {
    if (debugMode) {
      console.log(`✅ ${imageName} 加载成功:`, currentSource?.label, currentSource?.url?.substring(0, 50));
    }
    
    setImageLoaded(true);
    setImageError(false);
    setIsLoading(false);
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    onLoad?.();
  }, [currentSource, debugMode, imageName, onLoad]);

  // 🎯 图片加载失败处理
  const handleImageError = useCallback((error: any) => {
    if (debugMode) {
      console.log(`❌ ${imageName} 加载失败:`, currentSource?.label, error);
    }

    // 如果还有其他图片源可以尝试
    if (currentSourceIndex < imageSources.length - 1) {
      const nextIndex = currentSourceIndex + 1;
      const nextSource = imageSources[nextIndex];
      
      if (debugMode) {
        console.log(`🔄 ${imageName} 尝试下一个源 (${nextIndex + 1}/${imageSources.length}):`, nextSource?.label);
      }
      
      // 延迟切换到下一个图片源
      retryTimeoutRef.current = setTimeout(() => {
        setCurrentSourceIndex(nextIndex);
        setImageError(false);
        setIsLoading(true);
        setRetryAttempts(prev => prev + 1);
        
        onRetry?.(retryAttempts + 1);
      }, retryDelay);
      
      return;
    }

    // 所有图片源都失败了
    if (debugMode) {
      console.error(`💥 ${imageName} 所有图片源都加载失败`);
    }
    
    setImageError(true);
    setImageLoaded(false);
    setIsLoading(false);
    
    onError?.(error);
  }, [
    currentSourceIndex, 
    imageSources, 
    retryDelay, 
    retryAttempts, 
    debugMode, 
    imageName,
    onRetry,
    onError
  ]);

  // 🎯 清理定时器
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // 如果没有可用的图片源
  if (imageSources.length === 0) {
    return (
      <View className={`optimized-image-container ${className}`} style={style}>
        <View className='image-placeholder error'>
          <Text className='text-gray-500 text-sm'>无可用图片</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={`optimized-image-container ${className}`} style={style}>
      {/* 加载中状态 */}
      {isLoading && showLoadingSpinner && (
        <View className='image-loading-overlay'>
          <LoadingSpinner size='small' />
          {debugMode && (
            <Text className='text-xs text-gray-500 mt-1'>
              {currentSource?.label} 加载中...
            </Text>
          )}
        </View>
      )}
      
      {/* 错误状态 */}
      {imageError && showErrorPlaceholder && (
        <View className='image-placeholder error'>
          <Text className='text-gray-500 text-sm'>图片加载失败</Text>
          {debugMode && (
            <Text className='text-xs text-gray-400 mt-1'>
              尝试了 {imageSources.length} 个图片源
            </Text>
          )}
        </View>
      )}
      
      {/* 实际图片 */}
      {currentSource && !imageError && (
        <Image
          src={currentSource.url}
          className={`optimized-image ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
          style={{ 
            transition: 'opacity 0.3s ease-in-out',
            ...style
          }}
          mode={mode}
          onLoad={handleImageLoad}
          onError={handleImageError}
          lazyLoad
        />
      )}
      
      {/* 调试信息 */}
      {debugMode && (
        <View className='debug-info'>
          <Text className='text-xs text-blue-600'>
            {imageName}: {currentSource?.label} ({currentSourceIndex + 1}/{imageSources.length})
          </Text>
          {retryAttempts > 0 && (
            <Text className='text-xs text-orange-600'>
              重试次数: {retryAttempts}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default OptimizedImage; 