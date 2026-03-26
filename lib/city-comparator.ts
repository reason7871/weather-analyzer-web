/**
 * City Comparator
 * 城市对比功能 - 支持2-4个城市同时对比
 */

export interface CityComparisonData {
  name: string;
  province: string;
  current: {
    temperature: number;
    humidity: number;
    wind_speed: number;
    weather_code: number;
    weather_description: string;
  };
  forecast?: {
    temperature_max: number;
    temperature_min: number;
  };
  air_quality?: {
    aqi: number;
  };
  uv_index?: {
    max: number;
  };
}

export interface ComparisonResult {
  cities: CityComparisonData[];
  rankings: {
    temperature: Record<string, number>;
    humidity: Record<string, number>;
    wind: Record<string, number>;
    aqi?: Record<string, number>;
    uv?: Record<string, number>;
  };
  summary: {
    warmest: string;
    coldest: string;
    driest: string;
    most_humid: string;
    windiest: string;
    calmest: string;
    best_aqi?: string;
    lowest_uv?: string;
  };
}

// 计算排名
export function calculateRankings(cities: CityComparisonData[]) {
  const rankings = {
    temperature: {} as Record<string, number>,
    humidity: {} as Record<string, number>,
    wind: {} as Record<string, number>,
    aqi: {} as Record<string, number>,
    uv: {} as Record<string, number>,
  };

  // 温度排名（从高到低）
  rankings.temperature = cities
    .map((c) => ({ name: c.name, temp: c.current.temperature }))
    .sort((a, b) => b.temp - a.temp)
    .reduce((acc, c, i) => ({ ...acc, [c.name]: i + 1 }), {});

  // 湿度排名（从低到高，越干燥越好）
  rankings.humidity = cities
    .map((c) => ({ name: c.name, humidity: c.current.humidity }))
    .sort((a, b) => a.humidity - b.humidity)
    .reduce((acc, c, i) => ({ ...acc, [c.name]: i + 1 }), {});

  // 风速排名（从低到高，越平静越好）
  rankings.wind = cities
    .map((c) => ({ name: c.name, wind: c.current.wind_speed }))
    .sort((a, b) => a.wind - b.wind)
    .reduce((acc, c, i) => ({ ...acc, [c.name]: i + 1 }), {});

  // AQI 排名（从低到高，空气质量越好越好）
  const citiesWithAQI = cities.filter((c) => c.air_quality?.aqi);
  if (citiesWithAQI.length > 0) {
    rankings.aqi = citiesWithAQI
      .map((c) => ({ name: c.name, aqi: c.air_quality!.aqi }))
      .sort((a, b) => a.aqi - b.aqi)
      .reduce((acc, c, i) => ({ ...acc, [c.name]: i + 1 }), {});
  }

  // UV 排名（从低到高，UV越低越好）
  const citiesWithUV = cities.filter((c) => c.uv_index?.max);
  if (citiesWithUV.length > 0) {
    rankings.uv = citiesWithUV
      .map((c) => ({ name: c.name, uv: c.uv_index!.max }))
      .sort((a, b) => a.uv - b.uv)
      .reduce((acc, c, i) => ({ ...acc, [c.name]: i + 1 }), {});
  }

  return rankings;
}

// 计算汇总信息
export function calculateSummary(cities: CityComparisonData[]) {
  const summary = {
    warmest: cities.reduce((max, c) =>
      c.current.temperature > max.current.temperature ? c : max
    ).name,
    coldest: cities.reduce((min, c) =>
      c.current.temperature < min.current.temperature ? c : min
    ).name,
    driest: cities.reduce((min, c) =>
      c.current.humidity < min.current.humidity ? c : min
    ).name,
    most_humid: cities.reduce((max, c) =>
      c.current.humidity > max.current.humidity ? c : max
    ).name,
    windiest: cities.reduce((max, c) =>
      c.current.wind_speed > max.current.wind_speed ? c : max
    ).name,
    calmest: cities.reduce((min, c) =>
      c.current.wind_speed < min.current.wind_speed ? c : min
    ).name,
  };

  // 可选：添加空气质量最好的城市
  const citiesWithAQI = cities.filter((c) => c.air_quality?.aqi);
  if (citiesWithAQI.length > 0) {
    (summary as any).best_aqi = citiesWithAQI.reduce((best, c) =>
      c.air_quality!.aqi < best.air_quality!.aqi ? c : best
    ).name;
  }

  // 可选：添加UV最低的城市
  const citiesWithUV = cities.filter((c) => c.uv_index?.max);
  if (citiesWithUV.length > 0) {
    (summary as any).lowest_uv = citiesWithUV.reduce((lowest, c) =>
      c.uv_index!.max < lowest.uv_index!.max ? c : lowest
    ).name;
  }

  return summary;
}

