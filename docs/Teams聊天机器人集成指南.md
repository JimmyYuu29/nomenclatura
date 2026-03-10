# 集成指南：Microsoft Teams 命名规范聊天机器人
## Forvis Mazars - 实施手册

**版本：** 2.0
**日期：** 2026-03-09
**状态：** DRF（草稿）

---

## 1. 简介

本指南详细说明如何在 Microsoft Teams 中实施聊天机器人，使 Forvis Mazars 的用户能够生成符合文件统一命名规范（FORMAZ-PRO-01 v2.0）的文件名，**无需 Microsoft Graph API**。

### 1.1 选定方案

**Microsoft Copilot Studio + Power Automate**

选择此组合的原因：

| 标准 | 优势 |
|------|------|
| 无需 Graph API | 使用 Power Platform 原生连接器 |
| 无需编码 | 可从可视化界面配置 |
| Teams 原生 | 直接发布，无需额外基础设施 |
| 维护成本 | Microsoft 管理后端 |
| 费用 | 包含在许多 M365 计划中 |
| 可扩展性 | 无需重写即可添加功能 |
| 时间 | 2-3 周完成实施 |

---

## 2. 前提条件

### 2.1 所需许可证

| 组件 | 所需许可证 |
|------|-----------|
| Microsoft Copilot Studio | Copilot Studio 许可证（包含在 M365 E3/E5 附加组件中，或独立许可证） |
| Power Automate | Power Automate 许可证（包含在 M365 中） |
| SharePoint Online | 包含在 M365 中 |
| Excel Online | 包含在 M365 中 |
| Microsoft Teams | 包含在 M365 中 |

### 2.2 所需权限

- **Teams 管理员**或具有发布应用的权限
- Power Platform 中的**环境创建者**权限
- 存储目录的 SharePoint 站点的**编辑者**权限
- Copilot Studio 中的 **Maker** 权限

### 2.3 数据准备

开始之前，将 `Catálogos incluidos.xlsx` 上传到 SharePoint Online：

1. 创建 SharePoint 站点：`Nomenclatura-Forvis`
2. 在文档库中上传 `Catálogos incluidos.xlsx`
3. 验证文件包含 3 个部分：
   - **Acrónimo_Documento**（第 1-31 行）：文档类型
   - **Servicio AX**（第 35-116 行）：服务代码
   - **ESTADO_DOCUMENTO**（第 120-130 行）：文档状态

---

## 3. 步骤一：在 Copilot Studio 中创建 Bot

### 3.1 访问 Copilot Studio

1. 前往 [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)
2. 使用 Forvis Mazars 企业凭据登录
3. 选择正确的 Power Platform 环境

### 3.2 创建新的 Copilot

1. 点击 **"+ 创建"**（或 "Create"）
2. 选择 **"新建 Copilot"**
3. 配置：
   - **名称：** `Nomenclatura Forvis Mazars`
   - **描述：** `根据统一命名规范 FORMAZ-PRO-01 生成文件名的助手`
   - **主要语言：** 西班牙语
   - **图标：** 上传 Forvis Mazars 标志或使用文档图标

4. 点击 **"创建"**

### 3.3 配置欢迎消息

1. 进入 **主题** > **系统主题** > **欢迎**
2. 编辑欢迎消息：

```
你好！我是 Forvis Mazars 命名规范助手。

我可以帮你：
📝 生成正确的文件名
🔍 搜索 AX 服务代码
📋 搜索文档缩写
✅ 验证现有文件名
❓ 查看命名规范指南

你需要什么帮助？
```

---

## 4. 步骤二：创建 Bot 主题（Topics）

### 4.1 主题："文件重命名"（主流程）

这是最重要的主题，引导用户完成命名规范的 7 个字段。

**创建主题：**

1. 进入 **主题** > **+ 新建主题** > **从头开始**
2. 名称：`Renombrar archivo`（重命名文件）
3. 触发短语：
   - "renombrar"（重命名）
   - "nombre de archivo"（文件名）
   - "nomenclatura"（命名规范）
   - "generar nombre"（生成名称）
   - "rename"
   - "cómo nombro este archivo"（如何命名这个文件）
   - "/rename"

**设计对话流程：**

#### 步骤 1 - 客户别名 (ALIAS_CLIENTE)
```
节点类型：消息
文本："第 1/7 步：客户别名
请输入客户的简短标识符（例：FMZ00, ACME01）"

节点类型：问题
变量：VarAliasCliente
类型：自由文本
验证：仅限字母数字，不含空格
```

