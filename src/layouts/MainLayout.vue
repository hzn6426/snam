<template>
  <el-config-provider :locale="locale">
    <el-container class="main-layout">
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
          <span>{{ systemTitle }}</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          @select="handleMenuSelect"
        >
          <template v-for="menu in menus" :key="menu.path">
            <el-sub-menu v-if="menu.children" :index="menu.path">
              <template #title>
                <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
                <span>{{ menu.name }}</span>
              </template>
              <el-menu-item
                v-for="child in menu.children"
                :key="child.path"
                :index="child.path"
              >
                {{ child.name }}
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="menu.path">
              <el-icon v-if="menu.icon"><component :is="menu.icon" /></el-icon>
              <span>{{ menu.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                v-for="item in breadcrumbs"
                :key="item.path"
                :to="{ path: item.path }"
              >
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <el-avatar :size="32">{{ userName }}</el-avatar>
                <span class="user-name">{{ userName }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { constant } from '@/common/utils';

const router = useRouter();
const route = useRoute();
const locale = zhCn;

const systemTitle = ref(constant.SYSTEM_TITLE || '系统管理平台');
const userName = ref('Admin');
const menus = ref([
  {
    path: '/dashboard/blog',
    name: '更新日志',
    icon: 'Document',
  },
  {
    path: '/system',
    name: '系统管理',
    icon: 'Setting',
    children: [
      { path: '/system/user', name: '用户管理' },
      { path: '/system/role', name: '角色管理' },
      { path: '/system/menu', name: '菜单管理' },
      { path: '/system/group', name: '组织架构' },
      { path: '/system/uset', name: '用户组' },
      { path: '/system/position', name: '职位管理' },
      { path: '/system/resource', name: '授权管理' },
      { path: '/system/logger', name: '日志管理' },
      { path: '/system/dictionary', name: '字典管理' },
      { path: '/system/param', name: '参数管理' },
      { path: '/system/pcolumn', name: '数据列' },
      { path: '/system/hmac', name: '接入用户' },
      { path: '/system/mlog', name: '接入日志' },
      { path: '/system/limit', name: '限流管理' },
      { path: '/system/tenant', name: '租户管理' },
      { path: '/system/tmenu', name: '租户菜单' },
      { path: '/system/tlog', name: '租户日志' },
      { path: '/system/tfunction', name: '租户接口' },
      { path: '/system/action', name: '权限动作' },
    ],
  },
]);

const activeMenu = computed(() => route.path);

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title);
  return matched.map(item => ({
    path: item.path,
    name: item.meta.title || item.name,
  }));
});

const handleMenuSelect = (index) => {
  router.push(index);
};

const handleCommand = (command) => {
  if (command === 'logout') {
    sessionStorage.removeItem(constant.KEY_USER_TOKEN);
    router.push('/user/login');
  } else if (command === 'profile') {
    // 跳转到个人信息页面
  }
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.sidebar {
  background: #001529;
  color: #fff;
}

.logo {
  display: flex;
  align-items: center;
  padding: 16px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 24px;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  margin-left: 8px;
}

.main-content {
  background: #f0f2f5;
  padding: 24px;
}
</style>

