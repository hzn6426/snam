# SNAM - Vue 3 权限管理系统

## 项目简介

SNAM 是一个基于 Vue 3 + Element Plus 的企业级权限管理系统，提供完整的用户、角色、权限、组织架构管理功能。

本项目已从 React + Ant Design 架构重构为 Vue 3 + Element Plus 架构。

## 技术栈

- **前端框架**: Vue 3.4+ (Composition API)
- **UI 组件库**: Element Plus 2.5+
- **构建工具**: Vite 5.x
- **路由管理**: Vue Router 4.x
- **状态管理**: Pinia 2.x
- **HTTP 请求**: Axios + RxJS
- **工具库**: Lodash, Ramda, Dayjs

## 功能特性

- 🔐 完整的权限管理体系
- 👥 用户、角色、组织架构管理
- 📊 数据权限、列权限控制
- 🏢 多租户支持
- 📝 操作日志记录
- 🔄 工作流演示
- 🌍 国际化支持（待完善）

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd snam

# 安装依赖
npm install
# 或
yarn install
```

### 开发

```bash
# 启动开发服务器
npm run dev
# 或
yarn dev
```

访问 http://localhost:8000

### 构建

```bash
# 构建生产版本
npm run build
# 或
yarn build

# 预览生产构建
npm run preview
# 或
yarn preview
```

## 项目结构

```
snam/
├── public/                 # 静态资源
├── src/
│   ├── main.js            # 应用入口
│   ├── App.vue            # 根组件
│   ├── router/            # 路由配置
│   ├── layouts/           # 布局组件
│   ├── pages/             # 页面组件
│   ├── components/        # 公共组件
│   ├── common/            # 工具函数
│   └── assets/            # 资源文件
├── index.html             # HTML 模板
├── vite.config.js         # Vite 配置
└── package.json           # 项目配置
```

## 核心功能模块

### 系统管理
- 用户管理
- 角色管理
- 菜单管理
- 组织架构
- 用户组管理
- 职位管理
- 参数管理
- 字典管理

### 权限管理
- 授权管理
- 数据权限
- 列权限
- 按钮权限

### 日志管理
- 操作日志
- 接入日志
- 租户日志

### 租户管理
- 租户管理
- 租户菜单
- 租户用户
- 租户角色
- 租户组织

### 其他功能
- 工作流演示
- 提单演示
- 限流管理
- 接入用户管理

## 开发指南

### 代码规范

- 使用 Vue 3 Composition API
- 使用 `<script setup>` 语法
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 组件开发

```vue
<template>
  <div class="component-name">
    <!-- 组件内容 -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

// 组件逻辑
</script>

<style scoped>
/* 组件样式 */
</style>
```

### API 请求

```javascript
import { api } from '@/common/utils';

// 使用 RxJS 风格
api.user.searchUser(params).subscribe({
  next: (data) => {
    // 处理数据
  },
  error: (err) => {
    // 处理错误
  },
});
```

## 重构说明

本项目已从 React 架构重构为 Vue 3 架构，详细信息请查看：
- [迁移文档](./MIGRATION.md)
- [重构总结](./REFACTOR_SUMMARY.md)

所有原始 React 代码已保留为 `.tmp` 文件，可随时参考。

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

[Apache License 2.0](./APACHE-LICENSE)

## 更新日志

### v3.3.0 (2024-01-22)
- 🎉 项目从 React 重构为 Vue 3
- ✨ 使用 Element Plus 替换 Ant Design
- ⚡️ 使用 Vite 替换 UMI 构建工具
- 🔧 保留 axios 和 rxjs 请求方式
- 📝 创建所有页面的基础模板

### v3.2.0 (2023-12-01)
- 新增租户管理功能
- 优化权限管理模块

### v3.1.0 (2023-10-15)
- 新增工作流演示功能
- 优化用户界面

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。
