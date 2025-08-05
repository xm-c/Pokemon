/**
 * 宝可梦中文名称映射
 * 按照全国图鉴编号顺序排列常见宝可梦
 */
export const POKEMON_CHINESE_NAMES: Record<string, string> = {
  // 第一世代 (关都地区)
  'bulbasaur': '妙蛙种子',
  'ivysaur': '妙蛙草',
  'venusaur': '妙蛙花',
  'charmander': '小火龙',
  'charmeleon': '火恐龙',
  'charizard': '喷火龙',
  'squirtle': '杰尼龟',
  'wartortle': '卡咪龟',
  'blastoise': '水箭龟',
  'caterpie': '绿毛虫',
  'metapod': '铁甲蛹',
  'butterfree': '巴大蝶',
  'weedle': '独角虫',
  'kakuna': '铁壳蛹',
  'beedrill': '大针蜂',
  'pidgey': '波波',
  'pidgeotto': '比比鸟',
  'pidgeot': '大比鸟',
  'rattata': '小拉达',
  'raticate': '拉达',
  'spearow': '烈雀',
  'fearow': '大嘴雀',
  'ekans': '阿柏蛇',
  'arbok': '阿柏怪',
  'pikachu': '皮卡丘',
  'raichu': '雷丘',
  'sandshrew': '穿山鼠',
  'sandslash': '穿山王',
  'nidoran-f': '尼多兰',
  'nidorina': '尼多娜',
  'nidoqueen': '尼多后',
  'nidoran-m': '尼多朗',
  'nidorino': '尼多力诺',
  'nidoking': '尼多王',
  'clefairy': '皮皮',
  'clefable': '皮可西',
  'vulpix': '六尾',
  'ninetales': '九尾',
  'jigglypuff': '胖丁',
  'wigglytuff': '胖可丁',
  'zubat': '超音蝠',
  'golbat': '大嘴蝠',
  'oddish': '走路草',
  'gloom': '臭臭花',
  'vileplume': '霸王花',
  'paras': '派拉斯',
  'parasect': '派拉斯特',
  'venonat': '毛球',
  'venomoth': '摩鲁蛾',
  'diglett': '地鼠',
  'dugtrio': '三地鼠',
  'meowth': '喵喵',
  'persian': '猫老大',
  'psyduck': '可达鸭',
  'golduck': '哥达鸭',
  'mankey': '猴怪',
  'primeape': '火暴猴',
  'growlithe': '卡蒂狗',
  'arcanine': '风速狗',
  'poliwag': '蚊香蝌蚪',
  'poliwhirl': '蚊香君',
  'poliwrath': '蚊香泳士',
  'abra': '凯西',
  'kadabra': '勇基拉',
  'alakazam': '胡地',
  'machop': '腕力',
  'machoke': '豪力',
  'machamp': '怪力',
  'bellsprout': '喇叭芽',
  'weepinbell': '口呆花',
  'victreebel': '大食花',
  'tentacool': '玛瑙水母',
  'tentacruel': '毒刺水母',
  'geodude': '小拳石',
  'graveler': '隆隆石',
  'golem': '隆隆岩',
  'ponyta': '小火马',
  'rapidash': '烈焰马',
  'slowpoke': '呆呆兽',
  'slowbro': '呆壳兽',
  'magnemite': '小磁怪',
  'magneton': '三合一磁怪',
  'farfetchd': '大葱鸭',
  'doduo': '嘟嘟',
  'dodrio': '嘟嘟利',
  'seel': '小海狮',
  'dewgong': '白海狮',
  'grimer': '臭泥',
  'muk': '臭臭泥',
  'shellder': '大舌贝',
  'cloyster': '刺甲贝',
  'gastly': '鬼斯',
  'haunter': '鬼斯通',
  'gengar': '耿鬼',
  'onix': '大岩蛇',
  'drowzee': '催眠貘',
  'hypno': '引梦貘人',
  'krabby': '大钳蟹',
  'kingler': '巨钳蟹',
  'voltorb': '霹雳电球',
  'electrode': '顽皮雷弹',
  'exeggcute': '蛋蛋',
  'exeggutor': '椰蛋树',
  'cubone': '卡拉卡拉',
  'marowak': '嘎啦嘎啦',
  'hitmonlee': '飞腿郎',
  'hitmonchan': '快拳郎',
  'lickitung': '大舌头',
  'koffing': '瓦斯弹',
  'weezing': '双弹瓦斯',
  'rhyhorn': '独角犀牛',
  'rhydon': '钻角犀兽',
  'chansey': '吉利蛋',
  'tangela': '蔓藤怪',
  'kangaskhan': '袋兽',
  'horsea': '墨海马',
  'seadra': '海刺龙',
  'goldeen': '角金鱼',
  'seaking': '金鱼王',
  'staryu': '海星星',
  'starmie': '宝石海星',
  'mr-mime': '魔墙人偶',
  'scyther': '飞天螳螂',
  'jynx': '迷唇姐',
  'electabuzz': '电击兽',
  'magmar': '鸭嘴火兽',
  'pinsir': '凯罗斯',
  'tauros': '肯泰罗',
  'magikarp': '鲤鱼王',
  'gyarados': '暴鲤龙',
  'lapras': '拉普拉斯',
  'ditto': '百变怪',
  'eevee': '伊布',
  'vaporeon': '水伊布',
  'jolteon': '雷伊布',
  'flareon': '火伊布',
  'porygon': '多边兽',
  'omanyte': '菊石兽',
  'omastar': '多刺菊石兽',
  'kabuto': '化石盔',
  'kabutops': '镰刀盔',
  'aerodactyl': '化石翼龙',
  'snorlax': '卡比兽',
  'articuno': '急冻鸟',
  'zapdos': '闪电鸟',
  'moltres': '火焰鸟',
  'dratini': '迷你龙',
  'dragonair': '哈克龙',
  'dragonite': '快龙',
  'mewtwo': '超梦',
  'mew': '梦幻',
  
  // 第二世代 (城都地区)
  'chikorita': '菊草叶',
  'bayleef': '月桂叶',
  'meganium': '大竺葵',
  'cyndaquil': '火球鼠',
  'quilava': '火岩鼠',
  'typhlosion': '火暴兽',
  'totodile': '小锯鳄',
  'croconaw': '蓝鳄',
  'feraligatr': '大力鳄',
  'sentret': '尾立',
  'furret': '大尾立',
  'hoothoot': '咕咕',
  'noctowl': '猫头夜鹰',
  'ledyba': '芭瓢虫',
  'ledian': '安瓢虫',
  'spinarak': '圆丝蛛',
  'ariados': '阿利多斯',
  'crobat': '叉字蝠',
  'chinchou': '灯笼鱼',
  'lanturn': '电灯怪',
  'pichu': '皮丘',
  'cleffa': '皮宝宝',
  'igglybuff': '宝宝丁',
  'togepi': '波克比',
  'togetic': '波克基古',
  'natu': '天然雀',
  'xatu': '天然鸟',
  'mareep': '绵绵',
  'flaaffy': '茸茸',
  'ampharos': '电龙',
  'bellossom': '美丽花',
  'marill': '玛力露',
  'azumarill': '玛力露丽',
  'sudowoodo': '树才怪',
  'politoed': '蚊香蛙皇',
  'hoppip': '毽子草',
  'skiploom': '毽子花',
  'jumpluff': '毽子棉',
  'aipom': '长尾怪手',
  'sunkern': '向日种子',
  'sunflora': '向日花怪',
  'yanma': '蜻蜻蜓',
  'wooper': '乌波',
  'quagsire': '沼王',
  'espeon': '太阳伊布',
  'umbreon': '月亮伊布',
  'murkrow': '黑暗鸦',
  'slowking': '河马王',
  'misdreavus': '梦妖',
  'unown': '未知图腾',
  'wobbuffet': '果然翁',
  'girafarig': '麒麟奇',
  'pineco': '榛果球',
  'forretress': '佛烈托斯',
  'dunsparce': '土龙弟弟',
  'gligar': '天蝎',
  'steelix': '大钢蛇',
  'snubbull': '布鲁',
  'granbull': '布鲁皇',
  'qwilfish': '千针鱼',
  'scizor': '巨钳螳螂',
  'shuckle': '壶壶',
  'heracross': '赫拉克罗斯',
  'sneasel': '狃拉',
  'teddiursa': '熊宝宝',
  'ursaring': '圈圈熊',
  'slugma': '熔岩虫',
  'magcargo': '熔岩蜗牛',
  'swinub': '小山猪',
  'piloswine': '长毛猪',
  'corsola': '太阳珊瑚',
  'remoraid': '铁炮鱼',
  'octillery': '章鱼桶',
  'delibird': '信使鸟',
  'mantine': '巨翅飞鱼',
  'skarmory': '盔甲鸟',
  'houndour': '戴鲁比',
  'houndoom': '黑鲁加',
  'kingdra': '刺龙王',
  'phanpy': '小小象',
  'donphan': '顿甲',
  'porygon2': '多边兽II',
  'stantler': '惊角鹿',
  'smeargle': '图图犬',
  'tyrogue': '巴尔郎',
  'hitmontop': '柯波朗',
  'smoochum': '迷唇娃',
  'elekid': '电击怪',
  'magby': '鸭嘴宝宝',
  'miltank': '大奶罐',
  'blissey': '幸福蛋',
  'raikou': '雷公',
  'entei': '炎帝',
  'suicune': '水君',
  'larvitar': '幼基拉斯',
  'pupitar': '沙基拉斯',
  'tyranitar': '班基拉斯',
  'lugia': '洛奇亚',
  'ho-oh': '凤王',
  'celebi': '时拉比',
  
  // 第三世代 (丰缘地区) - 热门宝可梦
  'treecko': '木守宫',
  'grovyle': '森林蜥蜴',
  'sceptile': '蜥蜴王',
  'torchic': '火稚鸡',
  'combusken': '力壮鸡',
  'blaziken': '火焰鸡',
  'mudkip': '水跃鱼',
  'marshtomp': '沼跃鱼',
  'swampert': '巨沼怪',
  'ralts': '拉鲁拉丝',
  'kirlia': '奇鲁莉安',
  'gardevoir': '沙奈朵',
  'mawile': '大嘴娃',
  'aron': '可可多拉',
  'lairon': '可多拉',
  'aggron': '波士可多拉',
  'electrike': '落雷兽',
  'manectric': '雷电兽',
  'roselia': '毒蔷薇',
  'carvanha': '利牙鱼',
  'sharpedo': '巨牙鲨',
  'wailmer': '吼吼鲸',
  'wailord': '吼鲸王',
  'numel': '呆火驼',
  'camerupt': '喷火驼',
  'trapinch': '大颚蚁',
  'vibrava': '超音波幼虫',
  'flygon': '沙漠蜻蜓',
  'swablu': '青绵鸟',
  'altaria': '七夕青鸟',
  'feebas': '丑丑鱼',
  'milotic': '美纳斯',
  'absol': '阿勃梭鲁',
  'bagon': '宝贝龙',
  'shelgon': '甲壳龙',
  'salamence': '暴飞龙',
  'beldum': '铁哑铃',
  'metang': '金属怪',
  'metagross': '巨金怪',
  'registeel': '雷吉斯奇鲁',
  'regirock': '雷吉洛克',
  'regice': '雷吉艾斯',
  'latias': '拉帝亚斯',
  'latios': '拉帝欧斯',
  'kyogre': '盖欧卡',
  'groudon': '固拉多',
  'rayquaza': '烈空坐',
  'jirachi': '基拉祈',
  'deoxys': '代欧奇希斯',
  
  // 第四世代 (神奥地区) - 热门宝可梦
  'turtwig': '草苗龟',
  'grotle': '树林龟',
  'torterra': '土台龟',
  'chimchar': '小火焰猴',
  'monferno': '猛火猴',
  'infernape': '烈焰猴',
  'piplup': '波加曼',
  'prinplup': '波皇子',
  'empoleon': '帝王拿波',
  'staraptor': '姆克鹰',
  'bidoof': '大牙狸',
  'bibarel': '大尾狸',
  'shinx': '小猫怪',
  'luxio': '勒克猫',
  'luxray': '伦琴猫',
  'roserade': '罗丝雷朵',
  'garchomp': '烈咬陆鲨',
  'riolu': '利欧路',
  'lucario': '路卡利欧',
  'gible': '圆陆鲨',
  'gabite': '尖牙陆鲨',
  'dialga': '帝牙卢卡',
  'palkia': '帕路奇亚',
  'giratina': '骑拉帝纳',
  'arceus': '阿尔宙斯',
  
  // 第五世代 (合众地区) - 热门宝可梦
  'snivy': '藤藤蛇',
  'servine': '青藤蛇',
  'serperior': '君主蛇',
  'tepig': '暖暖猪',
  'pignite': '炒炒猪',
  'emboar': '炎武王',
  'oshawott': '水水獭',
  'dewott': '双刃丸',
  'samurott': '大剑鬼',
  'audino': '差不多娃娃',
  'lilligant': '裙儿小姐',
  'darmanitan': '达摩狒狒',
  'sigilyph': '象征鸟',
  'cofagrigus': '死神棺',
  'zoroark': '索罗亚克',
  'zorua': '索罗亚',
  'gothitelle': '哥德小姐',
  'reuniclus': '人造细胞卵',
  'swanna': '舞天鹅',
  'vanilluxe': '双倍多多冰',
  'sawsbuck': '萌芽鹿',
  'emolga': '电飞鼠',
  'escavalier': '骑士蜗牛',
  'amoonguss': '败露球菇',
  'jellicent': '胖嘟嘟',
  'galvantula': '电蜘蛛',
  'ferrothorn': '坚果哑铃',
  'klinklang': '齿轮怪',
  'eelektross': '麻麻鳗鱼王',
  'beheeyem': '大宇怪',
  'chandelure': '水晶灯火灵',
  'haxorus': '双斧战龙',
  'beartic': '冻原熊',
  'mienshao': '师父鼬',
  'druddigon': '赤面龙',
  'golurk': '泥偶巨人',
  'bisharp': '劈斩司令',
  'braviary': '勇士雄鹰',
  'mandibuzz': '秃鹰娜',
  'durant': '铁蚁',
  'deino': '单首龙',
  'zweilous': '双首暴龙',
  'hydreigon': '三首恶龙',
  'volcarona': '火神蛾',
  'cobalion': '勾帕路翁',
  'terrakion': '代拉基翁',
  'virizion': '毕力吉翁',
  'zekrom': '捷克罗姆',
  'reshiram': '莱希拉姆',
  'kyurem': '酋雷姆',
  'keldeo': '凯路迪欧',
  'meloetta': '美洛耶塔',
  'genesect': '盖诺赛克特',
  
  // 第六世代 (卡洛斯地区) - 热门宝可梦
  'chespin': '哈力栗',
  'quilladin': '胖胖哈力',
  'chesnaught': '布里卡隆',
  'fennekin': '火狐狸',
  'braixen': '长尾火狐',
  'delphox': '妖火红狐',
  'froakie': '呱呱泡蛙',
  'frogadier': '呱头蛙',
  'greninja': '甲贺忍蛙',
  'talonflame': '烈箭鹰',
  'vivillon': '彩粉蝶',
  'pyroar': '火炎狮',
  'florges': '花洁夫人',
  'gogoat': '坐骑山羊',
  'pangoro': '流氓熊猫',
  'furfrou': '多丽米亚',
  'meowstic': '超能妙喵',
  'aegislash': '坚盾剑怪',
  'slurpuff': '胖甜妮',
  'malamar': '乌贼王',
  'dragalge': '毒藻龙',
  'clawitzer': '钢炮臂虾',
  'heliolisk': '光电伞蜥',
  'tyrantrum': '怪颚龙',
  'aurorus': '冰雪巨龙',
  'sylveon': '仙子伊布',
  'hawlucha': '摔角鹰人',
  'dedenne': '咚咚鼠',
  'carbink': '小碎钻',
  'goomy': '黏黏宝',
  'sliggoo': '黏美儿',
  'goodra': '黏美龙',
  'klefki': '钥圈儿',
  'trevenant': '朽木妖',
  'gourgeist': '南瓜怪人',
  'avalugg': '冰岩怪',
  'noivern': '音波龙',
  'xerneas': '哲尔尼亚斯',
  'yveltal': '伊裴尔塔尔',
  'zygarde': '基格尔德',
  'diancie': '蒂安希',
  'hoopa': '胡帕',
  'volcanion': '波尔凯尼恩',
  
  // 第七世代 (阿罗拉地区) - 热门宝可梦
  'rowlet': '木木枭',
  'dartrix': '投羽枭',
  'decidueye': '狙射树枭',
  'litten': '火斑喵',
  'torracat': '炎热喵',
  'incineroar': '炽焰咆哮虎',
  'popplio': '球球海狮',
  'brionne': '花漾海狮',
  'primarina': '西狮海壬',
  'pikipek': '小笃儿',
  'trumbeak': '喇叭啄鸟',
  'toucannon': '铳嘴大鸟',
  'rockruff': '岩狗狗',
  'lycanroc': '鬃岩狼人',
  'wishiwashi': '弱丁鱼',
  'mareanie': '好坏星',
  'toxapex': '超坏星',
  'mudbray': '泥驴仔',
  'mudsdale': '重泥挽马',
  'dewpider': '滴蛛',
  'araquanid': '滴蛛霸',
  'fomantis': '伪螳草',
  'lurantis': '兰螳花',
  'shiinotic': '灯罩夜菇',
  'salandit': '夜盗火蜥',
  'salazzle': '焰后蜥',
  'stufful': '童偶熊',
  'bewear': '穿着熊',
  'bounsweet': '甜竹竹',
  'steenee': '甜舞妞',
  'tsareena': '甜冷美后',
  'comfey': '花疗环环',
  'oranguru': '智挥猩',
  'passimian': '投掷猴',
  'wimpod': '胆小虫',
  'golisopod': '具甲武者',
  'sandygast': '沙丘娃',
  'palossand': '噬沙堡爷',
  'pyukumuku': '拳海参',
  'turtonator': '爆焰龟兽',
  'togedemaru': '托戈德玛尔',
  'mimikyu': '谜拟Q',
  'bruxish': '磨牙彩皮鱼',
  'drampa': '老翁龙',
  'dhelmise': '破破舵轮',
  'jangmo-o': '心鳞宝',
  'hakamo-o': '鳞甲龙',
  'kommo-o': '杖尾鳞甲龙',
  'tapu-koko': '卡璞·鸣鸣',
  'tapu-lele': '卡璞·蝶蝶',
  'tapu-bulu': '卡璞·哞哞',
  'tapu-fini': '卡璞·鳍鳍',
  'cosmog': '科斯莫古',
  'cosmoem': '科斯莫姆',
  'solgaleo': '索尔迦雷欧',
  'lunala': '露奈雅拉',
  'necrozma': '奈克洛兹玛',
  'magearna': '玛机雅娜',
  'marshadow': '玛夏多',
  'zeraora': '捷拉奥拉',
  
  // 第八世代 (伽勒尔地区) - 热门宝可梦
  'grookey': '敲音猴',
  'thwackey': '啪咚猴',
  'rillaboom': '轰擂金刚猩',
  'scorbunny': '炎兔儿',
  'raboot': '腾蹴小将',
  'cinderace': '闪焰王牌',
  'sobble': '泪眼蜥',
  'drizzile': '变涩蜥',
  'inteleon': '千面避役',
  'corviknight': '钢铠鸦',
  'orbeetle': '以欧路普',
  'thievul': '狐大盗',
  'eldegoss': '白蓬蓬',
  'wooloo': '毛辫羊',
  'dubwool': '毛毛角羊',
  'chewtle': '咬咬龟',
  'drednaw': '暴噬龟',
  'yamper': '来电汪',
  'boltund': '逐电犬',
  'rolycoly': '小炭仔',
  'carkol': '大炭车',
  'coalossal': '庞炭龟',
  'applin': '啃果虫',
  'flapple': '苹裹龙',
  'appletun': '丰蜜龙',
  'silicobra': '沙包蛇',
  'sandaconda': '沙螺蟒',
  'cramorant': '古月鸟',
  'arrokuda': '刺梭鱼',
  'barraskewda': '戽斗尖梭',
  'toxel': '毒电婴',
  'toxtricity': '颤弦蜥',
  'sizzlipede': '烧火蚣',
  'centiskorch': '焚焰蚣',
  'clobbopus': '拳拳蛸',
  'grapploct': '八爪武师',
  'sinistea': '来悲茶',
  'polteageist': '怖思壶',
  'hatenna': '迷布莉姆',
  'hattrem': '提布莉姆',
  'hatterene': '布莉姆温',
  'impidimp': '捣蛋小妖',
  'morgrem': '诈唬魔',
  'grimmsnarl': '长毛巨魔',
  'milcery': '小仙奶',
  'alcremie': '霜奶仙',
  'falinks': '列阵兵',
  'pincurchin': '啪嚓海胆',
  'snom': '雪吞虫',
  'frosmoth': '雪绒蛾',
  'stonjourner': '巨石丁',
  'eiscue': '冰砌鹅',
  'indeedee': '爱管侍',
  'morpeko': '莫鲁贝可',
  'cufant': '铜象',
  'copperajah': '大王铜象',
  'dracozolt': '雷鸟龙',
  'arctozolt': '雷鸟海兽',
  'dracovish': '鳃鱼龙',
  'arctovish': '鳃鱼海兽',
  'duraludon': '铝钢龙',
  'dreepy': '多龙梅西亚',
  'drakloak': '多龙奇',
  'dragapult': '多龙巴鲁托',
  'zacian': '苍响',
  'zamazenta': '藏玛然特',
  'eternatus': '无极汰那',
  'kubfu': '熊徒弟',
  'urshifu': '武道熊师',
  'regieleki': '雷吉艾勒奇',
  'regidrago': '雷吉铎拉戈',
  'glastrier': '雪暴马',
  'spectrier': '灵幽马',
  'calyrex': '蕾冠王',
  
  // 第九世代 (帕底亚地区) - 热门宝可梦
  'sprigatito': '新叶喵',
  'floragato': '蒂蕾喵',
  'meowscarada': '魔幻假面喵',
  'fuecoco': '呆火鳄',
  'crocalor': '炙烫鳄',
  'skeledirge': '骨纹巨声鳄',
  'quaxly': '润水鸭',
  'quaxwell': '涌跃鸭',
  'quaquaval': '狂欢浪舞鸭',
  'lechonk': '爱吃豚',
  'oinkologne': '飘香豚',
  'tarountula': '团珠蛛',
  'spidops': '操陷蛛',
  'nymble': '豆蟋蟀',
  'lokix': '烈腿蝗',
  'pawmi': '布拨',
  'pawmo': '布土拨',
  'pawmot': '巴布土拨',
  'tandemaus': '一对鼠',
  'maushold': '一家鼠',
  'fidough': '狗仔包',
  'dachsbun': '麻花犬',
  'smoliv': '迷你芙',
  'dolliv': '奥利纽',
  'arboliva': '奥利瓦',
  'squawkabilly': '怒鹦哥',
  'nacli': '盐石宝',
  'naclstack': '盐石垒',
  'garganacl': '盐石巨灵',
  'charcadet': '炭小侍',
  'armarouge': '红莲铠骑',
  'ceruledge': '苍炎刃鬼',
  'tadbulb': '光蚪仔',
  'bellibolt': '电肚蛙',
  'wattrel': '电海燕',
  'kilowattrel': '大电海燕',
  'maschiff': '偶叫獒',
  'mabosstiff': '獒教父',
  'shroodle': '滋汁鼹',
  'grafaiai': '涂标客',
  'bramblin': '纳噬草',
  'brambleghast': '怖纳噬草',
  'toedscool': '原野水母',
  'toedscruel': '陆地水母',
  'klawf': '毛崖蟹',
  'capsakid': '热辣娃',
  'scovillain': '狠辣椒',
  'rellor': '虫滚泥',
  'rabsca': '虫甲圣',
  'flittle': '飘飘雏',
  'espathra': '超能艳鸵',
  'tinkatink': '小锻匠',
  'tinkatuff': '巧锻匠',
  'tinkaton': '巨锻匠',
  'wiglett': '海地鼠',
  'wugtrio': '三海地鼠',
  'bombirdier': '下石鸟',
  'finizen': '波普海豚',
  'palafin': '海豚侠',
  'varoom': '噗隆隆',
  'revavroom': '普隆隆姆',
  'cyclizar': '摩托蜥',
  'orthworm': '拖拖蚓',
  'glimmet': '晶光芽',
  'glimmora': '晶光花',
  'greavard': '墓仔狗',
  'houndstone': '墓扬犬',
  'flamigo': '缠红鹤',
  'cetoddle': '走鲸',
  'cetitan': '浩大鲸',
  'veluza': '轻身鳕',
  'dondozo': '吃吼霸',
  'tatsugiri': '米立龙',
  'annihilape': '弃世猴',
  'clodsire': '土王',
  'farigiraf': '奇麒麟',
  'dudunsparce': '土龙节节',
  'kingambit': '仆斩将军',
  'great-tusk': '雄伟牙',
  'scream-tail': '吼叫尾',
  'brute-bonnet': '猛恶菇',
  'flutter-mane': '振翼发',
  'slither-wing': '爬地翅',
  'sandy-shocks': '沙铁皮',
  'iron-treads': '铁辙迹',
  'iron-bundle': '铁包袱',
  'iron-hands': '铁臂膀',
  'iron-jugulis': '铁脖颈',
  'iron-moth': '铁毒蛾',
  'iron-thorns': '铁荆棘',
  'frigibax': '凉脊龙',
  'arctibax': '冻脊龙',
  'baxcalibur': '戟脊龙',
  'gimmighoul': '索财灵',
  'gholdengo': '赛富豪',
  'wo-chien': '古简蜗',
  'chien-pao': '古剑豹',
  'ting-lu': '古鼎鹿',
  'chi-yu': '古玉鱼',
  'roaring-moon': '轰鸣月',
  'iron-valiant': '铁武者',
  'koraidon': '故勒顿',
  'miraidon': '密勒顿',
  'walking-wake': '波荡水',
  'iron-leaves': '铁斑叶',
};

