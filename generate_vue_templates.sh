#!/bin/bash

# 创建基础 Vue 模板的脚本
# 用于为所有页面生成基础的 Vue 文件

BASE_DIR="/Users/frog/projects/gitee/snam/src/pages"

# 定义需要创建的页面列表
declare -a pages=(
  "dict/index.vue"
  "dict/save/index.vue"
  "dict/child/index.vue"
  "menu/index.vue"
  "menu/save/index.vue"
  "menu/button/index.vue"
  "group/index.vue"
  "group/save/index.vue"
  "group/user/index.vue"
  "group/role/index.vue"
  "group/move/index.vue"
  "group/copy/index.vue"
  "group/company/index.vue"
  "uset/index.vue"
  "uset/save/index.vue"
  "uset/role/index.vue"
  "uset/user/index.vue"
  "position/index.vue"
  "position/save/index.vue"
  "position/role/index.vue"
  "param/index.vue"
  "param/save/index.vue"
  "logger/index.vue"
  "logger/detail/index.vue"
  "column/index.vue"
  "resource/index.vue"
  "hmac/index.vue"
  "hmac/save/index.vue"
  "mlogger/index.vue"
  "mlogger/detail/index.vue"
  "limit/index.vue"
  "limit/save/index.vue"
  "tenant/index.vue"
  "tenant/save/index.vue"
  "tenant/bill/index.vue"
  "tenant/charge/index.vue"
  "tenant/function/index.vue"
  "tenant/resource/index.vue"
  "tenant/perm/index.vue"
  "tmenu/index.vue"
  "tmenu/save/index.vue"
  "tmenu/button/index.vue"
  "tlog/index.vue"
  "tlog/detail/index.vue"
  "tfunction/index.vue"
  "tfunction/save/index.vue"
  "order/index.vue"
  "order/save/index.vue"
  "action/index.vue"
  "action/save/index.vue"
  "flow/index.vue"
  "user/save/index.vue"
  "user/resource/index.vue"
  "user/privilege/index.vue"
  "role/save/index.vue"
  "role/user/index.vue"
  "role/resource/index.vue"
  "tenant/user/index.vue"
  "tenant/user/save/index.vue"
  "tenant/role/index.vue"
  "tenant/role/save/index.vue"
  "tenant/role/user/index.vue"
  "tenant/role/resource/index.vue"
  "tenant/group/index.vue"
  "tenant/group/save/index.vue"
  "tenant/group/user/index.vue"
  "tenant/group/role/index.vue"
  "tenant/group/move/index.vue"
  "tenant/group/company/index.vue"
  "tenant/position/index.vue"
  "tenant/position/save/index.vue"
  "tenant/position/role/index.vue"
  "tenant/uset/index.vue"
  "tenant/uset/save/index.vue"
  "tenant/uset/role/index.vue"
  "tenant/uset/user/index.vue"
  "tenant/privilege/index.vue"
)

# 基础模板
read -r -d '' TEMPLATE << 'EOF'
<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>PAGE_TITLE</span>
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
EOF

# 创建文件
for page in "${pages[@]}"; do
  file_path="$BASE_DIR/$page"
  dir_path=$(dirname "$file_path")
  
  # 创建目录
  mkdir -p "$dir_path"
  
  # 如果文件不存在，则创建
  if [ ! -f "$file_path" ]; then
    # 从路径提取页面标题
    page_name=$(basename $(dirname "$page"))
    if [ "$page_name" = "pages" ]; then
      page_name=$(basename "$page" .vue)
    fi
    
    # 替换模板中的标题
    echo "$TEMPLATE" | sed "s/PAGE_TITLE/$page_name/" > "$file_path"
    echo "Created: $file_path"
  else
    echo "Skipped (exists): $file_path"
  fi
done

echo "Vue template generation completed!"
EOF

