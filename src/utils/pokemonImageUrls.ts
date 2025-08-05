/**
 * Pokemon图片URL管理工具
 * 优化版本 - 添加更快的CDN源和备选地址
 */

import { POKEMON_BASE_DATA } from './pokemonBaseData';

// 🎯 创建ID到Pokemon名称的快速查找映射表
const ID_TO_NAME_MAP: Record<number, string> = {};

// 初始化ID映射表
Object.entries(POKEMON_BASE_DATA).forEach(([, data]) => {
  ID_TO_NAME_MAP[data.id] = data.name;
});

/**
 * 获取Pokemon主图片的多个备选URL（按速度优先级排序）
 */
export const getPokemonMainImageUrls = (id: number, sprites?: any, pokemonName?: string): string[] => {
  const urls: string[] = [];
  const paddedId = id.toString().padStart(3, '0');
  
  // 🚀 第1优先级：使用最快的CDN源
  // Pokemon Home 官方图片 (通常最快最稳定)
  urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/front_default/${id}.png`);
  
  // 🚀 第2优先级：GitHub CDN官方艺术图
  urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`);
  
  // 🚀 第3优先级：Serebii数据库 (速度较快)
  urls.push(`https://www.serebii.net/pokemon/art/${paddedId}.png`);
  
  // 🚀 第4优先级：Pokemon数据库高质量图片
  const nameForUrl = pokemonName || getPokemonNameById(id);
  urls.push(`https://img.pokemondb.net/artwork/large/${nameForUrl}.jpg`);
  
  // 第5优先级：原始sprites中的官方艺术图
  if (sprites?.other?.['official-artwork']?.front_default) {
    urls.push(sprites.other['official-artwork'].front_default);
  }
  
  // 第6优先级：Dream World图片
  if (sprites?.other?.dream_world?.front_default) {
    urls.push(sprites.other.dream_world.front_default);
  }
  
  // 🚀 第7优先级：Bulbapedia镜像源
  urls.push(`https://archives.bulbagarden.net/media/upload/thumb/0/0d/${paddedId}.png/250px-${paddedId}.png`);
  
  // 第8优先级：PokeAPI直接链接
  urls.push(`https://pokeapi.co/media/sprites/pokemon/other/official-artwork/${id}.png`);
  
  // 第9优先级：备用GitHub源
  urls.push(`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`);
  
  // 第10优先级：普通sprite作为最后备选
  if (sprites?.front_default) {
    urls.push(sprites.front_default);
  }
  
  return urls.filter(url => url && url.length > 0);
};

/**
 * 获取Pokemon动图的多个备选URL（按速度优先级排序）
 */
export const getPokemonAnimatedImageUrls = (id: number, sprites?: any, pokemonName?: string): string[] => {
  const urls: string[] = [];
  const paddedId = id.toString().padStart(3, '0');
  
  // 🚀 第1优先级：GitHub官方动图源（最稳定）
  urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/front_default/${id}.gif`);
  
  // 🚀 第2优先级：Showdown动图（速度快）
  const nameForUrl = pokemonName || getPokemonNameById(id);
  urls.push(`https://play.pokemonshowdown.com/sprites/ani/${nameForUrl.toLowerCase()}.gif`);
  
  // 第3优先级：原始sprites中的动图
  if (sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default) {
    urls.push(sprites.versions['generation-v']['black-white'].animated.front_default);
  }
  
  // 🚀 第4优先级：Pokemon数据库动图
  urls.push(`https://img.pokemondb.net/sprites/black-white/anim/normal/${nameForUrl}.gif`);
  
  // 第5优先级：其他世代的动图
  if (sprites?.versions?.['generation-vii']?.['ultra-sun-ultra-moon']?.front_default) {
    urls.push(sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_default);
  }
  
  // 🚀 第6优先级：Serebii动图
  urls.push(`https://www.serebii.net/pokemon/gif/${paddedId}.gif`);
  
  // 第7优先级：Heart Gold/Soul Silver动图
  if (sprites?.versions?.['generation-iv']?.['heartgold-soulsilver']?.front_default) {
    urls.push(sprites.versions['generation-iv']['heartgold-soulsilver'].front_default);
  }
  
  // 第8优先级：Crystal版本动图
  if (sprites?.versions?.['generation-ii']?.crystal?.front_default) {
    urls.push(sprites.versions['generation-ii'].crystal.front_default);
  }
  
  // 🚀 第9优先级：备用动图CDN
  urls.push(`https://projectpokemon.org/images/normal-sprite/${nameForUrl.toLowerCase()}.gif`);
  
  // 第10优先级：如果没有动图，使用静态图片作为备选
  urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`);
  
  return urls.filter(url => url && url.length > 0);
};

/**
 * 获取Pokemon占位符图片URL
 */
export const getPokemonPlaceholderUrl = (id: number): string => {
  // 使用最简单快速的占位符
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

/**
 * 根据ID获取Pokemon名称（用于构建某些URL）
 * 利用完整的Pokemon基础数据，覆盖所有世代
 */
const getPokemonNameById = (id: number): string => {
  // 🎯 优先使用完整的Pokemon基础数据映射表
  if (ID_TO_NAME_MAP[id]) {
    return ID_TO_NAME_MAP[id];
  }
  
  // 🎯 对于未在基础数据中的Pokemon，提供智能备选策略
  // 基于ID范围的常见Pokemon名称模式推测
  const fallbackNames: Record<number, string> = {
    // 第二世代剩余的热门Pokemon
    153: 'bayleef', 154: 'meganium', 156: 'quilava', 157: 'typhlosion',
    159: 'croconaw', 160: 'feraligatr', 
    
    // 第三世代剩余的热门Pokemon  
    253: 'grovyle', 254: 'sceptile', 256: 'combusken', 
    259: 'marshtomp', 260: 'swampert',
    
    // 第四世代剩余的热门Pokemon
    387: 'turtwig', 388: 'grotle', 389: 'torterra',
    390: 'chimchar', 391: 'monferno', 392: 'infernape',
    393: 'piplup', 394: 'prinplup', 395: 'empoleon',
    
    // 第五世代剩余的热门Pokemon
    495: 'snivy', 496: 'servine', 497: 'serperior',
    498: 'tepig', 499: 'pignite', 500: 'emboar',
    501: 'oshawott', 502: 'dewott', 503: 'samurott',
    
    // 第六世代热门Pokemon
    650: 'chespin', 653: 'fennekin', 656: 'froakie',
    658: 'greninja', 
    
    // 第七世代热门Pokemon
    722: 'rowlet', 725: 'litten', 728: 'popplio',
    
    // 第八世代热门Pokemon
    810: 'grookey', 813: 'scorbunny', 816: 'sobble'
  };
  
  if (fallbackNames[id]) {
    return fallbackNames[id];
  }
  
  // 🎯 最终备选：使用通用格式，但添加一些智能规律
  // 根据ID范围判断可能的世代和常见命名模式
  if (id <= 151) {
    return `gen1-pokemon-${id}`;
  } else if (id <= 251) {
    return `gen2-pokemon-${id}`;
  } else if (id <= 386) {
    return `gen3-pokemon-${id}`;
  } else if (id <= 493) {
    return `gen4-pokemon-${id}`;
  } else if (id <= 649) {
    return `gen5-pokemon-${id}`;
  } else if (id <= 721) {
    return `gen6-pokemon-${id}`;
  } else if (id <= 809) {
    return `gen7-pokemon-${id}`;
  } else {
    return `gen8-pokemon-${id}`;
  }
}; 