# ⚡ 快速启动指南

## 🚀 立即开始

### 1️⃣ 本地运行

```bash
# 进入项目目录
cd E:\claude_itme\weather-analyzer-web

# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:3000
```

### 2️⃣ 测试功能

1. **输入城市名称**（如：福州、北京、上海）
2. **点击"查询"按钮**
3. **查看实时天气和预报**

---

## 🌐 部署到 Vercel

### 最简单的方法（5 分钟）

#### 步骤 1: 推送到 GitHub

```bash
# 在 GitHub 创建新仓库（命名为 weather-analyzer-web）

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/weather-analyzer-web.git
git push -u origin main
```

#### 步骤 2: 在 Vercel 导入

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库
4. 点击 "Deploy"
5. 等待 1-2 分钟
6. 完成！访问你的 Vercel URL

---

## 📱 预览

应用包含：

- ✅ 城市搜索框
- ✅ 实时天气显示
- ✅ 天气详情卡片（风速、湿度、气压、能见度）
- ✅ 3 天天气预报
- ✅ 响应式设计（手机/电脑）
- ✅ 深色模式支持

---

## 🔧 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 构建
npm run build        # 构建生产版本
npm start            # 启动生产服务器

# 代码检查
npm run lint         # 运行 ESLint
```

---

## 📂 项目结构

```
weather-analyzer-web/
├── app/
│   ├── api/weather/    # 天气 API
│   ├── layout.tsx      # 布局
│   ├── page.tsx        # 首页
│   └── globals.css     # 样式
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## ✅ 准备部署

确认以下文件已创建：

- ✅ `package.json`
- ✅ `next.config.mjs`
- ✅ `vercel.json`
- ✅ `.gitignore`
- ✅ `app/page.tsx`
- ✅ `app/api/weather/route.ts`

---

## 🎉 完成！

现在你可以：
1. 在本地测试应用
2. 部署到 Vercel
3. 分享给朋友使用

祝你使用愉快！🌤️
