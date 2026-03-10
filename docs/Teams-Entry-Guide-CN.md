# Nomenclatura App — Microsoft Teams 入口集成指南

本文档说明如何将已部署在公司内部服务器上的 Nomenclatura App 接入 Microsoft Teams，使员工无需记忆 URL，直接在 Teams 中一键打开应用。

> **⚠️ 前提条件**
>
> Microsoft Teams 要求嵌入的网页必须使用 **HTTPS** 协议。请确保您的内网应用已配置 SSL 证书。
> 具体的 HTTPS 配置方法请参考 [服务器部署指南](./Deployment-Server-Guide-CN.md) 中的 HTTPS 章节。
>
> 当前内网服务器地址：`http://10.32.1.150:3000`（配置 HTTPS 后为 `https://10.32.1.150:3000`）

---

## 目录

- [方案一：频道选项卡（Website Tab）](#方案一频道选项卡website-tab)
- [方案二：个人应用（Personal App）](#方案二个人应用personal-app)
- [方案对比](#方案对比)

---

## 方案一：频道选项卡（Website Tab）

> ✅ 最快捷的方式，无需管理员权限，任何团队所有者或成员即可操作。
> 适合在特定项目组或频道中共享使用。

### 操作步骤

**第 1 步：进入目标频道**

打开 Microsoft Teams → 选择目标**团队** → 进入目标**频道**。

**第 2 步：添加选项卡**

点击频道顶部菜单栏最右侧的 **`+`（添加选项卡）** 按钮。

**第 3 步：选择「网站」应用**

在弹出的应用面板中搜索 **「Website」** 或 **「网站」**，点击选中。

**第 4 步：配置选项卡**

| 字段 | 填写内容 |
|------|---------|
| **选项卡名称** | `Nomenclatura` 或 `📂 Nomenclatura de Documentos` |
| **URL** | `https://10.32.1.150:3000` |

> 如尚未配置 HTTPS，可先使用 `http://10.32.1.150:3000` 进行测试（但 Teams iframe 可能会拒绝加载 HTTP 页面）。

**第 5 步：保存**

点击 **「保存」**。选项卡将立即出现在频道顶部菜单栏中。

### 效果

- 团队成员点击该选项卡，即可在 Teams 窗口内直接使用 Nomenclatura App
- 应用在 Teams 的 iframe 中全屏展示，体验与浏览器一致
- 无需额外登录或切换窗口

---

## 方案二：个人应用（Personal App）

> 🏢 最正式的方式，可将应用图标固定在每位员工 Teams 左侧导航栏中。
> 需要使用 Developer Portal 打包，并由 IT 管理员下发。

### 第一阶段：创建应用包

#### 步骤 1 — 打开 Developer Portal

1. 在 Teams 左侧边栏点击 **「应用」(Apps)**
2. 搜索 **「Developer Portal」**（开发者门户）
3. 点击打开并添加到常用应用

#### 步骤 2 — 新建应用

1. 在 Developer Portal 顶部切换到 **「Apps」** 标签
2. 点击 **「+ New app」**
3. 输入应用名称：`Nomenclatura`（或 `Nomenclatura Unificada de Documentos`）
4. 点击 **「Add」** 创建

#### 步骤 3 — 填写基本信息（Basic information）

在左侧菜单选择 **「Basic information」**，填写以下必填字段：

| 字段 | 填写内容 |
|------|---------|
| **Short description** | `Herramienta interna para consultar y generar nombres de documentos según la nomenclatura unificada de la empresa.` |
| **Long description** | `Nomenclatura es una aplicación interna que permite a los empleados consultar códigos de clasificación y generar nombres de archivos estandarizados de acuerdo con la nomenclatura unificada de documentos de la empresa. Facilita el cumplimiento de las normas internas de organización documental.` |
| **Developer name** | 填写您的公司名称 |
| **Website** | `https://10.32.1.150:3000` |
| **Privacy policy** | `https://10.32.1.150:3000`（或公司隐私政策页 URL） |
| **Terms of use** | `https://10.32.1.150:3000`（或公司使用条款页 URL） |

**上传应用图标：**

| 图标类型 | 尺寸要求 | 说明 |
|---------|---------|------|
| **Color icon** | 192 × 192 px | 彩色版，显示在应用商店和侧边栏 |
| **Outline icon** | 32 × 32 px | 透明背景白色轮廓线版，显示在消息扩展等位置 |

> 💡 如果暂无专用图标，可使用公司 Logo 裁剪为对应尺寸。

#### 步骤 4 — 配置个人应用标签页（App features）

1. 左侧菜单选择 **「App features」**
2. 点击 **「Personal app」** 卡片
3. 点击 **「+ Add a personal app tab」**
4. 填写：

| 字段 | 填写内容 |
|------|---------|
| **Name** | `Nomenclatura` |
| **Entity ID** | `nomenclatura-tab` |
| **Content URL** | `https://10.32.1.150:3000` |
| **Website URL** | `https://10.32.1.150:3000` |

5. 点击 **「Confirm」** 保存

#### 步骤 5 — 确认域名（Domains）

1. 左侧菜单选择 **「Domains」**
2. 确认列表中已自动包含 `10.32.1.150`
3. 如果没有，手动点击 **「+ Add a domain」** 添加 `10.32.1.150`

#### 步骤 6 — 预览测试

点击 Developer Portal 顶部的 **「Preview in Teams」** 按钮，验证应用是否能正常加载您的内网网页。

#### 步骤 7 — 下载应用包

1. 点击右上角 **「Publish」**
2. 选择 **「Download app package」**
3. 将下载得到的 `.zip` 文件保存好（内含 `manifest.json` 和图标文件）

### 第二阶段：IT 管理员发布到全公司

> 以下步骤需要由公司的 Microsoft 365 管理员执行。

#### 步骤 1 — 上传应用

1. 管理员登录 [Teams Admin Center](https://admin.teams.microsoft.com/)
2. 左侧导航选择 **「Teams apps」→「Manage apps」**
3. 点击 **「+ Upload new app」**
4. 上传第一阶段下载的 `.zip` 应用包

#### 步骤 2 — 审批应用

1. 在应用列表中找到 `Nomenclatura`
2. 点击进入，确认应用状态为 **「Allowed」**（允许使用）

#### 步骤 3 — 固定到所有员工侧边栏（可选但推荐）

1. 左侧导航选择 **「Teams apps」→「Setup policies」**
2. 编辑 **「Global (Org-wide default)」** 策略，或创建新策略
3. 在 **「Pinned apps」** 部分点击 **「+ Add apps」**
4. 搜索 `Nomenclatura`，添加并调整顺序
5. 保存策略

> ⏱ 策略生效可能需要数小时，之后全体员工的 Teams 左侧导航栏将自动出现 Nomenclatura 应用图标。

### 效果

- 每位员工的 Teams 左侧都会出现 Nomenclatura 图标
- 点击即可在 Teams 主窗口中打开应用
- 无需浏览器、无需记忆 URL、无需额外登录

---

## 方案对比

| 对比项 | 频道选项卡 | 个人应用 |
|-------|-----------|---------|
| **难度** | ⭐ 非常简单 | ⭐⭐⭐ 需要 Developer Portal + 管理员 |
| **所需时间** | 1 分钟 | 30-60 分钟 |
| **覆盖范围** | 仅限特定频道成员 | 全公司所有员工 |
| **用户体验** | 在频道标签页中查看 | 在 Teams 左侧导航栏一键进入 |
| **管理员权限** | 不需要 | 需要 Microsoft 365 管理员 |
| **推荐场景** | 快速试用、特定团队使用 | 全公司推广、正式上线 |

### 推荐策略

1. **先用方案一**快速在核心团队频道中试用
2. 确认体验无误后，用**方案二**正式推广到全公司
