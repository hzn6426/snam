<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { constant } from '@/common/utils';

const router = useRouter();

onMounted(() => {
  const token = sessionStorage.getItem(constant.KEY_USER_TOKEN);
  
  if (token) {
    // 用户已登录，保持当前路由
    if (router.currentRoute.value.path === '/user/login') {
      router.push('/');
    }
  } else {
    // 用户未登录，跳转到登录页
    if (router.currentRoute.value.path !== '/user/login') {
      router.push(constant.SYSTEM_ROUTE_LOGIN);
    }
  }
});
</script>

<style>
/* 全局样式 */
</style>