#### 步骤 2 - AX 服务代码 (SERVICIO_AX)
```
节点类型：消息
文本："第 2/7 步：AX 服务代码
输入关键词搜索服务（例：'auditoría', 'consulting', 'SOX'）"

节点类型：问题
变量：VarBusquedaServicio
类型：自由文本

节点类型：操作（Power Automate）
流程：BuscarServicioAX
输入：VarBusquedaServicio
输出：VarResultadosServicio

节点类型：带自适应选项的消息
显示结果并允许选择

节点类型：问题
变量：VarServicioAX
类型：多选项（动态生成）
```

#### 步骤 3 - 服务期间 (PERIODO_SERVICIO)
```
节点类型：消息
文本："第 3/7 步：服务期间
期间截止日期是什么？（格式：DD/MM/YYYY，例：31/12/2025）"

节点类型：问题
变量：VarPeriodoServicio
类型：日期
```

#### 步骤 4 - 文档缩写 (ACRÓNIMO_DOCUMENTO)
```
节点类型：消息
文本："第 4/7 步：文档类型
输入关键词搜索类型（例：'informe', 'carta', 'propuesta'）"

节点类型：问题
变量：VarBusquedaAcronimo
类型：自由文本

节点类型：操作（Power Automate）
流程：BuscarAcronimo
输入：VarBusquedaAcronimo
输出：VarResultadosAcronimo

节点类型：问题
变量：VarAcronimo
类型：多选项
```

#### 步骤 5 - 文档日期 (AÑO_FECHA_DOCUMENTO)
```
节点类型：消息
文本："第 5/7 步：文档日期
创建日期？（默认今天：[当前日期]）
输入日期或输入 'hoy'（今天）使用当前日期。"

节点类型：问题
变量：VarFechaDocumento
类型：日期
默认值：utcNow()
```

#### 步骤 6 - 版本 (VERSIÓN)
```
节点类型：消息
文本："第 6/7 步：版本
版本号？（默认：v1）"

节点类型：问题
变量：VarVersion
类型：多选项
选项：v1, v2, v3, v4, v5, 其他
```

#### 步骤 7 - 文档状态 (ESTADO_DOCUMENTO)
```
节点类型：消息
文本："第 7/7 步：文档状态"

节点类型：问题
变量：VarEstado
类型：多选项
选项：
- DRF - 草稿
- REV - 审阅中
- OBS - 有意见
- APR - 已批准
- DEF - 最终版
- FDO - 已签署
- VIG - 生效中
- SUS - 暂停
- OBSOL - 已过时
- ARC - 已归档
```

#### 生成与确认
```
节点类型：操作（Power Automate）
流程：GenerarNombre
输入：所有变量
输出：VarNombreFinal

节点类型：消息
文本："✅ 生成的名称：

{VarNombreFinal}

各组件：
- 客户：{VarAliasCliente}
- 服务：{VarServicioAX}
- 期间：{VarPeriodoFormateado}
- 文档：{VarAcronimo}
- 日期：{VarFechaFormateada}
- 版本：{VarVersion}
- 状态：{VarEstado}

你想做什么？"

节点类型：问题
选项："复制名称" | "新建重命名" | "结束"
```

### 4.2 主题："搜索 AX 服务代码"

1. 名称：`Buscar servicio`（搜索服务）
2. 触发词："buscar servicio"、"servicio AX"、"código servicio"
3. 流程：
   - 询问搜索关键词
   - 调用 Power Automate 流程 `BuscarServicioAX`
   - 显示带代码和描述的结果

### 4.3 主题："搜索文档缩写"

1. 名称：`Buscar acrónimo`（搜索缩写）
2. 触发词："buscar tipo"、"acrónimo"、"tipo documento"
3. 流程与服务搜索类似，但查询缩写目录

### 4.4 主题："查看状态"

1. 名称：`Ver estados`（查看状态）
2. 触发词："estados"、"qué estados hay"、"estado documento"
3. 显示带描述的状态表

### 4.5 主题："验证名称"

1. 名称：`Validar nombre`（验证名称）
2. 触发词："validar"、"verificar nombre"、"está bien este nombre"
3. 流程：
   - 要求输入完整文件名
   - 调用 Power Automate 流程 `ValidarNomenclatura`
   - 显示验证结果和详细信息

