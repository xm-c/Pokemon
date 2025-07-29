// 宝可梦基础信息类型
export interface PokemonBasic {
  id: number;
  name: string;
  url: string;
}

// 宝可梦列表响应类型
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBasic[];
}

// 宝可梦类型信息
export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

// 宝可梦能力信息
export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

// 宝可梦状态信息
export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

// 宝可梦详细信息类型
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }[];
  }[];
  sprites: {
    front_default: string;
    front_shiny: string;
    back_default: string;
    back_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      home: {
        front_default: string;
      };
      'dream_world': {
        front_default: string;
      };
    };
    versions: {
      'generation-v': {
        'black-white': {
          animated: {
            front_default: string;
            back_default: string;
          }
        }
      }
    }
  };
  species: {
    name: string;
    url: string;
  };
}

// 宝可梦种族信息类型
export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  color: {
    name: string;
    url: string;
  };
  evolution_chain: {
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    }
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    }
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
      url: string;
    }
  }[];
}

// 宝可梦进化链接点信息
export interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolution_details: {
    min_level: number;
    min_happiness: number;
    min_beauty: number;
    min_affection: number;
    trigger: {
      name: string;
      url: string;
    };
    item: {
      name: string;
      url: string;
    } | null;
  }[];
  evolves_to: EvolutionChainLink[];
}

// 宝可梦进化链信息
export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}

// 搜索参数类型
export interface SearchParams {
  name?: string;
  type?: string;
  region?: string;
  limit?: number;
  offset?: number;
}

// 过滤参数类型
export interface FilterOptions {
  types: { id: string; name: string }[];
  regions: { id: string; name: string }[];
}

// 技能详细信息类型
export interface MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  pp: number;
  power: number | null;
  priority: number;
  damage_class: {
    name: string;
    url: string;
  };
  type: {
    name: string;
    url: string;
  };
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  meta?: {
    ailment: {
      name: string;
      url: string;
    };
    category: {
      name: string;
      url: string;
    };
    min_hits?: number;
    max_hits?: number;
    min_turns?: number;
    max_turns?: number;
    drain?: number;
    healing?: number;
    crit_rate?: number;
    ailment_chance?: number;
    flinch_chance?: number;
    stat_chance?: number;
  };
}

// 特性详细信息类型
export interface AbilityDetail {
  id: number;
  name: string;
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    }
  }[];
  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    }
  }[];
}