// 主对比函数
export function compareCities(cities: CityComparisonData[]): ComparisonResult {
  if (cities.length < 2) {
    throw new Error("至少需要2个城市进行对比");
  }

  if (cities.length > 4) {
    throw new Error("最多只能对比4个城市");
  }

  return {
    cities,
    rankings: calculateRankings(cities),
    summary: calculateSummary(cities),
  };
}

// 获取排名徽章
export function getRankingBadge(rank: number): string {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `#${rank}`;
  }
}

// 获取对比建议
export function getComparisonAdvice(result: ComparisonResult): string[] {
  const advice: string[] = [];

  // 基于温度的建议
  if (result.summary.warmest !== result.summary.coldest) {
    const warmest = result.cities.find((c) => c.name === result.summary.warmest);
    const coldest = result.cities.find((c) => c.name === result.summary.coldest);

    if (warmest && coldest) {
      const tempDiff = warmest.current.temperature - coldest.current.temperature;
      if (tempDiff > 10) {
        advice.push(`${warmest.name} 比 ${coldest.name} 温差达 ${tempDiff}°C，注意携带适合的衣物`);
      }
    }
  }

  // 基于湿度的建议
  const driest = result.cities.find((c) => c.name === result.summary.driest);
  const mostHumid = result.cities.find((c) => c.name === result.summary.most_humid);

  if (driest && mostHumid) {
    const humidityDiff = mostHumid.current.humidity - driest.current.humidity;
    if (humidityDiff > 30) {
      advice.push(`${mostHumid.name} 湿度较高，${driest.name} 较干燥，注意补水`);
    }
  }

  // 基于空气质量的建议
  if (result.summary.best_aqi) {
    const best = result.cities.find((c) => c.name === result.summary.best_aqi);
    if (best && best.air_quality && best.air_quality.aqi < 50) {
      advice.push(`${best.name} 空气质量优，适合户外活动和运动`);
    }
  }

  // 基于UV的建议
  if (result.summary.lowest_uv) {
    const lowest = result.cities.find((c) => c.name === result.summary.lowest_uv);
    if (lowest && lowest.uv_index && lowest.uv_index.max < 3) {
      advice.push(`${lowest.name} 紫外线较弱，适合长时间户外活动`);
    }
  }

  return advice;
}

// 并行获取多个城市的数据
export async function fetchMultipleCitiesWeather(
  cityNames: string[]
): Promise<CityComparisonData[]> {
  const requests = cityNames.map(async (city) => {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error(`获取 ${city} 天气失败`);
    }
    const data = await response.json();

    return {
      name: data.location.name,
      province: data.location.province,
      current: {
        temperature: data.current.temperature,
        humidity: data.current.humidity,
        wind_speed: data.current.wind_speed,
        weather_code: data.current.weather_code,
        weather_description: data.current.weather_description,
      },
      forecast: data.forecast?.daily?.[0]
        ? {
            temperature_max: data.forecast.daily[0].temperature_max,
            temperature_min: data.forecast.daily[0].temperature_min,
          }
        : undefined,
      air_quality: data.air_quality,
      uv_index: data.uv_index
        ? { max: data.uv_index.max }
        : undefined,
    };
  });

  return Promise.all(requests);
}
