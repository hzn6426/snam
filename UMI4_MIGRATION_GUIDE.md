# Umi 4 迁移指南

本文档记录了从 Umi 3 迁移到 Umi 4 的所有更改。

## 主要变更

### 1. 配置文件变更

#### 从 `config/config.js` 迁移到 `.umirc.js`

Umi 4 配置文件主要变更：

- ✅ 使用 `.umirc.js` 替代 `config/config.js`
- ✅ `mfsu` 配置更新为 `{ strategy: 'normal' }`
- ✅ `locale.antd` 需要设置为 `true`（Umi 4 中必须）
- ✅ 新增 `antd` 配置项用于 antd 6.x
- ✅ 使用 `moment2dayjs` 替代 `ignoreMomentLocale`
- ✅ 移除 `dynamicImport`，使用 `codeSplitting` 替代

### 2. 路由配置变更

#### 组件路径格式

Umi 3:
```javascript
component: './user'
component: '../layouts/MainLayout'
```

Umi 4:
```javascript
component: '@/pages/user'
component: '@/layouts/MainLayout'
```

**所有路由组件路径已更新为使用 `@/` 别名。**

### 3. 运行时配置

#### 从 `src/global.jsx` 迁移到 `src/app.js`

Umi 4 使用新的运行时配置 API：

- ✅ 创建 `src/app.js` 文件
- ✅ 使用 `getInitialState` 进行初始化
- ✅ 使用 `onRouteChange` 处理路由变化
- ✅ 移除 `src/global.jsx`（保留样式导入）

### 4. 导入语句更新

#### history 和 Link 导入

Umi 3:
```javascript
import { history, Link } from 'umi';
```

Umi 4:
```javascript
import { history, Link, Outlet, useLocation } from '@umijs/max';
```

**已更新的文件：**
- ✅ `src/layouts/ProMainLayout.js`
- ✅ `src/layouts/MainLayout.js`
- ✅ `src/layouts/UserLayout.js`
- ✅ `src/layouts/WindowLayout.jsx`
- ✅ `src/components/GlobalHeader/AvatarDropdown.jsx`

### 5. 布局组件更新

#### 使用 Outlet 替代 props.children

Umi 3:
```javascript
export default (props) => {
  return <div>{props.children}</div>
}
```

Umi 4:
```javascript
import { Outlet } from '@umijs/max';

export default (props) => {
  return <div><Outlet /></div>
}
```

**已更新的布局文件：**
- ✅ `src/layouts/MainLayout.js`
- ✅ `src/layouts/ProMainLayout.js`
- ✅ `src/layouts/UserLayout.js`
- ✅ `src/layouts/WindowLayout.jsx`

### 6. 路由信息获取

#### 使用 useLocation 替代 props.location

Umi 3:
```javascript
export default (props) => {
  const pathname = props.location.pathname;
}
```

Umi 4:
```javascript
import { useLocation } from '@umijs/max';

export default (props) => {
  const location = useLocation();
  const pathname = location.pathname;
}
```

### 7. 配置文件

新增文件：
- ✅ `.umirc.js` - Umi 4 主配置文件
- ✅ `src/app.js` - 运行时配置文件

### 8. 依赖包更新

#### package.json 主要更新

**核心依赖：**
- `umi`: `^3.5.23` → `^4.3.41`
- `antd`: `^6.2.0` → `^6.2.1`
- `react`: `^18.0.0` → `^18.3.1`
- `react-dom`: `^18.0.0` → `^18.3.1`

**其他重要更新：**
- `@ant-design/pro-layout`: `^7.15.2` → `^7.21.8`
- `ag-grid-community/react`: `28.0.0` → `^32.3.3`
- `axios`: `^0.27.2` → `^1.7.9`
- `react-activation`: `0.9.12` → `^0.12.4`

**开发依赖：**
- `@umijs/fabric`: `^2.3.0` → `^4.0.1`
- `@umijs/lint`: 新增 `^4.3.41`
- `lint-staged`: `^10.0.0` → `^15.2.11`

