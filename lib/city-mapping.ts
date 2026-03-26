/**
 * 城市名称映射 - 中文到拼音
 * 解决 Open-Meteo Geocoding API 对中文支持不稳定的问题
 */

export interface CityMapping {
  chinese: string;
  pinyin: string;
  province: string;
}

// 常见中文城市映射表
export const CITY_MAP: CityMapping[] = [
  // 直辖市
  { chinese: "北京", pinyin: "Beijing", province: "北京市" },
  { chinese: "上海", pinyin: "Shanghai", province: "上海市" },
  { chinese: "天津", pinyin: "Tianjin", province: "天津市" },
  { chinese: "重庆", pinyin: "Chongqing", province: "重庆市" },

  // 省会城市
  { chinese: "福州", pinyin: "Fuzhou", province: "福建省" },
  { chinese: "厦门", pinyin: "Xiamen", province: "福建省" },
  { chinese: "广州", pinyin: "Guangzhou", province: "广东省" },
  { chinese: "深圳", pinyin: "Shenzhen", province: "广东省" },
  { chinese: "杭州", pinyin: "Hangzhou", province: "浙江省" },
  { chinese: "南京", pinyin: "Nanjing", province: "江苏省" },
  { chinese: "武汉", pinyin: "Wuhan", province: "湖北省" },
  { chinese: "成都", pinyin: "Chengdu", province: "四川省" },
  { chinese: "西安", pinyin: "Xian", province: "陕西省" },
  { chinese: "沈阳", pinyin: "Shenyang", province: "辽宁省" },
  { chinese: "济南", pinyin: "Jinan", province: "山东省" },
  { chinese: "郑州", pinyin: "Zhengzhou", province: "河南省" },
  { chinese: "长沙", pinyin: "Changsha", province: "湖南省" },
  { chinese: "哈尔滨", pinyin: "Harbin", province: "黑龙江省" },
  { chinese: "长春", pinyin: "Changchun", province: "吉林省" },
  { chinese: "石家庄", pinyin: "Shijiazhuang", province: "河北省" },
  { chinese: "太原", pinyin: "Taiyuan", province: "山西省" },
  { chinese: "合肥", pinyin: "Hefei", province: "安徽省" },
  { chinese: "南昌", pinyin: "Nanchang", province: "江西省" },
  { chinese: "南宁", pinyin: "Nanning", province: "广西壮族自治区" },
  { chinese: "海口", pinyin: "Haikou", province: "海南省" },
  { chinese: "昆明", pinyin: "Kunming", province: "云南省" },
  { chinese: "贵阳", pinyin: "Guiyang", province: "贵州省" },
  { chinese: "兰州", pinyin: "Lanzhou", province: "甘肃省" },
  { chinese: "西宁", pinyin: "Xining", province: "青海省" },
  { chinese: "拉萨", pinyin: "Lhasa", province: "西藏自治区" },
  { chinese: "呼和浩特", pinyin: "Hohhot", province: "内蒙古自治区" },
  { chinese: "银川", pinyin: "Yinchuan", province: "宁夏回族自治区" },
  { chinese: "乌鲁木齐", pinyin: "Urumqi", province: "新疆维吾尔自治区" },

  // 重要地级市
  { chinese: "泉州", pinyin: "Quanzhou", province: "福建省" },
  { chinese: "漳州", pinyin: "Zhangzhou", province: "福建省" },
  { chinese: "莆田", pinyin: "Putian", province: "福建省" },
  { chinese: "三明", pinyin: "Sanming", province: "福建省" },
  { chinese: "南平", pinyin: "Nanping", province: "福建省" },
  { chinese: "龙岩", pinyin: "Longyan", province: "福建省" },
  { chinese: "宁德", pinyin: "Ningde", province: "福建省" },
  { chinese: "珠海", pinyin: "Zhuhai", province: "广东省" },
  { chinese: "东莞", pinyin: "Dongguan", province: "广东省" },
  { chinese: "佛山", pinyin: "Foshan", province: "广东省" },
  { chinese: "惠州", pinyin: "Huizhou", province: "广东省" },
  { chinese: "苏州", pinyin: "Suzhou", province: "江苏省" },
  { chinese: "无锡", pinyin: "Wuxi", province: "江苏省" },
  { chinese: "常州", pinyin: "Changzhou", province: "江苏省" },
  { chinese: "徐州", pinyin: "Xuzhou", province: "江苏省" },
  { chinese: "宁波", pinyin: "Ningbo", province: "浙江省" },
  { chinese: "温州", pinyin: "Wenzhou", province: "浙江省" },
  { chinese: "嘉兴", pinyin: "Jiaxing", province: "浙江省" },
  { chinese: "青岛", pinyin: "Qingdao", province: "山东省" },
  { chinese: "烟台", pinyin: "Yantai", province: "山东省" },
  { chinese: "潍坊", pinyin: "Weifang", province: "山东省" },
  { chinese: "大连", pinyin: "Dalian", province: "辽宁省" },
  { chinese: "鞍山", pinyin: "Anshan", province: "辽宁省" },
  { chinese: "抚顺", pinyin: "Fushun", province: "辽宁省" },
  { chinese: "唐山", pinyin: "Tangshan", province: "河北省" },
  { chinese: "保定", pinyin: "Baoding", province: "河北省" },
  { chinese: "廊坊", pinyin: "Langfang", province: "河北省" },
  { chinese: "邯郸", pinyin: "Handan", province: "河北省" },
  { chinese: "洛阳", pinyin: "Luoyang", province: "河南省" },
  { chinese: "开封", pinyin: "Kaifeng", province: "河南省" },
  { chinese: "南阳", pinyin: "Nanyang", province: "河南省" },
  { chinese: "宜昌", pinyin: "Yichang", province: "湖北省" },
  { chinese: "襄阳", pinyin: "Xiangyang", province: "湖北省" },
  { chinese: "株洲", pinyin: "Zhuzhou", province: "湖南省" },
  { chinese: "湘潭", pinyin: "Xiangtan", province: "湖南省" },
  { chinese: "衡阳", pinyin: "Hengyang", province: "湖南省" },
  { chinese: "绵阳", pinyin: "Mianyang", province: "四川省" },
  { chinese: "德阳", pinyin: "Deyang", province: "四川省" },
  { chinese: "乐山", pinyin: "Leshan", province: "四川省" },
  { chinese: "南充", pinyin: "Nanchong", province: "四川省" },
  { chinese: "曲靖", pinyin: "Qujing", province: "云南省" },
  { chinese: "大理", pinyin: "Dali", province: "云南省" },
  { chinese: "桂林", pinyin: "Guilin", province: "广西壮族自治区" },
  { chinese: "柳州", pinyin: "Liuzhou", province: "广西壮族自治区" },
  { chinese: "三亚", pinyin: "Sanya", province: "海南省" },
  { chinese: "包头", pinyin: "Baotou", province: "内蒙古自治区" },
  { chinese: "赣州", pinyin: "Ganzhou", province: "江西省" },
  { chinese: "九江", pinyin: "Jiujiang", province: "江西省" },
  { chinese: "赣州", pinyin: "Ganzhou", province: "江西省" },
];

