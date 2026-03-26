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
  Navigation,
  TrendingUp,
  Eye,
  Loader2,
  Sparkles,
  Activity,
  Calendar,
  X,
} from "lucide-react";
import { checkWeatherAlerts } from "@/lib/alert-engine";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from "@/lib/favorites-manager";
import { checkTyphoonImpactForCity } from "@/lib/typhoon-tracker";
import {
  getClothingAdvice,
  getExerciseAdvice,
  getCarWashAdvice,
  getDryingAdvice,
} from "@/lib/weather-utils";

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-3 mb-4 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <Cloud className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Weather Analyzer
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            实时天气 · 智能预警 · 台风追踪 · 城市对比
            <span className="ml-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full font-semibold text-blue-700 dark:text-blue-300">
              v2.0
            </span>
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchWeather()}
                placeholder="搜索城市（如：福州、北京、上海）"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
              />
            </div>
            <button
              onClick={() => searchWeather()}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:shadow-md font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  查询中...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  查询天气
                </>
              )}
            </button>
          </div>

          {/* Quick Actions */}
          {weather && !loading && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={toggleFavorite}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center gap-2 hover:from-yellow-100 hover:to-orange-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all"
              >
                {isFav ? (
                  <>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">已收藏</span>
                  </>
                ) : (
                  <>
                    <StarOff className="w-4 h-4" />
                    <span className="text-sm">收藏</span>
                  </>
                )}
              </button>
              <button
                onClick={addToCompare}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center gap-2 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all"
              >
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm">对比</span>
              </button>
              <button
                onClick={() => setShowTyphoon(!showTyphoon)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center gap-2 hover:from-purple-100 hover:to-pink-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all"
              >
                <Navigation className="w-4 h-4 text-purple-500" />
                <span className="text-sm">台风</span>
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 animate-slide-down">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="flex-shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 mb-6 animate-slide-down">
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              天气预警 ({alerts.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border-l-4 shadow-sm"
                  style={{ borderColor: ALERT_LEVELS[alert.level].color }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      {ALERT_LEVELS[alert.level].icon}
                      {alert.title}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: ALERT_LEVELS[alert.level].color,
                        color: "white",
                      }}
                    >
                      {ALERT_LEVELS[alert.level].name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {alert.message}
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">防护建议：</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {alert.advice.map((advice: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{advice}</span>
                        </li>
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
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-5 mb-6 animate-slide-down">
            <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              台风预警 🌀
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {typhoonData.typhoons.map((typhoon: any, index: number) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-purple-200 dark:border-purple-700 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                        {typhoon.data.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {typhoon.data.category}
                      </p>
                    </div>
                    <div className="text-3xl">🌀</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400">距离</div>
                      <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                        {typhoon.distance.toFixed(0)} km
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400">风险</div>
                      <div className="text-lg font-bold text-red-700 dark:text-red-300">
                        {typhoon.impact.risk}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">风速</div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        {typhoon.data.current.windSpeed} m/s
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">移动</div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        {typhoon.data.movement.direction} {typhoon.data.movement.speed} km/h
                      </div>
                    </div>
                  </div>

                  {typhoon.warning && (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 border-l-4" style={{ borderColor: typhoon.warning.color }}>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {typhoon.warning.icon} {typhoon.warning.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {typhoon.warning.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Current Weather */}
          <div className="lg:col-span-2">
            {weather && weather.current && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6 animate-fade-in">
                {/* Weather Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {weather.location.name}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {weather.location.province}
                      </p>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={toggleFavorite}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        {isFav ? (
                          <Star className="w-6 h-6 text-yellow-300 fill-current" />
                        ) : (
                          <StarOff className="w-6 h-6 text-white/80" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weather Card Body */}
                <div className="p-6">
                  {/* Current Temperature */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                        {weather.current.temperature}°C
                      </div>
                      <div className="text-4xl">🌡️</div>
                    </div>
                    <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
                      {weather.current.weather_description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      体感 {weather.current.apparent_temperature}°C
                    </p>
                  </div>

                  {/* Weather Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl p-4 text-center">
                      <Wind className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">风速</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {weather.current.wind_speed}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">km/h</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-xl p-4 text-center">
                      <Droplets className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">湿度</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {weather.current.humidity}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">%</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl p-4 text-center">
                      <Gauge className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">气压</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {weather.current.pressure}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">hPa</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/30 dark:to-orange-800/20 rounded-xl p-4 text-center">
                      <Eye className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">能见度</div>
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {(weather.current.visibility / 1000).toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">km</div>
                    </div>
                  </div>

                  {/* Forecast */}
                  {weather.forecast && weather.forecast.daily && (
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        未来7天天气预报
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                        {weather.forecast.daily.map(
                          (day: any, index: number) => (
                            <div
                              key={index}
                              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center hover:shadow-md transition-shadow"
                            >
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                {new Date(day.date).toLocaleDateString("zh-CN", {
                                  month: "short",
                                  day: "numeric",
                                  weekday: "short",
                                })}
                              </div>
                              <div className="text-3xl mb-2">
                                {day.weather_code >= 60
                                  ? "🌧️"
                                  : day.weather_code >= 40
                                  ? "☁️"
                                  : "⛅"}
                              </div>
                              <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                {day.weather_description}
                              </div>
                              <div className="text-sm font-bold text-gray-800 dark:text-white">
                                {day.temperature_max}° / {day.temperature_min}°
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Lifestyle Advice 生活建议 */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-500" />
                      生活建议
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">👕</span>
                          <div className="text-sm font-semibold text-gray-800 dark:text-white">穿衣建议</div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {getClothingAdvice(weather.current.temperature, weather.current.weather_description)}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🏃</span>
                          <div className="text-sm font-semibold text-gray-800 dark:text-white">运动建议</div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {getExerciseAdvice(weather.current.weather_description, weather.current.temperature)}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🚗</span>
                          <div className="text-sm font-semibold text-gray-800 dark:text-white">洗车建议</div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {getCarWashAdvice(weather.current.weather_code, weather.forecast?.daily?.[0]?.precipitation_probability || 0)}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">👕</span>
                          <div className="text-sm font-semibold text-gray-800 dark:text-white">晾晒建议</div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {getDryingAdvice(weather.current.weather_code, weather.current.humidity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Info */}
          <div className="lg:col-span-1">
            {/* Quick Actions Card */}
            {weather && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 mb-6">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  快捷操作
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => searchWeather(city)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    刷新数据
                  </button>
                  <button
                    onClick={toggleFavorite}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all flex items-center justify-center gap-2"
                  >
                    {isFav ? (
                      <>
                        <Star className="w-4 h-4" />
                        已收藏
                      </>
                    ) : (
                      <>
                        <StarOff className="w-4 h-4" />
                        添加收藏
                      </>
                    )}
                  </button>
                  <button
                    onClick={addToCompare}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    加入对比
                  </button>
                  <button
                    onClick={() => setShowTyphoon(!showTyphoon)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    台风追踪
                  </button>
                </div>
              </div>
            )}

            {/* City Comparison */}
            {showCompare && compareCities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 mb-6 animate-fade-in">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  城市对比 ({compareCities.length}/4)
                </h3>
                <div className="space-y-2 mb-4">
                  {compareCities.map((city) => (
                    <div
                      key={city}
                      className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {city}
                      </span>
                      <button
                        onClick={() => removeCompareCity(city)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  完整对比功能即将推出
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-8">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>Powered by Open-Meteo API</span>
            <span>•</span>
            <span>Data updated every 15 minutes</span>
            <span>•</span>
            <a
              href="https://github.com/reason7871/weather-analyzer-web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub
            </a>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Made with ❤️ using Next.js, TypeScript, and Vercel
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
