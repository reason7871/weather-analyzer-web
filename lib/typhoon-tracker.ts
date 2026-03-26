/**
 * Typhoon Tracker
 * 台风追踪功能 - 实时追踪台风位置、路径和影响
 */

export interface TyphoonData {
  id: string;
  name: string;
  internationalId: string;
  category: string;
  current: {
    latitude: number;
    longitude: number;
    time: string;
    pressure: number;
    windSpeed: number; // m/s
  };
  movement: {
    direction: string;
    directionDegrees: number;
    speed: number; // km/h
  };
  distanceToCity?: {
    km: number;
    direction: string;
  };
  forecast: TyphoonForecastPoint[];
}

export interface TyphoonForecastPoint {
  time: string;
  latitude: number;
  longitude: number;
  pressure: number;
  windSpeed: number;
}

export interface TyphoonWarning {
  level: "blue" | "yellow" | "orange" | "red";
  name: string;
  color: string;
  message: string;
  distanceThreshold: number;
}

// 台风等级分类
export function getTyphoonCategory(windSpeed: number): string {
  // 萨菲尔-辛普森飓风等级
  if (windSpeed >= 70) return "五级超强台风";
  if (windSpeed >= 58) return "四级超强台风";
  if (windSpeed >= 49) return "三级强台风";
  if (windSpeed >= 42) return "二级台风";
  if (windSpeed >= 33) return "一级台风";
  if (windSpeed >= 17) return "热带风暴";
  return "热带低压";
}

// 风向转换
export function getDirectionText(degrees: number): string {
  const directions = [
    "北", "北东北", "东北", "东北东",
    "东", "东南东", "东南", "东南南",
    "南", "南西南", "西南", "西南西",
    "西", "西北西", "西北", "西北北"
  ];
  const index = Math.round(degrees / 11.25) % 16;
  return directions[index];
}

// 计算两点间距离（Haversine 公式）
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

// 计算台风对城市的影响
export function assessTyphoonImpact(
  distance: number,
  typhoon: TyphoonData
): {
  level: string;
  probability: number;
  risk: "低" | "中等" | "高" | "极高";
  estimatedImpactTime?: string;
} {
  const { windSpeed, movement } = typhoon.current;
  const speed = movement.speed;

  // 计算预计到达时间
  const hoursToImpact = distance / (speed || 15); // 默认移动速度 15 km/h
  let estimatedImpactTime = "";

  if (hoursToImpact < 24) {
    estimatedImpactTime = `${Math.round(hoursToImpact)}小时后`;
  } else if (hoursToImpact < 48) {
    estimatedImpactTime = "约24小时后";
  } else if (hoursToImpact < 72) {
    estimatedImpactTime = "约48小时后";
  } else {
    estimatedImpactTime = "72小时后";
  }

  // 评估风险等级
  if (distance < 100 && windSpeed > 50) {
    return {
      level: "极高风险",
      probability: 95,
      risk: "极高",
      estimatedImpactTime,
    };
  } else if (distance < 200 && windSpeed > 33) {
    return {
      level: "高风险",
      probability: 80,
      risk: "高",
      estimatedImpactTime,
    };
  } else if (distance < 500) {
    return {
      level: "中等风险",
      probability: 50,
      risk: "中等",
      estimatedImpactTime,
    };
  } else {
    return {
      level: "低风险",
      probability: 20,
      risk: "低",
    };
  }
}

// 生成台风预警
export function generateTyphoonWarning(
  distance: number,
  typhoon: TyphoonData
): TyphoonWarning | null {
  const { windSpeed } = typhoon.current;

  if (distance < 100 && windSpeed > 50) {
    return {
      level: "red",
      name: "红色预警",
      color: "#EF4444",
      message: "6小时内将受台风严重袭击，紧急避险",
      distanceThreshold: 100,
    };
  } else if (distance < 200 && windSpeed > 33) {
    return {
      level: "orange",
      name: "橙色预警",
      color: "#F97316",
      message: "12小时内将受台风严重影响，停止户外活动",
      distanceThreshold: 200,
    };
  } else if (distance < 300 && windSpeed > 24) {
    return {
      level: "yellow",
      name: "黄色预警",
      color: "#EAB308",
      message: "24小时内将受台风影响，做好防风准备",
      distanceThreshold: 300,
    };
  } else if (distance < 500) {
    return {
      level: "blue",
      name: "蓝色预警",
      color: "#3B82F6",
      message: "24小时内可能受台风影响，请注意防范",
      distanceThreshold: 500,
    };
  }

  return null;
}

// 计算台风到城市的方向
export function getBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.cos(dLon);
  const brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