### 4.6 主题："帮助"

1. 名称：`Ayuda nomenclatura`（命名帮助）
2. 触发词："ayuda"、"help"、"cómo funciona"、"guía"
3. 显示命名规范结构和规则摘要

---

## 5. 步骤三：创建 Power Automate 流程

### 5.1 流程：BuscarServicioAX（搜索 AX 服务代码）

**类型：** 即时云端流程（Cloud flow - Instant）

**触发器：** When Copilot Studio calls a flow

**步骤：**

1. **触发器：Power Virtual Agents**
   - 输入：`searchTerm`（搜索文本）

2. **操作：List rows present in a table（Excel Online）**
   - 位置：SharePoint 站点 `Nomenclatura-Forvis`
   - 文档库：`Documentos`（文档）
   - 文件：`Catálogos incluidos.xlsx`
   - 表名：`TablaServicioAX`（在 Excel 中创建命名表）

3. **操作：Filter array（筛选数组）**
   - 来源：上一步输出
   - 条件：`contains(toLower(item()?['Descripción']), toLower(triggerBody()?['searchTerm']))`

4. **操作：Select（选择）**
   - 来源：筛选后的输出
   - 映射：`代码: item()?['Servicio AX'] - 描述: item()?['Descripción']`

5. **操作：Compose（组合）**
   - 创建格式化的结果字符串（最多 10 条）

6. **响应：Return value(s) to Power Virtual Agents**
   - 输出：`resultados`（格式化选项字符串）

### 5.2 流程：BuscarAcronimo（搜索文档缩写）

**结构与 BuscarServicioAX 相同**，但查询缩写表。

1. **触发器：** searchTerm
2. **Excel Online：** 读取表 `TablaAcronimos`
3. **筛选：** 按描述筛选
4. **响应：** 格式化的结果

### 5.3 流程：GenerarNombre（生成名称）

**触发器：** When Copilot Studio calls a flow

**输入：**
- aliasCliente（字符串）
- servicioAX（字符串）
- periodoServicio（字符串 - 日期）
- acronimoDocumento（字符串）
- fechaDocumento（字符串 - 日期）
- version（字符串）
- estadoDocumento（字符串）

**步骤：**

1. **Compose - 格式化期间日期：**
   ```
   formatDateTime(triggerBody()?['periodoServicio'], 'yyyyMMdd')
   ```

2. **Compose - 格式化文档日期：**
   ```
   formatDateTime(triggerBody()?['fechaDocumento'], 'yyyyMMdd')
   ```

3. **Compose - 生成名称：**
   ```
   concat(
     triggerBody()?['aliasCliente'], '-',
     triggerBody()?['servicioAX'], '-',
     outputs('Formatear_Periodo'), '-',
     triggerBody()?['acronimoDocumento'], '-',
     outputs('Formatear_Fecha'), '-',
     triggerBody()?['version'], '-',
     triggerBody()?['estadoDocumento']
   )
   ```

4. **Compose - 验证：**
   - 检查是否包含空格
   - 检查日期格式
   - 检查缩写是否在目录中

5. **响应：** nombreFinal（最终名称，字符串）

### 5.4 流程：ValidarNomenclatura（验证命名规范）

**触发器：** When Copilot Studio calls a flow

**输入：** nombreArchivo（文件名，字符串）

**步骤：**

1. **Compose - 按连字符拆分：**
   ```
   split(triggerBody()?['nombreArchivo'], '-')
   ```

2. **Condition - 验证 7 个部分：**
   - 如果 length(split) != 7 → 错误："名称必须恰好有 7 个由连字符分隔的字段"

3. **验证每个字段：**
   - 字段 1（别名）：仅字母数字
   - 字段 2（服务）：存在于目录中
   - 字段 3（期间）：有效的 YYYYMMDD 格式
   - 字段 4（缩写）：存在于目录中
   - 字段 5（日期）：有效的 YYYYMMDD 格式
   - 字段 6（版本）：v + 数字格式
   - 字段 7（状态）：有效值（DRF, REV, OBS, APR, DEF, FDO, VIG, SUS, OBSOL, ARC）

4. **响应：**
   - esValido（布尔值）
   - errores（错误列表字符串）

### 5.5 流程：GuardarHistorial（保存历史记录 - 可选）

**触发器：** When Copilot Studio calls a flow

**步骤：**