/**
 * 从物种信息中提取中文名称
 * @param species 宝可梦物种信息
 * @returns 中文名称，如果未找到则返回null
 */
export function extractChineseName(species: any): string | null {
  if (!species) {
    console.log('[extractChineseName] 没有提供species数据');
    return null;
  }
  
  console.log('[extractChineseName] species数据:', {
    id: species.id,
    name: species.name,
    hasNames: !!species.names,
    namesLength: species.names ? species.names.length : 0,
    hasGenera: !!species.genera,
    generaLength: species.genera ? species.genera.length : 0
  });
  
  // 确保names存在且是数组
  if (!species.names || !Array.isArray(species.names)) {
    console.log('[extractChineseName] species.names不存在或不是数组');
    
    // 尝试通过其他方式获取中文名称
    if (species.genera && Array.isArray(species.genera)) {
      console.log('[extractChineseName] 尝试从genera获取中文名称');
      return extractChineseNameFromGenera(species.genera);
    }
    
    return null;
  }
  
  console.log(`[extractChineseName] 找到 ${species.names.length} 个名称条目`);
  
  // 尝试获取简体中文名称
  const languages = ['zh-Hans', 'zh', 'zh-Hant'];
  
  for (const lang of languages) {
    const nameEntry = species.names.find((entry: any) => 
      entry.language && entry.language.name === lang
  );
  
    if (nameEntry && nameEntry.name) {
      console.log(`[extractChineseName] 找到 ${lang} 名称: ${nameEntry.name}`);
      return nameEntry.name;
    }
  }
  
  // 尝试从genera获取中文名称
  if (species.genera && Array.isArray(species.genera)) {
    const chineseName = extractChineseNameFromGenera(species.genera);
    if (chineseName) {
      return chineseName;
    }
  }
  
  console.log('[extractChineseName] 未找到中文名称');
  return null;
  }
  