### 9. 构建脚本更新

#### package.json scripts

```json
{
  "scripts": {
    "start": "cross-env UMI_ENV=dev umi dev",
    "build": "cross-env max_old_space_size=4096 ANALYZE=1 umi build"
  }
}
```

**变更说明：**
- ✅ 移除 `NODE_OPTIONS=--openssl-legacy-provider`（Node.js 新版本不需要）
- ✅ 保留 `UMI_ENV` 环境变量支持

### 10. React 18 兼容性

Umi 4 完全支持 React 18 的新特性：

- ✅ 并发渲染（Concurrent Rendering）
- ✅ 自动批处理（Automatic Batching）
- ✅ Transitions API
- ✅ Suspense 改进

配置项：
```typescript
react: {
  strictMode: false, // 根据需要开启严格模式
}
```

## 迁移步骤

### 第一步：安装依赖

```bash
# 删除旧的依赖
rm -rf node_modules package-lock.json yarn.lock

# 安装新依赖
npm install
# 或
yarn install
```

### 第二步：检查配置

1. 确认 `.umirc.js` 配置正确
2. 确认 `src/app.js` 运行时配置正确

### 第三步：更新代码

1. 检查所有 `from 'umi'` 导入，更新为 `from '@umijs/max'`
2. 检查所有布局组件，确保使用 `<Outlet />`
3. 检查路由配置，确保使用 `@/` 路径别名

### 第四步：测试运行

```bash
# 开发环境
npm start

# 生产构建
npm run build
```

## 常见问题

### 1. 找不到模块错误

**问题：** `Cannot find module 'umi'`

**解决：** 将所有 `from 'umi'` 更新为 `from '@umijs/max'`

### 2. 路由组件不显示

**问题：** 页面空白，组件不渲染

**解决：** 确保布局组件使用 `<Outlet />` 而不是 `props.children`

### 3. antd 样式问题

**问题：** antd 组件样式不正确

**解决：** 确保 `.umirc.js` 中 `locale.antd` 设置为 `true`

### 4. 模块导入错误

**问题：** 找不到模块或导入错误

**解决：** 
- 确保所有 `from 'umi'` 更新为 `from '@umijs/max'`
- 检查路径别名 `@/` 是否正确使用

## 性能优化建议

### 1. MFSU 配置

Umi 4 的 MFSU 性能更好：

```typescript
mfsu: {
  strategy: 'normal', // 或 'eager'
}
```

### 2. 代码拆分

```javascript
codeSplitting: {
  jsStrategy: 'granularChunks',
}
```

### 3. esbuild 压缩

```javascript
jsMinifier: 'esbuild',
cssMinifier: 'esbuild',
```

## 参考资源

- [Umi 4 官方文档](https://umijs.org/)
- [Umi 4 迁移指南](https://umijs.org/docs/guides/upgrade-to-umi-4)
- [Ant Design 6.x 文档](https://ant.design/)
- [React 18 文档](https://react.dev/)

## 注意事项

1. **备份代码**：迁移前务必备份或提交代码
2. **逐步测试**：建议分模块测试功能
3. **依赖兼容**：检查第三方依赖是否支持 React 18
4. **浏览器兼容**：Umi 4 默认不支持 IE11

## 完成清单

- [x] 更新 package.json 依赖
- [x] 创建 .umirc.js 配置文件
- [x] 创建 src/app.js 运行时配置
- [x] 更新路由配置（router.js）
- [x] 更新布局组件（MainLayout, ProMainLayout, UserLayout, WindowLayout）
- [x] 更新导入语句（history, Link, Outlet）
- [x] 更新 AvatarDropdown 组件
- [ ] 测试所有页面功能
- [ ] 测试生产构建
- [ ] 性能测试和优化

## 后续工作

1. 测试所有页面功能
2. 利用 React 18 新特性优化性能
3. 性能优化和代码审查
4. 更新测试用例

