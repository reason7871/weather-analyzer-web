# 🌤️ Weather Analyzer Web

实时天气查询 Web 应用 - 可部署到 Vercel

## ✨ 特性

- ✅ 实时天气数据（Open-Meteo API）
- ✅ 3 天天气预报
- ✅ 响应式设计（移动端友好）
- ✅ 深色模式支持
- ✅ 城市搜索（中文/拼音/坐标）
- ✅ 30 分钟数据缓存
- ✅ 免费使用（无需 API Key）

## 🚀 快速开始

### 本地开发

```bash
# 1. 克隆项目
cd weather-analyzer-web

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
# http://localhost:3000
```

### 部署到 Vercel

#### 方法 1: 通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel

# 4. 生产环境部署
vercel --prod
```

#### 方法 2: 通过 GitHub + Vercel Dashboard

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **在 Vercel Dashboard 导入项目**
   - 访问 https://vercel.com/dashboard
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - 配置项目：
     - Framework Preset: **Next.js**
     - Root Directory: **./**
     - Build Command: **npm run build**
     - Output Directory: **.next**

3. **点击 Deploy**

4. **等待部署完成**（通常 1-2 分钟）

5. **访问你的应用**
   - Vercel 会提供一个 `.vercel.app` 域名
   - 也可以在设置中添加自定义域名

## 📁 项目结构

```
weather-analyzer-web/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── weather/       # 天气 API 端点
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
├── lib/                   # 工具函数
├── public/                # 静态资源
├── package.json           # 依赖配置
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.ts     # Tailwind CSS 配置
├── next.config.mjs        # Next.js 配置
└── vercel.json            # Vercel 部署配置
```

## 🎨 功能展示

### 主页功能
- 城市搜索框（支持中文、拼音、坐标）
- 实时天气显示（温度、天气状况、体感温度）
- 详细指标（风速、湿度、气压、能见度）
- 3 天天气预报卡片

### 响应式设计
- 📱 移动端优化
- 💻 桌面端优化
- 🌓 深色模式自动适配

## 📊 API 端点

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
  }
}
```

## 🔧 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **部署**: Vercel
- **API**: Open-Meteo (免费)

## 🌐 数据来源

- **天气数据**: Open-Meteo API (https://open-meteo.com/)
- **地理编码**: Open-Meteo Geocoding API

## 🚦 性能优化

- ✅ Next.js 服务端渲染（SSR）
- ✅ Vercel Edge Network
- ✅ 30 分钟 HTTP 缓存
- ✅ 响应式图片优化
- ✅ 代码分割

## 🔒 环境变量

无需配置环境变量！所有 API 均为免费且无需 API Key。

## 📈 未来功能

- [ ] 空气质量（AQI）数据
- [ ] 紫外线指数详细展示
- [ ] 台风追踪地图
- [ ] 城市对比功能
- [ ] 收藏城市功能
- [ ] 历史天气查询
- [ ] 天气预警推送
- [ ] 多语言支持
- [ ] PWA 支持

## 📝 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系

如有问题，请通过 GitHub Issues 联系。

---

**享受使用 Weather Analyzer！** 🌤️
