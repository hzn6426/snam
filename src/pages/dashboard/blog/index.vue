<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>更新日志</span>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in logs"
          :key="index"
          :timestamp="item.date"
          placement="top"
        >
          <el-card>
            <h4>{{ item.version }}</h4>
            <ul>
              <li v-for="(log, idx) in item.logs" :key="idx">{{ log }}</li>
            </ul>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const logs = ref([
  {
    version: 'v3.3.0',
    date: '2024-01-22',
    logs: [
      '项目从 React + Ant Design 重构为 Vue 3 + Element Plus',
      '使用 Vite 作为构建工具，提升开发体验',
      '保留 axios 和 rxjs 进行数据请求',
      '优化路由配置，使用 Vue Router 4',
      '使用 Pinia 进行状态管理',
    ],
  },
  {
    version: 'v3.2.0',
    date: '2023-12-01',
    logs: [
      '新增租户管理功能',
      '优化权限管理模块',
      '修复已知问题',
    ],
  },
  {
    version: 'v3.1.0',
    date: '2023-10-15',
    logs: [
      '新增工作流演示功能',
      '优化用户界面',
      '提升系统性能',
    ],
  },
]);
</script>

<style scoped>
.page-container {
  padding: 20px;
}
</style>

