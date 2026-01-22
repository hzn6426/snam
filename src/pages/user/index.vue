<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="realName" label="真实姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="handleSearch"
        style="margin-top: 20px; text-align: right"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { api } from '@/common/utils';

const loading = ref(false);
const tableData = ref([]);

const searchForm = reactive({
  userName: '',
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 查询数据
const handleSearch = () => {
  loading.value = true;
  
  const params = {
    ...searchForm,
    current: pagination.current,
    pageSize: pagination.pageSize,
  };
  
  api.user.searchUser(params).subscribe({
    next: (result) => {
      tableData.value = result.data || [];
      pagination.total = result.total || 0;
      loading.value = false;
    },
    error: (err) => {
      ElMessage.error('查询失败');
      loading.value = false;
    },
  });
};

// 重置
const handleReset = () => {
  searchForm.userName = '';
  pagination.current = 1;
  handleSearch();
};

// 新增
const handleAdd = () => {
  // 跳转到新增页面或打开弹窗
  window.open('/new/user/0', '新增用户', 'width=800,height=600');
};

// 编辑
const handleEdit = (row) => {
  window.open(`/new/user/${row.id}`, '编辑用户', 'width=800,height=600');
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    api.user.deleteUser(row.id).subscribe({
      next: () => {
        ElMessage.success('删除成功');
        handleSearch();
      },
      error: () => {
        ElMessage.error('删除失败');
      },
    });
  });
};

onMounted(() => {
  handleSearch();
});
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>

