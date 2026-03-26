"use client";

import { useState, useEffect } from "react";
import {
  Cloud,
  Search,
  MapPin,
  Wind,
  Droplets,
  Gauge,
  Sun,
  AlertTriangle,
  Star,
  StarOff,
  Heart,
  Navigation,
  TrendingUp,
  Eye,
} from "lucide-react";
import { checkWeatherAlerts } from "@/lib/alert-engine";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "@/lib/favorites-manager";
import { compareCities } from "@/lib/city-comparator";
import { checkTyphoonImpactForCity } from "@/lib/typhoon-tracker";

export default function Home() {
  const [city, setCity] = useState("福州");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isFav, setIsFav] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareCities, setCompareCities] = useState<string[]>([]);
  const [showTyphoon, setShowTyphoon] = useState(false);
  const [typhoonData, setTyphoonData] = useState<any>(null);

  // 检查是否收藏
  useEffect(() => {
    if (weather?.location) {
      setIsFav(
        isFavorite(
          weather.location.name,
          weather.location.latitude,
          weather.location.longitude
        )
      );
    }
  }, [weather]);

  // 搜索天气
  const searchWeather = async (searchCity?: string) => {
    const cityToSearch = searchCity || city;
    setLoading(true);
    setError("");
    setAlerts([]);
    setTyphoonData(null);

    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(cityToSearch)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "获取天气数据失败");
      }

      setWeather(data);

      // 检查天气预警
      const alertResult = checkWeatherAlerts(data);
      if (alertResult.hasAlerts) {
        setAlerts(alertResult.alerts);
      }

      // 检查台风影响
      const typhoonResult = await checkTyphoonImpactForCity(
        data.location.name,
        data.location.latitude,
        data.location.longitude
      );
      if (typhoonResult.hasTyphoon) {
        setTyphoonData(typhoonResult);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 切换收藏
  const toggleFavorite = () => {
    if (!weather?.location) return;

    if (isFav) {
      const cityId = `${weather.location.name}-${weather.location.latitude}-${weather.location.longitude}`.replace(
        /\s+/g,
        "-"
      );
      removeFavorite(cityId);
      setIsFav(false);
    } else {
      addFavorite({
        name: weather.location.name,
        province: weather.location.province,
        country: "中国",
        latitude: weather.location.latitude,
        longitude: weather.location.longitude,
      });
      setIsFav(true);
    }
  };

  // 添加对比城市
  const addToCompare = () => {
    if (!weather?.location) return;
    if (compareCities.includes(weather.location.name)) return;
    if (compareCities.length >= 4) {
      setError("最多只能对比4个城市");
      return;
    }
    setCompareCities([...compareCities, weather.location.name]);
    setShowCompare(true);
  };

  // 移除对比城市
  const removeCompareCity = (cityName: string) => {
    setCompareCities(compareCities.filter((c) => c !== cityName));
    if (compareCities.length <= 1) {
      setShowCompare(false);
    }
  };

  // 初始加载
  useEffect(() => {
    searchWeather();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
            <Cloud className="w-10 h-10 text-blue-500" />
            Weather Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            实时天气查询、预报、预警、台风追踪和城市对比
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchWeather()}
                placeholder="输入城市名称（如：福州、北京、上海）"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={() => searchWeather()}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
            >
              <Search className="w-5 h-5" />
              {loading ? "查询中..." : "查询"}
            </button>
          </div>

          {/* Quick Actions */}
          {weather && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={toggleFavorite}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isFav ? (
                  <>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    已收藏
                  </>
                ) : (
                  <>
                    <StarOff className="w-4 h-4" />
                    收藏
                  </>
                )}
              </button>
              <button
                onClick={addToCompare}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                加入对比
              </button>
              <button
                onClick={() => setShowTyphoon(!showTyphoon)}
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                台风追踪
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              天气预警 ({alerts.length})
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="border-l-4 pl-4"
                  style={{ borderColor: ALERT_LEVELS[alert.level].color }}
                >
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {ALERT_LEVELS[alert.level].icon} {alert.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {alert.message}
                  </div>
                  <div className="mt-2">
                    <strong className="text-sm">建议：</strong>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                      {alert.advice.map((advice: string, i: number) => (
                        <li key={i}>{advice}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Typhoon Alert */}
        {showTyphoon && typhoonData?.hasTyphoon && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              台风预警 🌀
            </h3>
            <div className="space-y-3">
              {typhoonData.typhoons.map((typhoon: any, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                    {typhoon.data.name} - {typhoon.data.category}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <strong>距离:</strong> {typhoon.distance.toFixed(0)} km
                    </div>
                    <div>
                      <strong>风险:</strong> {typhoon.impact.level}
                    </div>
                    <div>
                      <strong>风速:</strong> {typhoon.data.current.windSpeed} m/s
                    </div>
                    <div>
                      <strong>移动:</strong> {typhoon.data.movement.direction}{" "}
                      {typhoon.data.movement.speed} km/h
                    </div>
                  </div>
                  {typhoon.warning && (
                    <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <strong>{typhoon.warning.name}:</strong>{" "}
                      {typhoon.warning.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weather Display */}
        {weather && weather.current && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            {/* Current Weather */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {weather.location.name}, {weather.location.province}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="text-7xl font-bold text-blue-600 dark:text-blue-400">
                  {weather.current.temperature}°C
                </div>
                <div className="text-left">
                  <div className="text-xl text-gray-700 dark:text-gray-300">
                    {weather.current.weather_description}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    体感 {weather.current.apparent_temperature}°C
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <Wind className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">风速</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {weather.current.wind_speed} km/h
                </div>
              </div>
              <div className="bg-green-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <Droplets className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">湿度</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {weather.current.humidity}%
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <Gauge className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">气压</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {weather.current.pressure} hPa
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <Eye className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">能见度</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {(weather.current.visibility / 1000).toFixed(1)} km
                </div>
              </div>
            </div>

            {/* Forecast */}
            {weather.forecast && weather.forecast.daily && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  未来天气预报
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {weather.forecast.daily.slice(0, 3).map(
                    (day: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      >
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {new Date(day.date).toLocaleDateString("zh-CN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-2xl mb-2">
                          {day.weather_code >= 60
                            ? "🌧️"
                            : day.weather_code >= 40
                            ? "☁️"
                            : "⛅"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {day.weather_description}
                        </div>
                        <div className="text-lg font-semibold text-gray-800 dark:text-white">
                          {day.temperature_max}° / {day.temperature_min}°
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* City Comparison */}
        {showCompare && compareCities.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              城市对比 ({compareCities.length}/4)
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {compareCities.map((city) => (
                <span
                  key={city}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm flex items-center gap-2"
                >
                  {city}
                  <button
                    onClick={() => removeCompareCity(city)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              对比功能即将推出，敬请期待！
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-4">
          <p>
            Powered by Open-Meteo API | Data updated every 15 minutes |{" "}
            <a
              href="https://github.com"
              className="text-blue-500 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

// Alert levels configuration
const ALERT_LEVELS: Record<
  string,
  { name: string; color: string; icon: string }
> = {
  red: { name: "红色预警", color: "#EF4444", icon: "🔴" },
  orange: { name: "橙色预警", color: "#F97316", icon: "🟠" },
  yellow: { name: "黄色预警", color: "#EAB308", icon: "🟡" },
  blue: { name: "蓝色预警", color: "#3B82F6", icon: "🔵" },
};
