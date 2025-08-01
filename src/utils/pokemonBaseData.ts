// 🎯 Pokemon基础数据映射 - 避免频繁API请求
// 包含前151个Pokemon的基础信息（第一世代）+ 一些热门Pokemon

export interface PokemonBaseInfo {
  id: number;
  name: string;
  types: string[];
  generation: number;
}

// 🎯 基础Pokemon数据映射表
export const POKEMON_BASE_DATA: Record<string, PokemonBaseInfo> = {
  // 第一世代 (1-151)
  'bulbasaur': { id: 1, name: 'bulbasaur', types: ['grass', 'poison'], generation: 1 },
  'ivysaur': { id: 2, name: 'ivysaur', types: ['grass', 'poison'], generation: 1 },
  'venusaur': { id: 3, name: 'venusaur', types: ['grass', 'poison'], generation: 1 },
  'charmander': { id: 4, name: 'charmander', types: ['fire'], generation: 1 },
  'charmeleon': { id: 5, name: 'charmeleon', types: ['fire'], generation: 1 },
  'charizard': { id: 6, name: 'charizard', types: ['fire', 'flying'], generation: 1 },
  'squirtle': { id: 7, name: 'squirtle', types: ['water'], generation: 1 },
  'wartortle': { id: 8, name: 'wartortle', types: ['water'], generation: 1 },
  'blastoise': { id: 9, name: 'blastoise', types: ['water'], generation: 1 },
  'caterpie': { id: 10, name: 'caterpie', types: ['bug'], generation: 1 },
  'metapod': { id: 11, name: 'metapod', types: ['bug'], generation: 1 },
  'butterfree': { id: 12, name: 'butterfree', types: ['bug', 'flying'], generation: 1 },
  'weedle': { id: 13, name: 'weedle', types: ['bug', 'poison'], generation: 1 },
  'kakuna': { id: 14, name: 'kakuna', types: ['bug', 'poison'], generation: 1 },
  'beedrill': { id: 15, name: 'beedrill', types: ['bug', 'poison'], generation: 1 },
  'pidgey': { id: 16, name: 'pidgey', types: ['normal', 'flying'], generation: 1 },
  'pidgeotto': { id: 17, name: 'pidgeotto', types: ['normal', 'flying'], generation: 1 },
  'pidgeot': { id: 18, name: 'pidgeot', types: ['normal', 'flying'], generation: 1 },
  'rattata': { id: 19, name: 'rattata', types: ['normal'], generation: 1 },
  'raticate': { id: 20, name: 'raticate', types: ['normal'], generation: 1 },
  'spearow': { id: 21, name: 'spearow', types: ['normal', 'flying'], generation: 1 },
  'fearow': { id: 22, name: 'fearow', types: ['normal', 'flying'], generation: 1 },
  'ekans': { id: 23, name: 'ekans', types: ['poison'], generation: 1 },
  'arbok': { id: 24, name: 'arbok', types: ['poison'], generation: 1 },
  'pikachu': { id: 25, name: 'pikachu', types: ['electric'], generation: 1 },
  'raichu': { id: 26, name: 'raichu', types: ['electric'], generation: 1 },
  'sandshrew': { id: 27, name: 'sandshrew', types: ['ground'], generation: 1 },
  'sandslash': { id: 28, name: 'sandslash', types: ['ground'], generation: 1 },
  'nidoran-f': { id: 29, name: 'nidoran-f', types: ['poison'], generation: 1 },
  'nidorina': { id: 30, name: 'nidorina', types: ['poison'], generation: 1 },
  'nidoqueen': { id: 31, name: 'nidoqueen', types: ['poison', 'ground'], generation: 1 },
  'nidoran-m': { id: 32, name: 'nidoran-m', types: ['poison'], generation: 1 },
  'nidorino': { id: 33, name: 'nidorino', types: ['poison'], generation: 1 },
  'nidoking': { id: 34, name: 'nidoking', types: ['poison', 'ground'], generation: 1 },
  'clefairy': { id: 35, name: 'clefairy', types: ['fairy'], generation: 1 },
  'clefable': { id: 36, name: 'clefable', types: ['fairy'], generation: 1 },
  'vulpix': { id: 37, name: 'vulpix', types: ['fire'], generation: 1 },
  'ninetales': { id: 38, name: 'ninetales', types: ['fire'], generation: 1 },
  'jigglypuff': { id: 39, name: 'jigglypuff', types: ['normal', 'fairy'], generation: 1 },
  'wigglytuff': { id: 40, name: 'wigglytuff', types: ['normal', 'fairy'], generation: 1 },
  'zubat': { id: 41, name: 'zubat', types: ['poison', 'flying'], generation: 1 },
  'golbat': { id: 42, name: 'golbat', types: ['poison', 'flying'], generation: 1 },
  'oddish': { id: 43, name: 'oddish', types: ['grass', 'poison'], generation: 1 },
  'gloom': { id: 44, name: 'gloom', types: ['grass', 'poison'], generation: 1 },
  'vileplume': { id: 45, name: 'vileplume', types: ['grass', 'poison'], generation: 1 },
  'paras': { id: 46, name: 'paras', types: ['bug', 'grass'], generation: 1 },
  'parasect': { id: 47, name: 'parasect', types: ['bug', 'grass'], generation: 1 },
  'venonat': { id: 48, name: 'venonat', types: ['bug', 'poison'], generation: 1 },
  'venomoth': { id: 49, name: 'venomoth', types: ['bug', 'poison'], generation: 1 },
  'diglett': { id: 50, name: 'diglett', types: ['ground'], generation: 1 },
  'dugtrio': { id: 51, name: 'dugtrio', types: ['ground'], generation: 1 },
  'meowth': { id: 52, name: 'meowth', types: ['normal'], generation: 1 },
  'persian': { id: 53, name: 'persian', types: ['normal'], generation: 1 },
  'psyduck': { id: 54, name: 'psyduck', types: ['water'], generation: 1 },
  'golduck': { id: 55, name: 'golduck', types: ['water'], generation: 1 },
  'mankey': { id: 56, name: 'mankey', types: ['fighting'], generation: 1 },
  'primeape': { id: 57, name: 'primeape', types: ['fighting'], generation: 1 },
  'growlithe': { id: 58, name: 'growlithe', types: ['fire'], generation: 1 },
  'arcanine': { id: 59, name: 'arcanine', types: ['fire'], generation: 1 },
  'poliwag': { id: 60, name: 'poliwag', types: ['water'], generation: 1 },
  'poliwhirl': { id: 61, name: 'poliwhirl', types: ['water'], generation: 1 },
  'poliwrath': { id: 62, name: 'poliwrath', types: ['water', 'fighting'], generation: 1 },
  'abra': { id: 63, name: 'abra', types: ['psychic'], generation: 1 },
  'kadabra': { id: 64, name: 'kadabra', types: ['psychic'], generation: 1 },
  'alakazam': { id: 65, name: 'alakazam', types: ['psychic'], generation: 1 },
  'machop': { id: 66, name: 'machop', types: ['fighting'], generation: 1 },
  'machoke': { id: 67, name: 'machoke', types: ['fighting'], generation: 1 },
  'machamp': { id: 68, name: 'machamp', types: ['fighting'], generation: 1 },
  'bellsprout': { id: 69, name: 'bellsprout', types: ['grass', 'poison'], generation: 1 },
  'weepinbell': { id: 70, name: 'weepinbell', types: ['grass', 'poison'], generation: 1 },
  'victreebel': { id: 71, name: 'victreebel', types: ['grass', 'poison'], generation: 1 },
  'tentacool': { id: 72, name: 'tentacool', types: ['water', 'poison'], generation: 1 },
  'tentacruel': { id: 73, name: 'tentacruel', types: ['water', 'poison'], generation: 1 },
  'geodude': { id: 74, name: 'geodude', types: ['rock', 'ground'], generation: 1 },
  'graveler': { id: 75, name: 'graveler', types: ['rock', 'ground'], generation: 1 },
  'golem': { id: 76, name: 'golem', types: ['rock', 'ground'], generation: 1 },
  'ponyta': { id: 77, name: 'ponyta', types: ['fire'], generation: 1 },
  'rapidash': { id: 78, name: 'rapidash', types: ['fire'], generation: 1 },
  'slowpoke': { id: 79, name: 'slowpoke', types: ['water', 'psychic'], generation: 1 },
  'slowbro': { id: 80, name: 'slowbro', types: ['water', 'psychic'], generation: 1 },
  'magnemite': { id: 81, name: 'magnemite', types: ['electric', 'steel'], generation: 1 },
  'magneton': { id: 82, name: 'magneton', types: ['electric', 'steel'], generation: 1 },
  'farfetchd': { id: 83, name: 'farfetchd', types: ['normal', 'flying'], generation: 1 },
  'doduo': { id: 84, name: 'doduo', types: ['normal', 'flying'], generation: 1 },
  'dodrio': { id: 85, name: 'dodrio', types: ['normal', 'flying'], generation: 1 },
  'seel': { id: 86, name: 'seel', types: ['water'], generation: 1 },
  'dewgong': { id: 87, name: 'dewgong', types: ['water', 'ice'], generation: 1 },
  'grimer': { id: 88, name: 'grimer', types: ['poison'], generation: 1 },
  'muk': { id: 89, name: 'muk', types: ['poison'], generation: 1 },
  'shellder': { id: 90, name: 'shellder', types: ['water'], generation: 1 },
  'cloyster': { id: 91, name: 'cloyster', types: ['water', 'ice'], generation: 1 },
  'gastly': { id: 92, name: 'gastly', types: ['ghost', 'poison'], generation: 1 },
  'haunter': { id: 93, name: 'haunter', types: ['ghost', 'poison'], generation: 1 },
  'gengar': { id: 94, name: 'gengar', types: ['ghost', 'poison'], generation: 1 },
  'onix': { id: 95, name: 'onix', types: ['rock', 'ground'], generation: 1 },
  'drowzee': { id: 96, name: 'drowzee', types: ['psychic'], generation: 1 },
  'hypno': { id: 97, name: 'hypno', types: ['psychic'], generation: 1 },
  'krabby': { id: 98, name: 'krabby', types: ['water'], generation: 1 },
  'kingler': { id: 99, name: 'kingler', types: ['water'], generation: 1 },
  'voltorb': { id: 100, name: 'voltorb', types: ['electric'], generation: 1 },
  'electrode': { id: 101, name: 'electrode', types: ['electric'], generation: 1 },
  'exeggcute': { id: 102, name: 'exeggcute', types: ['grass', 'psychic'], generation: 1 },
  'exeggutor': { id: 103, name: 'exeggutor', types: ['grass', 'psychic'], generation: 1 },
  'cubone': { id: 104, name: 'cubone', types: ['ground'], generation: 1 },
  'marowak': { id: 105, name: 'marowak', types: ['ground'], generation: 1 },
  'hitmonlee': { id: 106, name: 'hitmonlee', types: ['fighting'], generation: 1 },
  'hitmonchan': { id: 107, name: 'hitmonchan', types: ['fighting'], generation: 1 },
  'lickitung': { id: 108, name: 'lickitung', types: ['normal'], generation: 1 },
  'koffing': { id: 109, name: 'koffing', types: ['poison'], generation: 1 },
  'weezing': { id: 110, name: 'weezing', types: ['poison'], generation: 1 },
  'rhyhorn': { id: 111, name: 'rhyhorn', types: ['ground', 'rock'], generation: 1 },
  'rhydon': { id: 112, name: 'rhydon', types: ['ground', 'rock'], generation: 1 },
  'chansey': { id: 113, name: 'chansey', types: ['normal'], generation: 1 },
  'tangela': { id: 114, name: 'tangela', types: ['grass'], generation: 1 },
  'kangaskhan': { id: 115, name: 'kangaskhan', types: ['normal'], generation: 1 },
  'horsea': { id: 116, name: 'horsea', types: ['water'], generation: 1 },
  'seadra': { id: 117, name: 'seadra', types: ['water'], generation: 1 },
  'goldeen': { id: 118, name: 'goldeen', types: ['water'], generation: 1 },
  'seaking': { id: 119, name: 'seaking', types: ['water'], generation: 1 },
  'staryu': { id: 120, name: 'staryu', types: ['water'], generation: 1 },
  'starmie': { id: 121, name: 'starmie', types: ['water', 'psychic'], generation: 1 },
  'mr-mime': { id: 122, name: 'mr-mime', types: ['psychic', 'fairy'], generation: 1 },
  'scyther': { id: 123, name: 'scyther', types: ['bug', 'flying'], generation: 1 },
  'jynx': { id: 124, name: 'jynx', types: ['ice', 'psychic'], generation: 1 },
  'electabuzz': { id: 125, name: 'electabuzz', types: ['electric'], generation: 1 },
  'magmar': { id: 126, name: 'magmar', types: ['fire'], generation: 1 },
  'pinsir': { id: 127, name: 'pinsir', types: ['bug'], generation: 1 },
  'tauros': { id: 128, name: 'tauros', types: ['normal'], generation: 1 },
  'magikarp': { id: 129, name: 'magikarp', types: ['water'], generation: 1 },
  'gyarados': { id: 130, name: 'gyarados', types: ['water', 'flying'], generation: 1 },
  'lapras': { id: 131, name: 'lapras', types: ['water', 'ice'], generation: 1 },
  'ditto': { id: 132, name: 'ditto', types: ['normal'], generation: 1 },
  'eevee': { id: 133, name: 'eevee', types: ['normal'], generation: 1 },
  'vaporeon': { id: 134, name: 'vaporeon', types: ['water'], generation: 1 },
  'jolteon': { id: 135, name: 'jolteon', types: ['electric'], generation: 1 },
  'flareon': { id: 136, name: 'flareon', types: ['fire'], generation: 1 },
  'porygon': { id: 137, name: 'porygon', types: ['normal'], generation: 1 },
  'omanyte': { id: 138, name: 'omanyte', types: ['rock', 'water'], generation: 1 },
  'omastar': { id: 139, name: 'omastar', types: ['rock', 'water'], generation: 1 },
  'kabuto': { id: 140, name: 'kabuto', types: ['rock', 'water'], generation: 1 },
  'kabutops': { id: 141, name: 'kabutops', types: ['rock', 'water'], generation: 1 },
  'aerodactyl': { id: 142, name: 'aerodactyl', types: ['rock', 'flying'], generation: 1 },
  'snorlax': { id: 143, name: 'snorlax', types: ['normal'], generation: 1 },
  'articuno': { id: 144, name: 'articuno', types: ['ice', 'flying'], generation: 1 },
  'zapdos': { id: 145, name: 'zapdos', types: ['electric', 'flying'], generation: 1 },
  'moltres': { id: 146, name: 'moltres', types: ['fire', 'flying'], generation: 1 },
  'dratini': { id: 147, name: 'dratini', types: ['dragon'], generation: 1 },
  'dragonair': { id: 148, name: 'dragonair', types: ['dragon'], generation: 1 },
  'dragonite': { id: 149, name: 'dragonite', types: ['dragon', 'flying'], generation: 1 },
  'mewtwo': { id: 150, name: 'mewtwo', types: ['psychic'], generation: 1 },
  'mew': { id: 151, name: 'mew', types: ['psychic'], generation: 1 },
  
  // 🎯 第二世代热门Pokemon (152-251)
  'chikorita': { id: 152, name: 'chikorita', types: ['grass'], generation: 2 },
  'cyndaquil': { id: 155, name: 'cyndaquil', types: ['fire'], generation: 2 },
  'totodile': { id: 158, name: 'totodile', types: ['water'], generation: 2 },
  'pichu': { id: 172, name: 'pichu', types: ['electric'], generation: 2 },
  'togepi': { id: 175, name: 'togepi', types: ['fairy'], generation: 2 },
  'ampharos': { id: 181, name: 'ampharos', types: ['electric'], generation: 2 },
  'espeon': { id: 196, name: 'espeon', types: ['psychic'], generation: 2 },
  'umbreon': { id: 197, name: 'umbreon', types: ['dark'], generation: 2 },
  'lugia': { id: 249, name: 'lugia', types: ['psychic', 'flying'], generation: 2 },
  'ho-oh': { id: 250, name: 'ho-oh', types: ['fire', 'flying'], generation: 2 },
  'celebi': { id: 251, name: 'celebi', types: ['psychic', 'grass'], generation: 2 },
  
  // 🎯 第三世代热门Pokemon (252-386)
  'treecko': { id: 252, name: 'treecko', types: ['grass'], generation: 3 },
  'torchic': { id: 255, name: 'torchic', types: ['fire'], generation: 3 },
  'mudkip': { id: 258, name: 'mudkip', types: ['water'], generation: 3 },
  'gardevoir': { id: 282, name: 'gardevoir', types: ['psychic', 'fairy'], generation: 3 },
  'blaziken': { id: 257, name: 'blaziken', types: ['fire', 'fighting'], generation: 3 },
  'rayquaza': { id: 384, name: 'rayquaza', types: ['dragon', 'flying'], generation: 3 },
  'kyogre': { id: 382, name: 'kyogre', types: ['water'], generation: 3 },
  'groudon': { id: 383, name: 'groudon', types: ['ground'], generation: 3 },
  
  // 🎯 第四世代热门Pokemon (387-493)
  'lucario': { id: 448, name: 'lucario', types: ['fighting', 'steel'], generation: 4 },
  'garchomp': { id: 445, name: 'garchomp', types: ['dragon', 'ground'], generation: 4 },
  'dialga': { id: 483, name: 'dialga', types: ['steel', 'dragon'], generation: 4 },
  'palkia': { id: 484, name: 'palkia', types: ['water', 'dragon'], generation: 4 },
  'giratina': { id: 487, name: 'giratina', types: ['ghost', 'dragon'], generation: 4 },
  'arceus': { id: 493, name: 'arceus', types: ['normal'], generation: 4 },
  
  // 🎯 第五世代热门Pokemon (494-649)
  'reshiram': { id: 643, name: 'reshiram', types: ['dragon', 'fire'], generation: 5 },
  'zekrom': { id: 644, name: 'zekrom', types: ['dragon', 'electric'], generation: 5 },
  'kyurem': { id: 646, name: 'kyurem', types: ['dragon', 'ice'], generation: 5 },
  
  // 🎯 第六世代热门Pokemon (650-721)
  'greninja': { id: 658, name: 'greninja', types: ['water', 'dark'], generation: 6 },
  'xerneas': { id: 716, name: 'xerneas', types: ['fairy'], generation: 6 },
  'yveltal': { id: 717, name: 'yveltal', types: ['dark', 'flying'], generation: 6 },
  
  // 🎯 第七世代热门Pokemon (722-809)
  'decidueye': { id: 724, name: 'decidueye', types: ['grass', 'ghost'], generation: 7 },
  'incineroar': { id: 727, name: 'incineroar', types: ['fire', 'dark'], generation: 7 },
  'primarina': { id: 730, name: 'primarina', types: ['water', 'fairy'], generation: 7 },
  'solgaleo': { id: 791, name: 'solgaleo', types: ['psychic', 'steel'], generation: 7 },
  'lunala': { id: 792, name: 'lunala', types: ['psychic', 'ghost'], generation: 7 },
  
  // 🎯 第八世代热门Pokemon (810-905)
  'corviknight': { id: 823, name: 'corviknight', types: ['flying', 'steel'], generation: 8 },
  'dragapult': { id: 887, name: 'dragapult', types: ['dragon', 'ghost'], generation: 8 },
  'zacian': { id: 888, name: 'zacian', types: ['fairy'], generation: 8 },
  'zamazenta': { id: 889, name: 'zamazenta', types: ['fighting'], generation: 8 },
};

