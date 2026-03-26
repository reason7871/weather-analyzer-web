# 🌤️ Weather Analyzer Web - 完整功能指南

## ✨ 核心特性

### 已完成功能 ✅

| 功能 | 状态 | 说明 |
|------|------|------|
| **实时天气查询** | ✅ | 支持3000+城市，中文/拼音/坐标搜索 |
| **天气预报** | ✅ | 3天精准预报，含温度、降水、UV指数 |
| **天气预警系统** | ✅ | 6种预警类型：高温、低温、强降水、强风、空气污染、强紫外线 |
| **城市对比** | ✅ | 支持2-4个城市同时对比 |
| **收藏管理** | ✅ | 本地存储收藏城市，支持默认城市设置 |
| **台风追踪** | ✅ | 实时追踪台风位置、路径预报、影响评估、四级预警 |
| **响应式设计** | ✅ | 完美适配手机、平板、电脑 |
| **深色模式** | ✅ | 自动适配系统主题 |
| **离线支持** | ✅ | 收藏数据本地存储 |

### 技术栈

- **前端**: Next.js 14 (App Router) + React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **API**: Open-Meteo (免费，无需 API Key)
- **部署**: Vercel (一键部署)

---

## 🚀 快速开始

### 1. 本地开发

```bash
# 进入项目目录
cd E:\claude_itme\weather-analyzer-web

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:3000
```

### 2. 部署到 Vercel

```bash
# 方法 1: 通过 Vercel Dashboard（推荐）
# 1. 推送代码到 GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/weather-analyzer-web.git
git push -u origin main

# 2. 在 Vercel 导入项目
# 访问 https://vercel.com/dashboard
# 点击 "Add New Project" → 选择你的仓库 → 点击 "Deploy"

# 方法 2: 通过 Vercel CLI
npm i -g vercel
vercel login
cd E:\claude_itme\weather-analyzer-web
vercel
```

---

## 📖 功能详解

### 1. 天气预警系统 ⚠️

#### 支持的预警类型

| 预警类型 | 触发条件 | 预警等级 |
|---------|---------|----------|
| **极端高温** | 温度 > 35°C | 橙色/红色 |
| **极端低温** | 温度 < 0°C | 蓝色/红色 |
| **强降水** | 降水概率 > 50% | 黄色/红色 |
| **强风** | 风速 > 17 m/s | 黄色/橙色/红色 |
| **空气污染** | AQI > 150 | 黄色/橙色/红色 |
| **强紫外线** | UV > 5 | 黄色/橙色/红色 |

#### 四级预警系统

```
🔵 蓝色预警 - 一般
├─ 距离 < 500km (台风)
├─ 温度 < 0°C (低温)
└─ 建议: 注意防范

🟡 黄色预警 - 重要
├─ 距离 < 300km 且风速 > 24m/s (台风)
├─ 降水概率 > 50%
├─ AQI > 150
└─ 建议: 做好准备

🟠 橙色预警 - 严重
├─ 距离 < 200km 且风速 > 33m/s (台风)
├─ 温度 > 35°C (高温)
├─ 风速 > 30 m/s
└─ 建议: 停止户外活动

🔴 红色预警 - 紧急
├─ 距离 < 100km 且风速 > 50m/s (台风)
├─ 温度 > 40°C (极端高温)
├─ 温度 < -10°C (极端低温)
└─ 建议: 紧急避险
```

### 2. 台风追踪系统 🌀

#### 核心功能

- **实时追踪**: 获取当前活跃台风位置和强度
- **路径预报**: 显示未来 3-5 天预测路径
- **距离计算**: 使用 Haversine 公式精确计算台风与城市的距离
- **影响评估**: 4级评估（低、中等、高、极高）
- **四级预警**: 蓝、黄、橙、红预警系统
- **防护建议**: 针对不同预警等级的具体防护措施

#### 台风等级分类