/**
 * 从genera数据中提取中文名称
 * @param genera 分类数据数组
 * @returns 提取的中文名称，如果未找到则返回null
 */
function extractChineseNameFromGenera(genera: any[]): string | null {
  if (!genera || !Array.isArray(genera)) {
    return null;
  }
  
  const languages = ['zh-Hans', 'zh', 'zh-Hant'];
  
  for (const lang of languages) {
    const genusEntry = genera.find((entry: any) => 
      entry.language && entry.language.name === lang
  );
  
    if (genusEntry && genusEntry.genus) {
      // 通常genera包含分类，如"种子宝可梦"，可以提取其中的宝可梦名称部分
      const genusParts = genusEntry.genus.split(' ');
      if (genusParts.length > 0 && genusParts[0]) {
        console.log(`[extractChineseNameFromGenera] 从genera提取名称: ${genusParts[0]}`);
        return genusParts[0];
      }
    }
  }
  
  return null;
}

/**
 * 获取宝可梦中文名称
 * 
 * 如果提供了species参数，会优先使用API返回的官方中文名称
 * 否则使用本地映射表中的名称
 * 
 * @param name 英文名称
 * @param species 宝可梦物种信息（可选）
 * @returns 格式化后的名称，如果有中文名则返回"中文（英文）"格式
 */
