import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { error: "请提供城市名称" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Geocoding - Get coordinates
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("地理编码失败");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json(
        { error: "未找到该城市，请检查城市名称" },
        { status: 404 }
      );
    }

    const location = geoData.results[0];
    const { latitude, longitude, name, admin1 } = location;

    // Step 2: Get current weather and forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=auto&forecast_days=7`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("天气数据获取失败");
    }

    const weatherData = await weatherResponse.json();

    // Step 3: Parse and format response
    const weatherCodeMap: { [key: number]: string } = {
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

    const response = {
      location: {
        name: name,
        province: admin1 || "",
        latitude: latitude,
        longitude: longitude,
      },
      current: {
        temperature: Math.round(weatherData.current.temperature_2m),
        apparent_temperature: Math.round(weatherData.current.apparent_temperature),
        weather_code: weatherData.current.weather_code,
        weather_description: weatherCodeMap[weatherData.current.weather_code] || "未知",
        humidity: weatherData.current.relative_humidity_2m,
        pressure: Math.round(weatherData.current.pressure_msl),
        wind_speed: Math.round(weatherData.current.wind_speed_10m),
        wind_direction: weatherData.current.wind_direction_10m,
        visibility: 10000, // Open-Meteo doesn't provide this in free tier
      },
      forecast: {
        daily: weatherData.daily.time.map((date: string, index: number) => ({
          date: date,
          weather_code: weatherData.daily.weather_code[index],
          weather_description: weatherCodeMap[weatherData.daily.weather_code[index]] || "未知",
          temperature_max: Math.round(weatherData.daily.temperature_2m_max[index]),
          temperature_min: Math.round(weatherData.daily.temperature_2m_min[index]),
          precipitation_probability: weatherData.daily.precipitation_probability_max[index],
          uv_index_max: Math.round(weatherData.daily.uv_index_max[index]),
        })),
      },
      cache_status: {
        current: "miss",
        forecast: "miss",
      },
    };

    // Add CORS headers
    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600", // 30 minutes
      },
    });
  } catch (error: any) {
    console.error("Weather API Error:", error);
    return NextResponse.json(
      { error: error.message || "获取天气数据失败" },
      { status: 500 }
    );
  }
}
