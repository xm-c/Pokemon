// 🎯 Pokemon图片URL生成工具
// 提供多个备选图片源，提高加载成功率

interface PokemonSprites {
  front_default?: string;
  other?: {
    'official-artwork'?: {
      front_default?: string;
    };
    home?: {
      front_default?: string;
    };
    'dream_world'?: {
      front_default?: string;
    };
  };
  versions?: {
    'generation-v'?: {
      'black-white'?: {
        animated?: {
          front_default?: string;
        };
        front_default?: string;
      };
    };
    'generation-iv'?: {
      'diamond-pearl'?: {
        front_default?: string;
      };
    };
    'generation-iii'?: {
      'ruby-sapphire'?: {
        front_default?: string;
      };
    };
  };
}

// 🎯 生成Pokemon主图片的多个URL源
export const getPokemonMainImageUrls = (id: number, sprites?: PokemonSprites): string[] => {
  const paddedId = id.toString().padStart(3, '0');
  const urls: string[] = [];

  // 1. 官方artwork - 最高质量
  if (sprites?.other?.['official-artwork']?.front_default) {
    urls.push(sprites.other['official-artwork'].front_default);
  }
  
  // 2. 官方Pokemon网站图片
  urls.push(`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`);
  
  // 3. Home版本图片 - 高质量3D风格
  if (sprites?.other?.home?.front_default) {
    urls.push(sprites.other.home.front_default);
  }
  
  // 4. Dream World版本 - 梦幻风格
  if (sprites?.other?.dream_world?.front_default) {
    urls.push(sprites.other.dream_world.front_default);
  }
  
  // 5. GitHub官方仓库 - 稳定源
  urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`);
  
  // 6. Pokemon Database - 第三方高质量源
  urls.push(`https://img.pokemondb.net/artwork/large/${getPokemonNameById(id)}.jpg`);
  
  // 7. 基础sprite图片
  if (sprites?.front_default) {
    urls.push(sprites.front_default);
  }
  
  // 8. GitHub基础sprite
  urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`);
  
  // 9. Pokemon Database小图标
  urls.push(`https://img.pokemondb.net/sprites/go/normal/${getPokemonNameById(id)}.png`);
  
  return urls.filter(Boolean); // 移除空值
};

// 🎯 生成Pokemon动态图片的多个URL源
export const getPokemonAnimatedImageUrls = (id: number, sprites?: PokemonSprites): string[] => {
  const urls: string[] = [];

  // 1. 第五世代动画sprite - 黑白版
  if (sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default) {
    urls.push(sprites.versions['generation-v']['black-white'].animated.front_default);
  }
  
  // 2. GitHub动画sprite仓库
  urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`);
  
  // 3. 第五世代静态图片作为备选
  if (sprites?.versions?.['generation-v']?.['black-white']?.front_default) {
    urls.push(sprites.versions['generation-v']['black-white'].front_default);
  }
  
  // 4. 其他世代的静态图片
  if (sprites?.versions?.['generation-iv']?.['diamond-pearl']?.front_default) {
    urls.push(sprites.versions['generation-iv']['diamond-pearl'].front_default);
  }
  
  if (sprites?.versions?.['generation-iii']?.['ruby-sapphire']?.front_default) {
    urls.push(sprites.versions['generation-iii']['ruby-sapphire'].front_default);
  }
  
  // 5. 备选的GitHub静态sprite
  urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/${id}.png`);
  
  // 6. 基础sprite作为最后备选
  if (sprites?.front_default) {
    urls.push(sprites.front_default);
  }
  
  return urls.filter(Boolean);
};

// 🎯 根据ID获取Pokemon名称（用于第三方URL构建）
const getPokemonNameById = (id: number): string => {
  // 这里可以扩展为完整的Pokemon名称映射表
  // 目前使用简单的ID映射，后续可以从pokemonBaseData中获取
  const basicNames: Record<number, string> = {
    1: 'bulbasaur', 2: 'ivysaur', 3: 'venusaur',
    4: 'charmander', 5: 'charmeleon', 6: 'charizard',
    7: 'squirtle', 8: 'wartortle', 9: 'blastoise',
    25: 'pikachu', 26: 'raichu',
    // 可以继续扩展...
  };
  
  return basicNames[id] || `pokemon-${id}`;
};

// 🎯 生成占位符图片URL
export const getPokemonPlaceholderUrl = (id: number): string => {
  const paddedId = id.toString().padStart(3, '0');
  // 使用简单的占位符服务
  return `https://via.placeholder.com/200x200/f0f0f0/999999?text=${paddedId}`;
};

// 🎯 预加载关键图片
export const preloadPokemonImages = async (id: number, sprites?: PokemonSprites): Promise<void> => {
  const mainUrls = getPokemonMainImageUrls(id, sprites);
  const animatedUrls = getPokemonAnimatedImageUrls(id, sprites);
  
  // 只预加载前2个主要源，避免过度请求
  const urlsToPreload = [
    ...mainUrls.slice(0, 2),
    ...animatedUrls.slice(0, 1)
  ];
  
  // 并发预加载
  await Promise.allSettled(
    urlsToPreload.map(url => 
      new Promise<void>((resolve) => {
        // 检查环境选择合适的预加载方式
        if (typeof window !== 'undefined' && window.Image) {
          // H5环境
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        } else {
          // 小程序环境，使用之前的方法
          resolve();
        }
        
        // 超时保护
        setTimeout(() => resolve(), 3000);
      })
    )
  );
  
  console.log(`🖼️ 预加载Pokemon图片完成: ${urlsToPreload.length}张`);
}; 