export function getPokemonChineseName(name: string, species?: any): string {
  const formattedEnglishName = formatPokemonName(name);
  const lookupKey = name.toLowerCase();
  
  // 记录诊断信息
  console.log(`[getPokemonChineseName] 查询: ${name}, 格式化: ${formattedEnglishName}`);
  
  // 首先尝试从物种信息中获取中文名称
  if (species) {
    console.log(`[getPokemonChineseName] 检查species数据: ${species.name}, ID: ${species.id}`);
    
    // 尝试通过species.name来查找本地映射表
    // 有时species.name比pokemon.name更标准化
    if (species.name && species.name !== name) {
      const speciesNameKey = species.name.toLowerCase();
      const speciesLocalName = POKEMON_CHINESE_NAMES[speciesNameKey];
      if (speciesLocalName) {
        console.log(`[getPokemonChineseName] 通过species.name找到本地名称: ${speciesLocalName}`);
        return `${speciesLocalName}（${formattedEnglishName}）`;
      }
    }
    
    // 尝试从API数据中提取中文名称
    const apiChineseName = extractChineseName(species);
    if (apiChineseName) {
      console.log(`[getPokemonChineseName] 从API获取到中文名: ${apiChineseName}`);
      return `${apiChineseName}（${formattedEnglishName}）`;
    }
  }
  
  // 如果没有物种信息或未找到中文名，则使用本地映射表
  const localChineseName = POKEMON_CHINESE_NAMES[lookupKey];
  if (localChineseName) {
    console.log(`[getPokemonChineseName] 从本地映射表获取到中文名: ${localChineseName}`);
    return `${localChineseName}（${formattedEnglishName}）`;
  }
  
  // 尝试处理特殊形态（例如mega-形态、gmax-形态等）
  if (lookupKey.includes('-')) {
    // 获取基础名称（去掉形态信息）
    const baseName = lookupKey.split('-')[0];
    const baseChineseName = POKEMON_CHINESE_NAMES[baseName];
    if (baseChineseName) {
      console.log(`[getPokemonChineseName] 找到基础形态 ${baseName} 的中文名: ${baseChineseName}`);
      return `${baseChineseName}（${formattedEnglishName}）`;
    }
  }
  
  // 尝试使用ID号直接匹配（如果species中有ID）
  if (species && species.id) {
    // 在本地表中查找对应ID的宝可梦
    const entries = Object.entries(POKEMON_CHINESE_NAMES);
    for (let i = 0; i < entries.length; i++) {
      const [, value] = entries[i];
      if (i + 1 === species.id) { // 索引从0开始，而ID从1开始
        console.log(`[getPokemonChineseName] 通过ID ${species.id} 找到名称: ${value}`);
        return `${value}（${formattedEnglishName}）`;
      }
    }
  }
  
  // 如果都未找到，只返回格式化的英文名
  console.log(`[getPokemonChineseName] 未找到中文名，返回英文名: ${formattedEnglishName}`);
  return formattedEnglishName;
}