/**
 * 将中文城市名转换为拼音
 */
export function convertChineseToPinyin(cityName: string): string {
  // 去除空格
  const name = cityName.trim();

  // 查找映射表
  const mapping = CITY_MAP.find(m => m.chinese === name);

  if (mapping) {
    console.log(`[城市名转换] ${name} → ${mapping.pinyin}`);
    return mapping.pinyin;
  }

  // 如果不在映射表中，尝试简单转换（首字母大写）
  // 例如：成都 → Chengdu
  console.log(`[城市名转换] ${name} 未找到映射，尝试直接使用`);

  // 如果包含中文，返回原值让API处理
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name;
  }

  // 纯ASCII，直接返回
  return name;
}

/**
 * 获取城市建议列表（用于提示用户）
 */
export function getCitySuggestions(input: string): string[] {
  const suggestions: string[] = [];
  const name = input.trim().toLowerCase();

  if (name.length === 0) return suggestions;

  // 搜索匹配的城市
  CITY_MAP.forEach(mapping => {
    if (mapping.chinese.includes(name) ||
        mapping.pinyin.toLowerCase().includes(name) ||
        mapping.chinese === input) {
      suggestions.push(mapping.chinese);
    }
  });

  // 最多返回5个建议
  return suggestions.slice(0, 5);
}