| 等级 | 风速 (m/s) | 风速 (km/h) | 名称 |
|------|-----------|------------|------|
| 0 | < 17 | < 61 | 热带低压 |
| 1 | 17-24 | 61-86 | 热带风暴 |
| 2 | 24-33 | 86-118 | 强热带风暴 |
| 3 | 33-42 | 118-151 | 一级台风 |
| 4 | 42-49 | 151-176 | 二级台风 |
| 5 | 49-58 | 176-208 | 三级强台风 |
| 6 | 58-70 | 208-252 | 四级超强台风 |
| 7 | > 70 | > 252 | 五级超强台风 |

### 3. 城市对比功能 📊

#### 功能特点

- 支持 2-4 个城市同时对比
- 多维度对比：温度、湿度、风速、AQI、UV
- 自动排名和汇总
- 排名徽章显示（🥇🥈🥉）
- 对比建议生成

#### 对比维度

| 维度 | 说明 | 排名方式 |
|------|------|----------|
| **温度** | 当前气温 | 从高到低 |
| **湿度** | 相对湿度 | 从低到高（越干燥越好） |
| **风速** | 风速大小 | 从低到高（越平静越好） |
| **AQI** | 空气质量指数 | 从低到高（空气质量越好越好） |
| **UV** | 紫外线指数 | 从低到高（UV越低越好） |

### 4. 收藏管理功能 ⭐

#### 功能特点

- 本地存储（LocalStorage）
- 支持添加/删除收藏
- 设置默认城市
- 收藏列表排序
- 导入/导出收藏数据

#### 收藏功能

```typescript
// 添加收藏
addFavorite({
  name: "福州",
  province: "福建省",
  country: "中国",
  latitude: 26.0745,
  longitude: 119.2965
})

// 删除收藏
removeFavorite(cityId)

// 设置默认城市
setDefaultCity(cityId)

// 获取所有收藏
getFavoritesList()

// 检查是否已收藏
isFavorite(name, latitude, longitude)
```

### 5. 实用工具 🛠️

#### 天气工具函数

| 函数 | 说明 |
|------|------|
| `getWeatherDescription(code)` | 获取天气描述 |
| `getWeatherIcon(code)` | 获取天气图标 |
| `getWindDirection(degrees)` | 风向转换 |
| `getUVLevel(uv)` | UV 等级评估 |
| `getAQILevel(aqi)` | AQI 等级评估 |
| `getComfortIndex(temp, humidity, wind)` | 舒适度指数 |
| `getClothingAdvice(temp, weather)` | 穿衣建议 |
| `getExerciseAdvice(weather, temp, aqi)` | 运动建议 |
| `getCarWashAdvice(code, precip)` | 洗车建议 |
| `getDryingAdvice(code, humidity)` | 晾晒建议 |

---

## 📁 项目结构

```
weather-analyzer-web/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── weather/              # 天气 API 端点
│   │       └── route.ts          # GET /api/weather?city={city}
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 主页（增强版）
│   └── globals.css               # 全局样式
├── lib/                          # 核心工具库
│   ├── weather-utils.ts          # 天气工具函数
│   ├── alert-engine.ts           # 预警引擎
│   ├── favorites-manager.ts      # 收藏管理
│   ├── city-comparator.ts        # 城市对比
│   └── typhoon-tracker.ts        # 台风追踪
├── components/                   # React 组件
├── public/                       # 静态资源
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── next.config.mjs               # Next.js 配置
└── vercel.json                   # Vercel 部署配置
```

---

## 🌐 API 端点

### GET /api/weather?city={city}

查询指定城市的天气数据

**参数**:
- `city`: 城市名称（中文/拼音）或坐标

**示例**:
```
GET /api/weather?city=福州
GET /api/weather?city=beijing
GET /api/weather?city=26.0745,119.2965
```

**响应**:
```json
{
  "location": {
    "name": "福州",
    "province": "福建省",
    "latitude": 26.0745,
    "longitude": 119.2965
  },
  "current": {
    "temperature": 18.9,
    "apparent_temperature": 17.8,
    "weather_description": "阴天",
    "humidity": 57,
    "pressure": 1016.4,
    "wind_speed": 7.8,
    "visibility": 10000
  },
  "forecast": {
    "daily": [...]
  },
  "alerts": [...],        // 天气预警（可选）
  "typhoons": [...]       // 台风数据（可选）
}
```

---

## 🎨 UI 设计