// 获取防护建议
export function getProtectionAdvice(warningLevel: string): string[] {
  const adviceMap: Record<string, string[]> = {
    red: [
      "立即停止所有户外活动",
      "留在室内，远离门窗",
      "储备至少3天的食物和水",
      "准备应急照明设备",
      "关注政府和气象部门最新通知",
      "如遇危险，立即拨打求救电话",
    ],
    orange: [
      "停止户外作业和集会",
      "固定门窗和室外物品",
      "检查排水系统",
      "准备应急物资",
      "避免靠近海边和河边",
    ],
    yellow: [
      "避免不必要的出行",
      "检查门窗是否牢固",
      "清理阳台和屋顶杂物",
      "了解避难所位置",
      "准备手电筒和收音机",
      "避免海上活动",
    ],
    blue: [
      "关注台风动态",
      "检查房屋安全",
      "准备手电筒和收音机",
      "避免海上活动",
      "了解撤离路线",
    ],
  };

  return adviceMap[warningLevel] || [];
}

// 格式化台风信息用于显示
export function formatTyphoonInfo(typhoon: TyphoonData): {
  title: string;
  details: string[];
  warnings: string[];
} {
  const category = getTyphoonCategory(typhoon.current.windSpeed);
  const direction = getDirectionText(typhoon.movement.directionDegrees);

  const details = [
    `🌀 台风: ${typhoon.name} (${typhoon.internationalId})`,
    `📊 等级: ${category}`,
    `📍 位置: ${typhoon.current.latitude.toFixed(1)}°N, ${typhoon.current.longitude.toFixed(1)}°E`,
    `💨 风速: ${typhoon.current.windSpeed} m/s (${(typhoon.current.windSpeed * 3.6).toFixed(1)} km/h)`,
    `🔽 气压: ${typhoon.current.pressure} hPa`,
    `➡️ 移动: ${direction} ${typhoon.movement.speed} km/h`,
  ];

  if (typhoon.distanceToCity) {
    const { km, direction: dir } = typhoon.distanceToCity;
    details.push(
      `🏙️ 距离: ${km.toFixed(0)} km (${dir}方向)`
    );
  }

  const impact = assessTyphoonImpact(
    typhoon.distanceToCity?.km || 0,
    typhoon
  );
  details.push(
    `⚠️ 风险: ${impact.level} (${impact.risk})`
  );

  if (impact.estimatedImpactTime) {
    details.push(`⏰ 预计影响: ${impact.estimatedImpactTime}`);
  }

  const warning = generateTyphoonWarning(
    typhoon.distanceToCity?.km || 0,
    typhoon
  );

  const warnings = warning
    ? [
        `${warning.icon} ${warning.name}`,
        warning.message,
        ...getProtectionAdvice(warning.level),
      ]
    : [];

  return {
    title: `${typhoon.name} - ${category}`,
    details,
    warnings,
  };
}

// 从 API 获取台风数据（模拟）
// 实际应用中应该从真实的台风 API 获取数据
export async function fetchActiveTyphoons(): Promise<TyphoonData[]> {
  // 这里应该调用真实的台风 API
  // 例如: https://agora.ex.nii.ac.jp/digital-typhoon/typhoon/list/today.json

  // 目前返回示例数据
  return [
    {
      id: "202625",
      name: "蒲公英",
      internationalId: "2625",
      category: "强台风",
      current: {
        latitude: 22.5,
        longitude: 118.5,
        time: new Date().toISOString(),
        pressure: 965,
        windSpeed: 45,
      },
      movement: {
        direction: "西北",
        directionDegrees: 315,
        speed: 15,
      },
      forecast: [
        {
          time: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
          latitude: 22.8,
          longitude: 118.8,
          pressure: 960,
          windSpeed: 47,
        },
        {
          time: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
          latitude: 23.2,
          longitude: 119.2,
          pressure: 955,
          windSpeed: 50,
        },
      ],
    },
  ];
}

// 检查城市是否受台风影响
export async function checkTyphoonImpactForCity(
  cityName: string,
  latitude: number,
  longitude: number
): Promise<{
  hasTyphoon: boolean;
  typhoons: Array<{
    data: TyphoonData;
    distance: number;
    impact: ReturnType<typeof assessTyphoonImpact>;
    warning: ReturnType<typeof generateTyphoonWarning>;
  }>;
}> {
  const typhoons = await fetchActiveTyphoons();

  const affectedTyphoons = typhoons
    .map((typhoon) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        typhoon.current.latitude,
        typhoon.current.longitude
      );

      return {
        data: typhoon,
        distance,
        impact: assessTyphoonImpact(distance, typhoon),
        warning: generateTyphoonWarning(distance, typhoon),
      };
    })
    .filter((t) => t.distance < 1000); // 只返回1000km内的台风

  return {
    hasTyphoon: affectedTyphoons.length > 0,
    typhoons: affectedTyphoons,
  };
}
