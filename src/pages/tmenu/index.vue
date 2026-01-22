<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>tmenu</span>
      </template>
      
      <div class="content">
        <!-- 页面内容 -->
        <p>此页面正在开发中...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '@/common/utils';

// 页面逻辑
onMounted(() => {
  // 初始化逻辑
});
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.content {
  padding: 20px;
}
</style>
