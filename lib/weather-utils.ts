/**
 * Weather Analyzer - 核心工具函数
 * 从原始项目迁移的核心逻辑
 */

// 天气代码映射（来自 weather-visualizer）
export const WEATHER_CODES: { [key: number]: string } = {
  0: "晴",
  1: "晴到多云",
  2: "多云",
  3: "阴天",
  45: "雾",
  48: "雾凇",
  51: "毛毛雨",
  53: "毛毛雨",
  55: "毛毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  80: "阵雨",
  81: "阵雨",
  82: "暴雨",
  95: "雷雨",
  96: "雷雨",
  99: "雷雨",
};

// 天气图标映射
export const WEATHER_ICONS: { [key: number]: string } = {
  0: "☀️",
  1: "⛅",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌧️",
  53: "🌧️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "❄️",
  73: "❄️",
  75: "❄️",
  80: "🌦️",
  81: "🌦️",
  82: "⛈️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

// 获取天气描述
export function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code] || "未知";
}

// 获取天气图标
export function getWeatherIcon(code: number): string {
  return WEATHER_ICONS[code] || "🌡️";
}

// 风向转换
export function getWindDirection(degrees: number): string {
  const directions = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// UV 指数等级
export function getUVLevel(uv: number): { level: string; color: string; advice: string } {
  if (uv <= 2) {
    return {
      level: "低",
      color: "#4CAF50",
      advice: "无需防护"
    };
  } else if (uv <= 5) {
    return {
      level: "中等",
      color: "#FFC107",
      advice: "建议防护 SPF 15+"
    };
  } else if (uv <= 7) {
    return {
      level: "高",
      color: "#FF9800",
      advice: "必须防护 SPF 30+"
    };
  } else if (uv <= 10) {
    return {
      level: "很高",
      color: "#F44336",
      advice: "必须防护 SPF 50+"
    };
  } else {
    return {
      level: "极高",
      color: "#9C27B0",
      advice: "避免户外活动"
    };
  }
}

// AQI 等级
export function getAQILevel(aqi: number): { level: string; color: string; impact: string } {
  if (aqi <= 50) {
    return {
      level: "优",
      color: "#4CAF50",
      impact: "空气质量令人满意，基本无空气污染"
    };
  } else if (aqi <= 100) {
    return {
      level: "良",
      color: "#FFC107",
      impact: "空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响"
    };
  } else if (aqi <= 150) {
    return {
      level: "轻度污染",
      color: "#FF9800",
      impact: "易感人群症状有轻度加剧，健康人群出现刺激症状"
    };
  } else if (aqi <= 200) {
    return {
      level: "中度污染",
      color: "#F44336",
      impact: "进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响"
    };
  } else if (aqi <= 300) {
    return {
      level: "重度污染",
      color: "#9C27B0",
      impact: "心脏病和肺病患者症状显著加剧，运动耐受力降低，健康人群普遍出现症状"
    };
  } else {
    return {
      level: "严重污染",
      color: "#212121",
      impact: "健康人群运动耐受力降低，有强烈症状，提前出现某些疾病"
    };
  }
}

// 舒适度指数
export function getComfortIndex(temp: number, humidity: number, wind: number): string {
  if (temp < 10) return "寒冷";
  if (temp < 18) return "较冷";
  if (temp < 26) {
    if (humidity > 70) return "闷热";
    if (humidity < 40) return "干燥";
    return "舒适";
  }
  if (temp < 32) return "较热";
  return "炎热";
}

// 穿衣建议
export function getClothingAdvice(temp: number, weather: string): string {
  if (temp < 10) return "羽绒服、棉衣、毛衣等保暖衣物";
  if (temp < 18) return "夹克、毛衣、薄外套等";
  if (temp < 26) return "长袖、薄外套等";
  if (temp < 32) return "短袖、短裤等轻薄衣物";
  return "短袖、短裤等，注意防暑降温";
}

// 运动建议
export function getExerciseAdvice(weather: string, temp: number, aqi?: number): string {
  if (aqi && aqi > 150) return "空气污染较重，不建议户外运动";
  if (weather.includes("雨") || weather.includes("雷")) return "天气不佳，建议室内运动";
  if (temp > 35 || temp < 0) return "极端温度，不建议户外运动";
  return "天气适宜，可以户外运动";
}

// 洗车建议
export function getCarWashAdvice(weatherCode: number, precipProb: number): string {
  console.log(`[洗车建议] weatherCode=${weatherCode}, precipProb=${precipProb}`);

  // 判断是否有雨：包括降雨(60-69)、阵雨(80-82)、雷暴(95-99)
  const hasRain = (weatherCode >= 60 && weatherCode <= 69) ||
                  (weatherCode >= 80 && weatherCode <= 82) ||
                  (weatherCode >= 95 && weatherCode <= 99);

  if (hasRain) {
    console.log(`[洗车建议] 不宜洗车（有雨）：weatherCode ${weatherCode}`);
    return "不宜洗车（有雨）";
  }
  if (precipProb > 50) {
    console.log(`[洗车建议] 不宜洗车（降水概率高）：precipProb ${precipProb} > 50`);
    return "不宜洗车（降水概率高）";
  }
  if (weatherCode === 0 || weatherCode === 1) {
    console.log(`[洗车建议] 适宜洗车（晴天）：weatherCode=${weatherCode}`);
    return "适宜洗车（晴天）";
  }
  console.log(`[洗车建议] 可以洗车：weatherCode=${weatherCode}, precipProb=${precipProb}`);
  return "可以洗车";
}

// 晾晒建议
export function getDryingAdvice(weatherCode: number, humidity: number): string {
  console.log(`[晾晒建议] weatherCode=${weatherCode}, humidity=${humidity}`);

  // 判断是否有雨：包括降雨(60-69)、阵雨(80-82)、雷暴(95-99)
  const hasRain = (weatherCode >= 60 && weatherCode <= 69) ||
                  (weatherCode >= 80 && weatherCode <= 82) ||
                  (weatherCode >= 95 && weatherCode <= 99);

  if (hasRain) {
    console.log(`[晾晒建议] 不宜晾晒（有雨）：weatherCode ${weatherCode}`);
    return "不宜晾晒（有雨）";
  }
  if (humidity > 80) {
    console.log(`[晾晒建议] 不宜晾晒（湿度过高）：humidity ${humidity} > 80`);
    return "不宜晾晒（湿度过高）";
  }
  if (weatherCode === 0 || weatherCode === 1) {
    console.log(`[晾晒建议] 非常适宜晾晒：weatherCode=${weatherCode}`);
    return "非常适宜晾晒";
  }
  console.log(`[晾晒建议] 可以晾晒：weatherCode=${weatherCode}, humidity=${humidity}`);
  return "可以晾晒";
}

// Haversine 公式计算距离（台风距离计算）
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 数据验证（来自 weather-validator）
export function validateWeatherData(data: any): { valid: boolean; score: number; warnings: string[] } {
  const warnings: string[] = [];
  let score = 100;

  // 检查必需字段
  if (!data.location) {
    warnings.push("缺少位置信息");
    score -= 30;
  }
  if (!data.current) {
    warnings.push("缺少当前天气数据");
    score -= 30;
  }
  if (!data.forecast) {
    warnings.push("缺少预报数据");
    score -= 20;
  }

  // 检查数值范围
  if (data.current) {
    if (data.current.temperature < -50 || data.current.temperature > 50) {
      warnings.push("温度数据异常");
      score -= 10;
    }
    if (data.current.humidity < 0 || data.current.humidity > 100) {
      warnings.push("湿度数据异常");
      score -= 10;
    }
  }

  return {
    valid: score >= 50,
    score: Math.max(0, score),
    warnings,
  };
}

// 格式化日期
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

// 格式化时间
export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