1. **操作：Create item（SharePoint）**
   - 站点：`Nomenclatura-Forvis`
   - 列表：`HistorialRenombrados`
   - 字段：NombreOriginal, NombreNuevo, Usuario, Fecha, Fuente

---

## 6. 步骤四：在 Excel Online 中准备目录

### 6.1 在 Excel 中创建命名表

要让 Power Automate 读取数据，需要在 Excel 中创建**命名表**：

1. 在 Excel Online 中打开 `Catálogos incluidos.xlsx`
2. **表 1 - 缩写：**
   - 选择范围 A1:B31（Acrónimo_Documento + Descripción）
   - 插入 > 表格
   - 表名：`TablaAcronimos`

3. **表 2 - AX 服务：**
   - 选择范围 A35:B116（Servicio AX + Descripción）
   - 插入 > 表格
   - 表名：`TablaServicioAX`

4. **表 3 - 状态：**
   - 选择范围 A120:B130（ESTADO_DOCUMENTO + Descripción）
   - 插入 > 表格
   - 表名：`TablaEstados`

### 6.2 创建 SharePoint 历史记录列表（可选）

1. 在 SharePoint 站点 `Nomenclatura-Forvis` 中
2. 创建列表：`HistorialRenombrados`（重命名历史记录）
3. 列：
   - NombreOriginal（原始名称，单行文本）
   - NombreNuevo（新名称，单行文本）
   - Usuario（用户，人员类型）
   - Fecha（日期，日期和时间）
   - Fuente（来源，选项：WebApp, Chatbot）

---

## 7. 步骤五：将 Bot 发布到 Teams

### 7.1 在 Copilot Studio 中测试

1. 在 Copilot Studio 中，使用左下角的**测试面板**（Test bot）
2. 测试每个主题：
   - 输入 "renombrar" → 验证是否启动流程
   - 完成 7 个步骤 → 验证生成的名称
   - 测试 "buscar servicio" → 验证搜索结果
   - 测试 "validar" → 验证验证功能

### 7.2 发布到 Teams

1. 在 Copilot Studio 中，进入 **渠道**（Channels）
2. 选择 **Microsoft Teams**
3. 点击 **"启用 Teams"**（Turn on Teams）
4. 配置：
   - **Bot 名称：** Nomenclatura Forvis Mazars
   - **简短描述：** 文件命名规范助手
   - **详细描述：** 生成符合统一命名规范 FORMAZ-PRO-01 的文件名。搜索 AX 服务代码、文档缩写和文档状态。
   - **图标：** 自定义 Logo（192x192 像素）

5. 点击 **"发布"**

### 7.3 配置可用性

**方案 A：全组织可用**
1. 进入 **Teams 管理中心**（Teams Admin Center）
2. **Teams 应用** > **管理应用**
3. 搜索 "Nomenclatura Forvis Mazars"
4. 将状态更改为 **"已允许"**
5. 在 **应用设置策略** 中，添加到全局策略

**方案 B：特定用户可用**
1. 创建自定义**应用设置策略**
2. 添加 Bot 应用
3. 将策略分配给目标用户组

### 7.4 在 Teams 中固定 Bot（推荐）

为便于访问：
1. 在 Teams 管理中心 > **应用设置策略**
2. 在 **固定的应用** 部分，添加 "Nomenclatura Forvis Mazars"
3. Bot 将出现在所有用户的 Teams 侧边栏中

---

## 8. 步骤六：高级配置

### 8.1 自适应卡片（Adaptive Cards）

使用 **Adaptive Cards** 提供更丰富的视觉交互体验：

**搜索结果的 Adaptive Card 示例：**
```json
{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    {
      "type": "TextBlock",
      "text": "AX 服务代码搜索结果",
      "weight": "Bolder",
      "size": "Medium"
    },
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "width": "30",
          "items": [{"type": "TextBlock", "text": "**代码**", "weight": "Bolder"}]
        },
        {
          "type": "Column",
          "width": "70",
          "items": [{"type": "TextBlock", "text": "**描述**", "weight": "Bolder"}]
        }
      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "AUD_CAOIN",
      "data": {"servicio": "AUD_CAOIN"}
    },
    {
      "type": "Action.Submit",
      "title": "AUD_CAOCON",
      "data": {"servicio": "AUD_CAOCON"}
    }
  ]
}
```