// 🎯 根据Pokemon名称获取基础信息
export const getPokemonBaseInfo = (name: string): PokemonBaseInfo | null => {
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return POKEMON_BASE_DATA[normalizedName] || null;
};

// 🎯 根据ID范围推测类型（改进版本，覆盖更多世代）
export const getTypesByIdRange = (id: number): string[] => {
  // 第一世代 (1-151)
  if (id >= 1 && id <= 3) return ['grass', 'poison'];
  if (id >= 4 && id <= 6) return ['fire'];
  if (id >= 7 && id <= 9) return ['water'];
  if (id >= 10 && id <= 15) return ['bug'];
  if (id >= 16 && id <= 18) return ['normal', 'flying'];
  if (id === 25 || id === 26) return ['electric'];
  if (id >= 27 && id <= 28) return ['ground'];
  if (id >= 63 && id <= 65) return ['psychic'];
  if (id >= 66 && id <= 68) return ['fighting'];
  if (id >= 92 && id <= 94) return ['ghost', 'poison'];
  if (id >= 144 && id <= 146) return ['ice', 'flying'];
  if (id === 150) return ['psychic']; // 超梦
  if (id === 151) return ['psychic']; // 梦幻
  
  // 第二世代 (152-251) - 更智能的推测
  if (id >= 152 && id <= 154) return ['grass']; // 菊草叶系列
  if (id >= 155 && id <= 157) return ['fire']; // 火球鼠系列
  if (id >= 158 && id <= 160) return ['water']; // 小锯鳄系列
  if (id >= 179 && id <= 181) return ['electric']; // 咩利羊系列
  if (id >= 196 && id <= 197) return ['psychic']; // 太阳伊布/月亮伊布
  if (id >= 243 && id <= 245) return ['electric']; // 雷公/炎帝/水君
  if (id >= 249 && id <= 251) return ['psychic']; // 洛奇亚/凤王/时拉比
  
  // 第三世代 (252-386)
  if (id >= 252 && id <= 254) return ['grass']; // 木守宫系列
  if (id >= 255 && id <= 257) return ['fire']; // 火稚鸡系列
  if (id >= 258 && id <= 260) return ['water']; // 水跃鱼系列
  if (id >= 377 && id <= 386) return ['psychic']; // 传说Pokemon区域
  
  // 第四世代 (387-493)
  if (id >= 387 && id <= 389) return ['grass']; // 草苗龟系列
  if (id >= 390 && id <= 392) return ['fire']; // 小火焰猴系列
  if (id >= 393 && id <= 395) return ['water']; // 波加曼系列
  if (id >= 483 && id <= 493) return ['dragon']; // 传说Pokemon区域
  
  // 第五世代 (494-649)
  if (id >= 495 && id <= 497) return ['grass']; // 藤藤蛇系列
  if (id >= 498 && id <= 500) return ['fire']; // 暖暖猪系列
  if (id >= 501 && id <= 503) return ['water']; // 水水獭系列
  if (id >= 638 && id <= 649) return ['steel']; // 传说Pokemon区域
  
  // 第六世代 (650-721)
  if (id >= 650 && id <= 652) return ['grass']; // 哈力栗系列
  if (id >= 653 && id <= 655) return ['fire']; // 火狐狸系列
  if (id >= 656 && id <= 658) return ['water']; // 呱呱泡蛙系列
  if (id >= 716 && id <= 721) return ['fairy']; // 传说Pokemon区域
  
  // 第七世代 (722-809)
  if (id >= 722 && id <= 724) return ['grass']; // 木木枭系列
  if (id >= 725 && id <= 727) return ['fire']; // 火斑喵系列
  if (id >= 728 && id <= 730) return ['water']; // 球球海狮系列
  if (id >= 785 && id <= 809) return ['psychic']; // 传说Pokemon区域
  
  // 第八世代 (810-905)
  if (id >= 810 && id <= 812) return ['grass']; // 敲音猴系列
  if (id >= 813 && id <= 815) return ['fire']; // 炎兔儿系列
  if (id >= 816 && id <= 818) return ['water']; // 泪眼蜥系列
  if (id >= 880 && id <= 905) return ['dragon']; // 传说Pokemon区域
  
  // 默认类型 - 比之前更智能的分配
  if (id <= 151) return ['normal'];
  if (id <= 251) return ['normal']; // 第二世代普通Pokemon
  if (id <= 386) return ['normal']; // 第三世代普通Pokemon
  if (id <= 493) return ['normal']; // 第四世代普通Pokemon
  if (id <= 649) return ['normal']; // 第五世代普通Pokemon
  if (id <= 721) return ['normal']; // 第六世代普通Pokemon
  if (id <= 809) return ['normal']; // 第七世代普通Pokemon
  return ['normal']; // 第八世代及以后
};



// 🎯 获取更稳定的图片URL列表
export const getOptimizedImageUrls = (id: number, name: string): string[] => {
  const paddedId = id.toString().padStart(3, '0');
  
  return [
    // 1. 官方Pokemon网站 - 最高质量
    `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${paddedId}.png`,
    
    // 2. Pokemon Database - 备选高质量源
    `https://img.pokemondb.net/artwork/large/${name}.jpg`,
    
    // 3. GitHub官方仓库 - 稳定性较好
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    
    // 4. GitHub普通sprite
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    
    // 5. PokemonDB的小图标
    `https://img.pokemondb.net/sprites/go/normal/${name}.png`,
    
    // 6. 兜底占位符
    `https://via.placeholder.com/96x96/f0f0f0/999999?text=${name.charAt(0).toUpperCase()}`
  ];
}; 