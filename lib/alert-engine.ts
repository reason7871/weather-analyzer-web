/**
 * Weather Alert Engine
 * 天气预警引擎 - 检测6种极端天气
 */

export interface WeatherAlert {
  type: string;
  level: "blue" | "yellow" | "orange" | "red";
  title: string;
  message: string;
  value: number;
  threshold: number;
  advice: string[];
}

export interface AlertCheckResult {
  hasAlerts: boolean;
  alerts: WeatherAlert[];
}

// 预警等级配置
const ALERT_LEVELS = {
  blue: { name: "蓝色预警", color: "#3B82F6", icon: "🔵" },
  yellow: { name: "黄色预警", color: "#EAB308", icon: "🟡" },
  orange: { name: "橙色预警", color: "#F97316", icon: "🟠" },
  red: { name: "红色预警", color: "#EF4444", icon: "🔴" },
};

// 检查极端高温
function checkExtremeHeat(temperature: number): WeatherAlert | null {
  if (temperature > 40) {
    return {
      type: "extreme_heat",
      level: "red",
      title: "极端高温预警",
      message: "气温超过40°C，极易发生中暑",
      value: temperature,
      threshold: 40,
      advice: [
        "避免在上午10点至下午4点外出",
        "必须外出时做好防护措施",
        "多喝水，补充电解质",
        "随身携带防暑药品",
        "老人、儿童、孕妇避免外出"
      ]
    };
  } else if (temperature > 35) {
    return {
      type: "extreme_heat",
      level: "orange",
      title: "高温预警",
      message: "气温超过35°C，容易发生中暑",
      value: temperature,
      threshold: 35,
      advice: [
        "尽量避免户外活动",
        "外出时做好防晒",
        "多喝水，避免脱水",
        "注意室内通风"
      ]
    };
  }
  return null;
}

// 检查极端低温
function checkExtremeCold(temperature: number): WeatherAlert | null {
  if (temperature < -10) {
    return {
      type: "extreme_cold",
      level: "red",
      title: "极端低温预警",
      message: "气温低于-10°C，有冻伤风险",
      value: temperature,
      threshold: -10,
      advice: [
        "尽量减少外出",
        "外出时穿戴保暖衣物",
        "保护暴露部位",
        "注意室内取暖安全"
      ]
    };
  } else if (temperature < 0) {
    return {
      type: "extreme_cold",
      level: "blue",
      title: "低温预警",
      message: "气温低于0°C，注意保暖",
      value: temperature,
      threshold: 0,
      advice: [
        "添加衣物保暖",
        "注意道路结冰",
        "室内注意取暖"
      ]
    };
  }
  return null;
}

// 检查强降水
function checkHeavyPrecipitation(probability: number, intensity?: number): WeatherAlert | null {
  if (probability > 80 || (intensity && intensity > 50)) {
    return {
      type: "heavy_precipitation",
      level: "red",
      title: "暴雨预警",
      message: "预计有暴雨，注意防范",
      value: probability,
      threshold: 80,
      advice: [
        "避免外出",
        "远离低洼地区",
        "注意城市内涝",
        "山区注意山洪和滑坡",
        "暂停户外作业"
      ]
    };
  } else if (probability > 50) {
    return {
      type: "heavy_precipitation",
      level: "yellow",
      title: "大雨预警",
      message: "预计有大雨，注意出行安全",
      value: probability,
      threshold: 50,
      advice: [
        "携带雨具",
        "注意交通安全",
        "避免在低洼地区停留"
      ]
    };
  }
  return null;
}

// 检查强风
function checkStrongWind(windSpeed: number): WeatherAlert | null {
  if (windSpeed > 50) { // 约180 km/h
    return {
      type: "strong_wind",
      level: "red",
      title: "台风级大风预警",
      message: "风速超过50 m/s，极其危险",
      value: windSpeed,
      threshold: 50,
      advice: [
        "必须留在室内",
        "远离门窗和广告牌",
        "储备食物和水",
        "准备应急照明",
        "关注政府和气象部门通知"
      ]
    };
  } else if (windSpeed > 30) { // 约108 km/h
    return {
      type: "strong_wind",
      level: "orange",
      title: "强风预警",
      message: "风速超过30 m/s，危险",
      value: windSpeed,
      threshold: 30,
      advice: [
        "避免外出",
        "固定门窗",
        "收起室外物品",
        "远离高大建筑物"
      ]
    };
  } else if (windSpeed > 17) { // 约61 km/h
    return {
      type: "strong_wind",
      level: "yellow",
      title: "大风预警",
      message: "风速超过17 m/s，注意安全",
      value: windSpeed,
      threshold: 17,
      advice: [
        "谨慎外出",
        "注意高空坠物",
        "水上活动停止"
      ]
    };
  }
  return null;
}

