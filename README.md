# 🌸 Flower Language - 花語心情網站

## 📌 專案概述

**Flower Language** 是一個融合情緒管理、文化美學與遊戲化設計的社交型心情日記平台。透過「花朵」這個美麗的隱喻，幫助用戶記錄、理解並療癒自己的情緒。

### 核心價值
- **去污名化情緒**：所有情緒都值得被記錄與理解
- **隱私至上**：全平台匿名機制，保護用戶隱私
- **美學療癒**：溫暖的色調與手帳質感設計
- **科學支持**：基於Russell Circumplex Model的情緒算法

---

## 🎨 視覺風格

### 色系（Warm Apricot & Milk Tea Brown）
```css
--primary-warm: #E6A15C;      /* 暖橘 */
--primary-brown: #966F46;     /* 牛奶茶棕 */
--bg-cream: #FDFBF7;          /* 奶油白 */
--accent-tan: #D4A574;        /* 淡棕 */
--light-bg: #F5EBE6;          /* 淺麥色 */
```

### 字型組合
- Display: Playfair Display（標題，優雅的襯線字）
- Serif: Noto Serif TC（正文，傳統的東方美感）
- Body: Lora（段落文本，溫暖的可讀性）

---

## 🛠 技術架構

### 前端技術棧
- **HTML5**：語義化標記
- **CSS3**：CSS變數系統、Grid、Flexbox
- **JavaScript (原生)**：無框架依賴，輕量級實現
- **Chart.js**：數據可視化

### 數據層
- **LocalStorage**：前端示範用（實際應使用後端）
- **JSON 數據模型**：完整的Schema設計

### 部署
- **Vercel**：靜態網站託管，CDN加速

---

## 📁 項目結構

```
flower-language/
├── index.html                 # 登入/歡迎頁
├── pages/
│   ├── dashboard.html         # 用戶主頁（我的花園）
│   ├── emotion-record.html    # 心情記錄與推薦
│   ├── diary-editor.html      # 日記編輯（手帳風格）
│   ├── flower-guide.html      # 花語圖鑑
│   ├── shop.html              # 虛擬商店
│   └── forum.html             # 匿名廣場
├── admin/
│   └── dashboard.html         # 管理員控制中心
├── css/
│   └── styles.css             # 全局樣式系統
├── js/
│   └── emotion-algorithm.js   # 核心算法（Russell Model）
├── data/
│   └── schema.js              # 數據庫Schema + 初始數據
├── vercel.json                # Vercel部署配置
└── README.md                  # 本文件
```

---

## 🧠 核心算法：Russell Circumplex Model

### 情緒二維模型

```
愉悅度（Valence）-1 → ... → 0 → ... → +1
不愉悅                          非常愉悅

能量水平（Arousal）-1 → ... → 0 → ... → +1
非常疲憊                        高度活力
```

### 四個情緒象限

| 象限 | 描述 | 典型情緒 | 代表花朵 |
|------|------|---------|---------|
| Q1 | 愉悅 + 高能量 | 快樂、興奮、活力 | 向日葵、金盞花 |
| Q2 | 愉悅 + 低能量 | 平靜、滿足、安心 | 薰衣草、洋甘菊 |
| Q3 | 不愉悅 + 低能量 | 難過、沮喪、疲憊 | 黑玫瑰、忘憂草 |
| Q4 | 不愉悅 + 高能量 | 焦慮、憤怒、躁動 | 紅康乃馨、薊花 |

### 推薦算法（JavaScript實現）

```javascript
// 歐幾里得距離
Distance = √[(x₂-x₁)² + (y₂-y₁)²]

// 或 餘弦相似度
Similarity = (A·B) / (||A|| × ||B||)
```

**實現方式**：見 `js/emotion-algorithm.js`

---

## 🚀 快速開始

### 本地開發

```bash
# 1. 克隆或下載項目
cd flower-language

# 2. 使用任何本地服務器運行
# 選項 A：Python
python -m http.server 8000

# 選項 B：Node.js (http-server)
npx http-server

# 選項 C：PHP
php -S localhost:8000

# 3. 瀏覽器訪問
http://localhost:8000
```

### Vercel部署

```bash
# 1. 安裝Vercel CLI
npm i -g vercel

# 2. 進入項目目錄
cd flower-language

# 3. 部署
vercel

# 4. 跟隨提示即可完成部署
```

**Vercel項目設置**：
- Framework：Static
- Build Command：（留空）
- Output Directory：（.）

---

## 👥 使用者角色與功能

### 一般使用者（Client User）
- ✅ 瀏覽花語圖鑑（50+ 種花卉）
- ✅ 填寫心情量表（Russell Model 滑桿）
- ✅ 智能獲得花朵推薦
- ✅ 撰寫個人日記（手帳風格）
- ✅ 獲得花朵點數
- ✅ 購買虛擬商品
- ✅ 發布匿名貼文與互動
- ✅ 查看心靈統計（圖表）

### 管理員（Admin User）
- ✅ 花卉數據庫CRUD操作
- ✅ 虛擬商店上下架管理
- ✅ 社群內容審查
- ✅ 用戶情緒統計分析