### 颜色方案

```css
/* 主色调 */
--primary-blue: #3B82F6      /* 主按钮、链接 */
--bg-gradient: from-blue-50 to-indigo-100  /* 背景渐变 */

/* 预警等级色 */
--alert-red: #EF4444         /* 红色预警 */
--alert-orange: #F97316      /* 橙色预警 */
--alert-yellow: #EAB308      /* 黄色预警 */
--alert-blue: #3B82F6        /* 蓝色预警 */

/* 功能模块色 */
--weather-blue: #3B82F6      /* 天气 */
--wind-green: #22C55E        /* 风速 */
--humidity-green: #22C55E    /* 湿度 */
--pressure-purple: #A855F7   /* 气压 */
--uv-yellow: #EAB308         /* 紫外线 */
--typhoon-purple: #A855F7    /* 台风 */
```

### 响应式断点

```css
/* 移动端 */
@media (max-width: 768px)

/* 平板 */
@media (min-width: 769px) and (max-width: 1024px)

/* 桌面 */
@media (min-width: 1025px)
```

---

## 🔧 开发指南

### 添加新功能

1. **创建新的工具函数**

```typescript
// lib/my-feature.ts
export function myFeatureFunction(data: any) {
  // 实现逻辑
  return result;
}
```

2. **在页面中使用**

```typescript
// app/page.tsx
import { myFeatureFunction } from "@/lib/my-feature";

// 在组件中使用
const result = myFeatureFunction(weatherData);
```

3. **添加样式**

```tsx
<div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
  {/* 内容 */}
</div>
```

### 添加新的 API 端点

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 实现逻辑
  return NextResponse.json({ data: "result" });
}
```

---

## 📊 性能优化

### 已实施的优化

- ✅ Next.js 服务端渲染（SSR）
- ✅ Vercel Edge Network
- ✅ 30 分钟 HTTP 缓存
- ✅ 响应式图片优化
- ✅ 代码分割
- ✅ 本地存储（减少 API 调用）

### 缓存策略

| 数据类型 | TTL | 缓存位置 |
|---------|-----|----------|
| 当前天气 | 30 分钟 | HTTP Cache |
| 天气预报 | 2 小时 | HTTP Cache |
| 收藏城市 | 永久 | LocalStorage |
| 台风数据 | 15 分钟 | HTTP Cache |

---

## 🔒 安全和隐私

### 数据隐私

- ✅ 不收集用户个人信息
- ✅ 收藏数据仅存储在本地
- ✅ 不使用追踪 Cookie
- ✅ 开源代码，可自行部署

### API 安全

- ✅ 仅使用公开 API
- ✅ 无需 API Key
- ✅ 所有请求都是只读的
- ✅ 不存储用户查询历史

---

## 🚀 部署清单

### Vercel 部署前检查

- [ ] 所有依赖已安装 (`npm install`)
- [ ] 本地测试通过 (`npm run build`)
- [ ] 环境变量配置（无需）
- [ ] Git 仓库已创建
- [ ] README 已更新

### 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **在 Vercel 导入项目**
   - 访问 https://vercel.com/dashboard
   - 点击 "Add New Project"
   - 选择 GitHub 仓库
   - 配置项目（Framework: Next.js）
   - 点击 "Deploy"

3. **验证部署**
   - 访问提供的 Vercel URL
   - 测试所有功能
   - 检查响应式设计

---

## 📈 未来计划

### 短期（v1.1）

- [ ] 空气质量（AQI）API 集成
- [ ] 紫外线指数详细展示
- [ ] 历史天气查询
- [ ] 更多天气图标

### 中期（v1.2）

- [ ] PWA 支持（可安装到手机）
- [ ] 离线模式
- [ ] 多语言支持（英文、繁体中文）
- [ ] 更多图表类型

### 长期（v2.0）

- [ ] 用户账户系统
- [ ] 天气推送通知
- [ ] 社交分享功能
- [ ] 天气摄影功能

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📝 License

MIT License

---

## 📧 联系方式

- GitHub Issues: 在项目仓库创建 Issue
- Email: your-email@example.com

---

**享受使用 Weather Analyzer Web！** 🌤️