// 检查空气污染
function checkAirPollution(aqi?: number): WeatherAlert | null {
  if (!aqi) return null;

  if (aqi > 300) {
    return {
      type: "air_pollution",
      level: "red",
      title: "严重空气污染预警",
      message: "AQI超过300，空气质量极差",
      value: aqi,
      threshold: 300,
      advice: [
        "所有人避免户外活动",
        "关闭门窗",
        "使用空气净化器",
        "佩戴N95或更高级别口罩"
      ]
    };
  } else if (aqi > 200) {
    return {
      type: "air_pollution",
      level: "orange",
      title: "重度空气污染预警",
      message: "AQI超过200，空气质量差",
      value: aqi,
      threshold: 200,
      advice: [
        "避免户外活动",
        "敏感人群留在室内",
        "佩戴防护口罩"
      ]
    };
  } else if (aqi > 150) {
    return {
      type: "air_pollution",
      level: "yellow",
      title: "空气污染预警",
      message: "AQI超过150，空气质量不佳",
      value: aqi,
      threshold: 150,
      advice: [
        "减少户外活动",
        "敏感人群避免外出"
      ]
    };
  }
  return null;
}

// 检查强紫外线（添加天气代码参数，雨天不触发）
function checkHighUV(uvIndex?: number, weatherCode?: number): WeatherAlert | null {
  if (!uvIndex) return null;

  // 雨天、雪天、雷雨天不触发紫外线预警
  // WMO天气代码：51-67雨，71-77雪，95-99雷暴
  if (weatherCode && ((weatherCode >= 51 && weatherCode <= 67) ||
                       (weatherCode >= 71 && weatherCode <= 77) ||
                       (weatherCode >= 95 && weatherCode <= 99))) {
    return null;
  }

  if (uvIndex > 10) {
    return {
      type: "high_uv",
      level: "red",
      title: "极强紫外线预警",
      message: "UV指数超过10，极易晒伤",
      value: uvIndex,
      threshold: 10,
      advice: [
        "避免在上午10点至下午4点外出",
        "必须使用SPF 50+防晒霜",
        "佩戴太阳镜和遮阳帽",
        "穿着长袖衣物"
      ]
    };
  } else if (uvIndex > 7) {
    return {
      type: "high_uv",
      level: "orange",
      title: "强紫外线预警",
      message: "UV指数超过7，容易晒伤",
      value: uvIndex,
      threshold: 7,
      advice: [
        "避免正午外出",
        "使用SPF 30+防晒霜",
        "佩戴太阳镜"
      ]
    };
  } else if (uvIndex > 5) {
    return {
      type: "high_uv",
      level: "yellow",
      title: "紫外线预警",
      message: "UV指数超过5，需要注意防护",
      value: uvIndex,
      threshold: 5,
      advice: [
        "使用防晒霜",
        "佩戴太阳镜",
        "寻找阴凉处"
      ]
    };
  }
  return null;
}

// 主检查函数
export function checkWeatherAlerts(data: {
  current?: {
    temperature?: number;
    wind_speed?: number;
    weather_code?: number;
  };
  forecast?: {
    daily?: Array<{
      weather_code?: number;
      precipitation_probability_max?: number;
      uv_index_max?: number;
    }>;
  };
  air_quality?: {
    aqi?: number;
  };
}): AlertCheckResult {
  const alerts: WeatherAlert[] = [];

  // 检查当前天气
  if (data.current) {
    // 极端温度
    if (data.current.temperature !== undefined) {
      const heatAlert = checkExtremeHeat(data.current.temperature);
      if (heatAlert) alerts.push(heatAlert);

      const coldAlert = checkExtremeCold(data.current.temperature);
      if (coldAlert) alerts.push(coldAlert);
    }

    // 强风
    if (data.current.wind_speed !== undefined) {
      const windAlert = checkStrongWind(data.current.wind_speed);
      if (windAlert) alerts.push(windAlert);
    }
  }

  // 检查预报
  if (data.forecast?.daily && data.forecast.daily.length > 0) {
    const today = data.forecast.daily[0];

    // 强降水
    if (today.precipitation_probability_max !== undefined) {
      const precipAlert = checkHeavyPrecipitation(today.precipitation_probability_max);
      if (precipAlert) alerts.push(precipAlert);
    }

    // 强紫外线（传递天气代码，雨天不触发）
    if (today.uv_index_max !== undefined) {
      const uvAlert = checkHighUV(today.uv_index_max, today.weather_code);
      if (uvAlert) alerts.push(uvAlert);
    }
  }

  // 检查空气质量
  if (data.air_quality?.aqi !== undefined) {
    const pollutionAlert = checkAirPollution(data.air_quality.aqi);
    if (pollutionAlert) alerts.push(pollutionAlert);
  }

  // 按严重程度排序
  const levelOrder = { red: 0, orange: 1, yellow: 2, blue: 3 };
  alerts.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);

  return {
    hasAlerts: alerts.length > 0,
    alerts,
  };
}