/**
 * 格式化宝可梦英文名称
 * @param name 英文名称
 * @returns 首字母大写并处理连字符的名称
 */
export function formatPokemonName(name: string): string {
  return name.split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ');
}

/**
 * 从技能详情中提取中文名称
 * @param moveDetail 技能详情
 * @returns 中文名称，如果未找到则返回null
 */
export function extractMoveChineseName(moveDetail: any): string | null {
  if (!moveDetail || !moveDetail.names || !Array.isArray(moveDetail.names)) {
    return null;
  }
  
  // 首先尝试获取简体中文名称 (zh-Hans)
  const zhHans = moveDetail.names.find((entry: any) => 
    entry.language && entry.language.name === 'zh-Hans'
  );
  
  if (zhHans && zhHans.name) {
    return zhHans.name;
  }
  
  // 如果没有简体中文，则尝试获取繁体中文名称 (zh-Hant)
  const zhHant = moveDetail.names.find((entry: any) => 
    entry.language && entry.language.name === 'zh-Hant'
  );
  
  if (zhHant && zhHant.name) {
    return zhHant.name;
  }
  
  // 如果都未找到，返回null
  return null;
}

/**
 * 从技能详情中提取中文描述
 * @param moveDetail 技能详情
 * @returns 中文描述，如果未找到则返回null
 */
