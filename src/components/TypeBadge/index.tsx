import React from 'react';
import { View, Text } from '@tarojs/components';
import { POKEMON_TYPES } from '../../utils/constants';

interface TypeBadgeProps {
  type: string;
  className?: string;
  showName?: boolean;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className = '', showName = true }) => {
  // 获取类型对应的名称和颜色
  const typeInfo = POKEMON_TYPES[type.toLowerCase()] || { name: type, color: '#A8A878' };
  
  return (
    <View 
      className={`px-2 py-1 rounded-full flex items-center justify-center ${className}`}
      style={{ backgroundColor: typeInfo.color }}
    >
      {showName && (
        <Text className='text-white text-xs font-medium'>{typeInfo.name}</Text>
      )}
    </View>
  );
};

export default TypeBadge;