---

## 📊 試用帳號

```
一般使用者：
  用戶名稱：user123
  密碼：password123

管理員：
  用戶名稱：admin001
  密碼：adminPass123
```

---

## 💰 遊戲化機制

### 點數獲取規則
| 行動 | 獲得點數 |
|------|--------|
| 每日首次心情記錄 | +50 |
| 給他人溫暖回應（每日上限） | +5 × N |

### 商店商品示例
| 商品 | 分類 | 定價 | 說明 |
|------|------|------|------|
| 楓糖燕麥背景 | 背景 | 0 | 默認背景 |
| 晨曦落葉背景 | 背景 | 200 | 限時商品 |
| 治癒小花貼紙 | 貼紙 | 100 | 可拖放裝飾 |
| 森林雨聲BGM | 音樂 | 500 | 背景循環播放 |

---

## 🔐 隱私與安全機制

### 強制匿名化
```
原始用戶名 → 系統轉換為 → 「花朵名稱 + 隨機編號」
例：Alice → 「暗戀的向日葵 #083」
```

### 社群審查
- 貼文被檢舉3次自動進入審查佇列
- 管理員有一鍵下架權限
- 僅允許正向互動按鈕（🫂 擁抱、🌸 送花、❤️ 感同身受）

---

## 📈 核心數據模型

### User Schema
```javascript
{
  userId: UUID,
  username: String,
  email: String,
  passwordHash: String,
  totalPoints: Integer,
  totalDiaries: Integer,
  avatarFlower: UUID,
  createdAt: DateTime
}
```

### Flower Schema
```javascript
{
  flowerId: UUID,
  flowerName: String,
  chineseName: String,
  flowerLanguage: String,
  emotionTags: Array,
  valence: Float (-1 to 1),
  arousal: Float (-1 to 1),
  description: String,
  imageUrl: String,
  symbolism: String
}
```

詳見 `data/schema.js` 中完整的 DatabaseSchema

---

## 🧪 算法測試

### 運行測試

```javascript
// 在瀏覽器控制台執行
const recommender = new EmotionRecommender(initialFlowers);

// 測試案例 1：非常開心
const happyRecs = recommender.recommendFlowersByDistance(0.9, 0.8, 5);
console.log(happyRecs);

// 測試案例 2：平靜放鬆
const calmRecs = recommender.recommendFlowersByDistance(0.5, -0.6, 5);
console.log(calmRecs);
```

### 預期結果
✅ 推薦結果按相似度排序
✅ 匹配度評分在 0-100 之間
✅ 包含花卉詳細信息

---

## 🔧 開發指南

### 添加新花卉

```javascript
// 在 data/schema.js 中添加
{
  id: "fXXX",
  name: "英文花名",
  chineseName: "中文花名",
  language: "花語寓意",
  tags: ["emotion1", "emotion2"],
  valence: 0.5,    // -1 到 1
  arousal: 0.3,    // -1 到 1
  description: "花卉故事...",
  symbol: "文化象徵...",
  color: "#RRGGBB"
}
```

### 自定義顏色主題

編輯 `css/styles.css` 中的 CSS 變數：

```css
:root {
    --primary-warm: #E6A15C;
    --primary-brown: #966F46;
    /* ... 其他顏色 */
}
```

### 連接後端 API

替換 `localStorage` 調用：

```javascript
// 現在：從本地儲存讀取
const user = JSON.parse(localStorage.getItem('currentUser'));

// 改為：從 API 獲取
const user = await fetch('/api/users/me').then(r => r.json());
```

---

## 📱 響應式設計

✅ 桌面 (1200px+)
✅ 平板 (768px - 1199px)
✅ 手機 (< 768px)

所有頁面都使用 CSS Grid 和 Flexbox 實現流暢的響應式布局。

---

## ♿ 無障礙設計

- ✅ 語義化HTML標記
- ✅ 足夠的色彩對比度
- ✅ 可聚焦的交互元素
- ✅ ARIA標籤（可擴展）
- ✅ 鍵盤導航支持

---

## 🌍 國際化（i18n）

目前支持：繁體中文（zh-Hant）

可輕鬆添加更多語言。所有文本字符串集中在頁面顶部。

---

## 📝 代碼品質規則

**重要**：為保持商業隱私與安全性，所有代碼必須遵守：

✅ 不包含任何開發團隊的個人真實姓名或學號
✅ API 註解與 Author 欄位保持去識別化
✅ 不洩露任何內部開發信息

---

## 🤝 貢獻指南

此項目當前為教學和示範用途。歡迎改進建議！

---

## 📄 許可證

本專案為開源項目，可自由使用與修改。

---

## 📞 支持

遇到問題？檢查以下：

1. **瀏覽器兼容性**：推薦使用最新版本的 Chrome、Firefox、Safari
2. **LocalStorage**：確保瀏覽器允許存儲本地數據
3. **服務器**：確保通過本地服務器運行（不能直接打開HTML文件）

---

**製作於 2026年 | Flower Language Team**