export function extractMoveChineseDescription(moveDetail: any): string | null {
  if (!moveDetail || !moveDetail.flavor_text_entries || !Array.isArray(moveDetail.flavor_text_entries)) {
    return null;
  }
  
  // 获取所有中文描述
  const chineseEntries = moveDetail.flavor_text_entries.filter((entry: any) => 
    entry.language && (entry.language.name === 'zh-Hans' || entry.language.name === 'zh-Hant')
  );
  
  // 如果有中文描述，优先使用简体中文，然后是繁体中文
  const zhHans = chineseEntries.find((entry: any) => entry.language.name === 'zh-Hans');
  if (zhHans && zhHans.flavor_text) {
    return zhHans.flavor_text;
  }
  
  const zhHant = chineseEntries.find((entry: any) => entry.language.name === 'zh-Hant');
  if (zhHant && zhHant.flavor_text) {
    return zhHant.flavor_text;
  }
  
  // 如果都未找到，返回null
  return null;
}

/**
 * 获取技能中英文名称
 * @param name 英文名称
 * @param moveDetail 技能详情（可选）
 * @returns 格式化后的名称，如果有中文名则返回"中文（英文）"格式
 */
export function getMoveChineseName(name: string, moveDetail?: any): string {
  const formattedEnglishName = formatPokemonName(name);
  
  // 如果有技能详情，尝试提取中文名称
  if (moveDetail) {
    const chineseName = extractMoveChineseName(moveDetail);
    if (chineseName) {
      return `${chineseName}（${formattedEnglishName}）`;
    }
  }
  
  // 如果没有找到中文名称，返回格式化的英文名
  return formattedEnglishName;
}