**最终结果的 Adaptive Card 示例：**
```json
{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    {
      "type": "TextBlock",
      "text": "生成的文件名",
      "weight": "Bolder",
      "size": "Large",
      "color": "Good"
    },
    {
      "type": "TextBlock",
      "text": "FMZ00-AUD_CAOIN-20251231-IA-20260309-v1-DRF",
      "fontType": "Monospace",
      "size": "Medium",
      "wrap": true
    },
    {
      "type": "FactSet",
      "facts": [
        {"title": "客户", "value": "FMZ00"},
        {"title": "服务", "value": "AUD_CAOIN"},
        {"title": "期间", "value": "31/12/2025"},
        {"title": "文档", "value": "IA - 审计报告"},
        {"title": "日期", "value": "09/03/2026"},
        {"title": "版本", "value": "v1"},
        {"title": "状态", "value": "DRF - 草稿"}
      ]
    }
  ],
  "actions": [
    {"type": "Action.Submit", "title": "新建重命名", "data": {"action": "new"}},
    {"type": "Action.OpenUrl", "title": "查看指南", "url": "https://sharepoint-url/guia"}
  ]
}
```

### 8.2 在 Teams 中处理文件（无 Graph API）

没有 Graph API 的情况下，聊天机器人可以通过以下方式处理文件：

**方案 1：仅生成名称（MVP 推荐）**
- Bot 生成正确的名称
- 用户手动重命名文件
- 优点：简单，无需额外权限

**方案 2：Power Automate + SharePoint 连接器**
- 用户将文件上传到 SharePoint 的特定文件夹
- Power Automate 检测新文件（触发器："When a file is created"）
- 流程使用元数据自动重命名
- 优点：完全自动化
- 缺点：需要额外的工作流

**方案 3：OneDrive 连接器**
- 类似 SharePoint，但使用用户的 OneDrive
- Power Automate 可以在无需 Graph API 的情况下重命名 OneDrive 中的文件
- 使用 OneDrive for Business 连接器的 "Rename file" 操作

### 8.3 主动通知

配置 Bot 发送提醒：

1. 在 Power Automate 中创建计划流程（scheduled flow）
2. 触发器：Recurrence（每周一上午 9:00）
3. 操作：向 Teams 频道发送命名规范提醒消息
4. 包含 Bot 和指南的链接

---

## 9. 维护与更新

### 9.1 更新目录

当添加新的 AX 服务、缩写或状态时：

1. 在 SharePoint 中编辑 `Catálogos incluidos.xlsx`
2. 确保新数据在命名表范围内
3. Power Automate 流程会自动读取更新后的数据
4. 无需修改 Bot 或流程

### 9.2 为 Bot 添加新主题

1. 进入 Copilot Studio
2. 主题 > + 新建主题
3. 配置触发器和流程
4. 在测试面板中测试
5. 发布更新

### 9.3 监控

**在 Copilot Studio 中：**
- **分析** 面板显示：
  - 对话数量
  - 解决率
  - 最常用的主题
  - 未回答的问题

**在 Power Automate 中：**
- 每个流程的运行历史
- 错误和失败记录
- 响应时间

### 9.4 月度维护清单

- [ ] 验证目录是否已更新
- [ ] 查看 Bot 分析数据
- [ ] 查看 Power Automate 错误日志
- [ ] 根据新的常见问题更新主题
- [ ] 验证许可证是否有效

---

## 10. 故障排除

### 10.1 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Bot 在 Teams 中无响应 | 未发布 | 在 Copilot Studio > 渠道中验证发布状态 |
| 流程找不到数据 | Excel 表未命名 | 在 Excel Online 中创建命名表 |
| 搜索无结果 | 大小写敏感的筛选 | 在流程筛选中使用 toLower() |
| Bot 在 Teams 中不显示 | 应用策略问题 | 在 Teams 管理中心中验证 |
| 日期格式错误 | 区域格式问题 | 在 Power Automate 中使用 formatDateTime() |
| 流程间歇性失败 | 连接超时 | 增加流程配置中的超时时间 |

### 10.2 日志与诊断

1. **Copilot Studio：** 主题 > 测试 Bot > 查看对话跟踪
2. **Power Automate：** 我的流程 > 运行历史 > 查看详情
3. **Teams 管理中心：** 应用 > 诊断

---

## 11. 已评估的替代方案

### 11.1 方案 B：Azure Bot Service + Bot Framework SDK

如果未来有开发人员且需要更多控制：

**优点：**
- 完全控制代码
- 更深入的集成
- 无限可扩展性

