# CraftBuilder Pro UI 设计规范 (Ant Design 版)

本文档定义了基于 Ant Design (antd) 的 CraftBuilder Pro 视觉语言和组件规范。

## 1. 视觉风格 (Visual Style)

### 设计哲学
- **企业级标准**: 采用 Ant Design 5.0 的设计体系，强调秩序感与效率。
- **现代化定制**: 通过 `ConfigProvider` 进行主题定制，保持品牌独特性。

### 色彩体系 (Colors)
通过 antd `theme.token` 配置。

| 颜色类型 | 值 | 用途 |
| :--- | :--- | :--- |
| **Primary** | `#4f46e5` (Indigo) | 核心操作、品牌主色 |
| **Border Radius** | `12px` | 全局圆角规范 |

---

## 2. 核心组件映射 (Component Mapping)

| 旧组件 | antd 组件 | 说明 |
| :--- | :--- | :--- |
| Button | `Button` | 支持 `type="primary"`, `ghost` 等多种内置变体 |
| Card | `Card` | 使用 `variant="borderless"` 或默认带边框模式 |
| Input | `Input` / `InputNumber` | 统一的表单交互体验 |
| Modal | `Modal` | 受控显示，支持 `destroyOnClose` |
| Select | `Select` | 支持搜索、过滤和远程数据加载 |

---

## 3. 交互与反馈 (Interaction)

- **表单验证**: 使用 `antd.Form` 的内置校验逻辑。
- **操作确认**: 使用 `Popconfirm` 替代原生 `confirm` 弹窗。
- **状态反馈**: 使用 `Empty` 展示空状态，`Badge` 展示数量。
- **动效**: antd 自带高性能 CSS 动画，结合 `framer-motion` 实现页面级过渡。

---

## 4. 图标规范
- **库**: `@ant-design/icons`.
- **风格**: 线框风格 (Outlined)，保持视觉轻量化。