/**
 * 从特性详情中提取中文名称
 * @param abilityDetail 特性详情
 * @returns 中文名称，如果未找到则返回null
 */
export function extractAbilityChineseName(abilityDetail: any): string | null {
  if (!abilityDetail || !abilityDetail.names || !Array.isArray(abilityDetail.names)) {
    return null;
  }
  
  // 尝试获取简体中文名称
  const languages = ['zh-Hans', 'zh', 'zh-Hant'];
  
  for (const lang of languages) {
    const nameEntry = abilityDetail.names.find((entry: any) => 
      entry.language && entry.language.name === lang
    );
    
    if (nameEntry && nameEntry.name) {
      return nameEntry.name;
    }
  }
  
  // 如果都未找到，返回null
  return null;
}

/**
 * 从特性详情中提取中文描述
 * @param abilityDetail 特性详情
 * @returns 中文描述，如果未找到则返回null
 */
export function extractAbilityChineseDescription(abilityDetail: any): string | null {
  if (!abilityDetail || !abilityDetail.effect_entries || !Array.isArray(abilityDetail.effect_entries)) {
    return null;
  }
  
  // 尝试获取中文描述
  const chineseEntry = abilityDetail.effect_entries.find((entry: any) => 
    entry.language && (entry.language.name === 'zh-Hans' || entry.language.name === 'zh-Hant' || entry.language.name === 'zh')
  );
  
  if (chineseEntry && chineseEntry.short_effect) {
    return chineseEntry.short_effect;
  }
  
  // 如果没有找到中文描述，尝试使用英文描述
  const englishEntry = abilityDetail.effect_entries.find((entry: any) => 
    entry.language && entry.language.name === 'en'
  );
  
  if (englishEntry && englishEntry.short_effect) {
    return englishEntry.short_effect;
  }
  
  // 如果都未找到，返回null
  return null;
}

/**
 * 获取特性中英文名称
 * @param name 英文名称
 * @param abilityDetail 特性详情（可选）
 * @returns 格式化后的名称，如果有中文名则返回"中文（英文）"格式
 */
export function getAbilityChineseName(name: string, abilityDetail?: any): string {
  const formattedEnglishName = formatPokemonName(name);
  
  // 如果有特性详情，尝试提取中文名称
  if (abilityDetail) {
    const chineseName = extractAbilityChineseName(abilityDetail);
    if (chineseName) {
      return `${chineseName}（${formattedEnglishName}）`;
    }
  }
  
  // 如果没有找到中文名称，返回格式化的英文名
  return formattedEnglishName;
} 