**缺点：**
- 需要 C# 或 Node.js 开发
- Azure 基础设施（成本）
- 需要开发团队维护
- 实施时间：6-8 周

**何时迁移：** 如果交互量超过每天 10,000 次或需要 Graph API。

### 11.2 方案 C：Power Apps + Power Automate

嵌入 Teams 中的可视化表单应用：

**优点：**
- 比聊天机器人更丰富的可视界面
- 与 Power Automate 集成
- 无需编码

**缺点：**
- 非对话式
- 需要打开应用（更多步骤）
- 采用率低于聊天机器人

**何时考虑：** 如果用户更喜欢表单而非对话。

### 11.3 方案 D：Outgoing Webhook + Azure Function

最轻量级方案，无需 Copilot Studio：

**优点：**
- 快速实施（1-2 天）
- 无需额外许可证
- 完全控制

**缺点：**
- 交互有限（仅文本）
- 无按钮或自适应卡片
- 需要托管（Azure Function）
- 手动维护

**快速实施步骤：**
```
1. 创建带有 HTTP 触发器的 Azure Function
2. 函数接收消息并解析命令
3. 在嵌入的 JSON 目录中搜索
4. 返回生成的名称
5. 在 Teams 中注册为 Outgoing Webhook
```

---

## 12. 演进路线图

### 第一阶段（当前）：名称生成器
- 聊天机器人生成正确的名称
- 用户手动重命名

### 第二阶段：SharePoint 集成
- Bot 可在 SharePoint 中搜索文件
- 通过 Power Automate 自动重命名
- SharePoint List 记录历史

### 第三阶段：Graph API（可用时）
- 直接访问用户的 OneDrive/SharePoint
- 无需离开 Teams 即可重命名
- 搜索命名不规范的文件
- 主动通知不合规情况

### 第四阶段：AI 与自动化
- 自动检测文档类型（OCR + AI）
- 基于内容自动建议字段
- 与 ERP AX 集成验证客户
- 命名合规性仪表板

---

## 附录 A：实施检查清单

- [ ] 验证许可证（Copilot Studio, Power Automate, M365）
- [ ] 将 Catálogos incluidos.xlsx 上传到 SharePoint
- [ ] 在 Excel Online 中创建命名表
- [ ] 在 Copilot Studio 中创建 Bot
- [ ] 配置欢迎主题
- [ ] 创建"文件重命名"主题（7 个步骤）
- [ ] 创建"搜索 AX 服务代码"主题
- [ ] 创建"搜索文档缩写"主题
- [ ] 创建"查看状态"主题
- [ ] 创建"验证名称"主题
- [ ] 创建"帮助"主题
- [ ] 在 Power Automate 中创建 "BuscarServicioAX" 流程
- [ ] 在 Power Automate 中创建 "BuscarAcronimo" 流程
- [ ] 在 Power Automate 中创建 "GenerarNombre" 流程
- [ ] 在 Power Automate 中创建 "ValidarNomenclatura" 流程
- [ ] （可选）创建 "GuardarHistorial" 流程
- [ ] （可选）创建 SharePoint 列表 "HistorialRenombrados"
- [ ] 在 Copilot Studio 测试面板中测试所有流程
- [ ] 将 Bot 发布到 Teams
- [ ] 在 Teams 管理中心配置可用性
- [ ] 在 Teams 侧边栏固定 Bot
- [ ] 通知用户并提供培训
- [ ] 配置月度监控

---

## 附录 B：Power Automate 常用表达式

```
# 将日期格式化为 YYYYMMDD
formatDateTime(triggerBody()?['fecha'], 'yyyyMMdd')

# 用连字符连接字段
concat(campo1, '-', campo2, '-', campo3)

# 不区分大小写的文本搜索
contains(toLower(item()?['Descripcion']), toLower(variables('searchTerm')))

# 验证 YYYYMMDD 格式
and(
  equals(length(variables('fecha')), 8),
  greaterOrEquals(int(variables('fecha')), 19000101),
  lessOrEquals(int(variables('fecha')), 20991231)
)

# 从名称中提取各组件
split(variables('nombreArchivo'), '-')

# 验证版本格式有效（v + 数字）
startsWith(variables('version'), 'v')

# 获取当前日期（YYYYMMDD 格式）
formatDateTime(utcNow(), 'yyyyMMdd')
```

---

*本文档根据 Forvis Mazars 的 FORMAZ-PRO-01 v2.0 程序生成。*
