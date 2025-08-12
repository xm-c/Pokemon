// API基础URL
export const API_BASE_URL = 'https://pokeapi.co/api/v2';

// 每页加载的宝可梦数量
export const POKEMONS_PER_PAGE = 20;

// 宝可梦类型及对应的颜色
// 宝可梦类型颜色映射
export const POKEMON_TYPE_COLORS = {
  normal: {
    light: '#f7f7f7',
    dark: '#e5e5e5'
  },
  fire: {
    light: '#f8d3ab',
    dark: '#f4a582'
  },
  water: {
    light: '#abd9e9',
    dark: '#74add1'
  },
  electric: {
    light: '#ffffcc',
    dark: '#ffeda0'
  },
  grass: {
    light: '#c1e1c5',
    dark: '#a8ddb5'
  },
  ice: {
    light: '#e0f3f8',
    dark: '#b5d4e9'
  },
  fighting: {
    light: '#f9cdad',
    dark: '#f4a582'
  },
  poison: {
    light: '#dadaeb',
    dark: '#bcbddc'
  },
  ground: {
    light: '#f6e8c3',
    dark: '#dfc27d'
  },
  flying: {
    light: '#d1e5f0',
    dark: '#b0d2e8'
  },
  psychic: {
    light: '#fde0dd',
    dark: '#fa9fb5'
  },
  bug: {
    light: '#d9f0a3',
    dark: '#addd8e'
  },
  rock: {
    light: '#e5d8bd',
    dark: '#d8b365'
  },
  ghost: {
    light: '#e7e1ef',
    dark: '#c994c7'
  },
  dragon: {
    light: '#c6dbef',
    dark: '#6baed6'
  },
  dark: {
    light: '#d9d9d9',
    dark: '#969696'
  },
  steel: {
    light: '#f2f2f2',
    dark: '#d9d9d9'
  },
  fairy: {
    light: '#fce4ec',
    dark: '#f8bbd0'
  }
};

export const POKEMON_TYPES = {
  normal: { name: '一般', color: '#A8A878' },
  fighting: { name: '格斗', color: '#C03028' },
  flying: { name: '飞行', color: '#A890F0' },
  poison: { name: '毒', color: '#A040A0' },
  ground: { name: '地面', color: '#E0C068' },
  rock: { name: '岩石', color: '#B8A038' },
  bug: { name: '虫', color: '#A8B820' },
  ghost: { name: '幽灵', color: '#705898' },
  steel: { name: '钢', color: '#B8B8D0' },
  fire: { name: '火', color: '#F08030' },
  water: { name: '水', color: '#6890F0' },
  grass: { name: '草', color: '#78C850' },
  electric: { name: '电', color: '#F8D030' },
  psychic: { name: '超能力', color: '#F85888' },
  ice: { name: '冰', color: '#98D8D8' },
  dragon: { name: '龙', color: '#7038F8' },
  dark: { name: '恶', color: '#705848' },
  fairy: { name: '妖精', color: '#EE99AC' },
  unknown: { name: '未知', color: '#68A090' },
  shadow: { name: '暗影', color: '#604E82' },
};

// 地区列表 - ID直接使用PokeAPI的图鉴名称，无需额外映射
export const REGIONS = [
  { id: 'kanto', name: '关都' },
  { id: 'updated-johto', name: '城都' },
  { id: 'hoenn', name: '丰缘' },
  { id: 'extended-sinnoh', name: '神奥' },
  { id: 'updated-unova', name: '合众' },
  { id: 'kalos-central', name: '卡洛斯' },
  { id: 'updated-alola', name: '阿罗拉' },
  { id: 'galar', name: '伽勒尔' },
  { id: 'hisui', name: '洗翠' },
  { id: 'paldea', name: '帕底亚' },
];
