/**
 * Pokemon图片URL管理工具
 * 优化版本 - 添加更快的CDN源和备选地址
 */

/**
 * 获取Pokemon主图片的多个备选URL（按速度优先级排序）
 */
export const getPokemonMainImageUrls = (id: number, sprites?: any): string[] => {
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
  urls.push(`https://img.pokemondb.net/artwork/large/${getPokemonNameById(id)}.jpg`);
  
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
export const getPokemonAnimatedImageUrls = (id: number, sprites?: any): string[] => {
  const urls: string[] = [];
  const paddedId = id.toString().padStart(3, '0');
  
  // 🚀 第1优先级：GitHub官方动图源（最稳定）
  urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/front_default/${id}.gif`);
  
  // 🚀 第2优先级：Showdown动图（速度快）
  urls.push(`https://play.pokemonshowdown.com/sprites/ani/${getPokemonNameById(id).toLowerCase()}.gif`);
  
  // 第3优先级：原始sprites中的动图
  if (sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default) {
    urls.push(sprites.versions['generation-v']['black-white'].animated.front_default);
  }
  
  // 🚀 第4优先级：Pokemon数据库动图
  urls.push(`https://img.pokemondb.net/sprites/black-white/anim/normal/${getPokemonNameById(id)}.gif`);
  
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
  urls.push(`https://projectpokemon.org/images/normal-sprite/${getPokemonNameById(id).toLowerCase()}.gif`);
  
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
 */
const getPokemonNameById = (id: number): string => {
  // 这里是一个简化的映射，实际项目中可以扩展
  const pokemonNames: Record<number, string> = {
    1: 'bulbasaur', 2: 'ivysaur', 3: 'venusaur', 4: 'charmander', 5: 'charmeleon',
    6: 'charizard', 7: 'squirtle', 8: 'wartortle', 9: 'blastoise', 10: 'caterpie',
    11: 'metapod', 12: 'butterfree', 13: 'weedle', 14: 'kakuna', 15: 'beedrill',
    16: 'pidgey', 17: 'pidgeotto', 18: 'pidgeot', 19: 'rattata', 20: 'raticate',
    25: 'pikachu', 26: 'raichu', 39: 'jigglypuff', 52: 'meowth', 54: 'psyduck',
    58: 'growlithe', 59: 'arcanine', 104: 'cubone', 105: 'marowak', 129: 'magikarp',
    130: 'gyarados', 131: 'lapras', 132: 'ditto', 133: 'eevee', 134: 'vaporeon',
    135: 'jolteon', 136: 'flareon', 144: 'articuno', 145: 'zapdos', 146: 'moltres',
    147: 'dratini', 148: 'dragonair', 149: 'dragonite', 150: 'mewtwo', 151: 'mew'
  };
  
  // 如果有已知的名称映射，使用它；否则使用通用格式
  return pokemonNames[id] || `pokemon-${id}`;
}; 