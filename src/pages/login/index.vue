<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h1>{{ constant.SYSTEM_LOGIN_TITLE }}</h1>
        <p>{{ constant.SYSTEM_LOGIN_DESC }}</p>
      </div>
      
      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        :closable="false"
        style="margin-bottom: 24px"
      />
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        @submit.prevent="handleSubmit"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="userPasswd">
          <el-input
            v-model="loginForm.userPasswd"
            type="password"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
            @keyup.enter="handleSubmit"
          />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="loginForm.autoLogin">记住密码</el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            style="width: 100%"
            @click="handleSubmit"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { api, constant, isEmpty, md5 } from '@/common/utils';

const router = useRouter();
const loginFormRef = ref(null);
const loading = ref(false);
const errorMessage = ref('');

const loginForm = reactive({
  userName: '',
  userPasswd: '',
  autoLogin: false,
});

const rules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  userPasswd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
};

// 读取 Cookie
const getCookie = (name) => {
  const arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
  if (arr) return unescape(arr[2]);
  return null;
};

// 设置 Cookie
const setCookie = (name, value, days = 7) => {
  const exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
};

// 删除 Cookie
const deleteCookie = (name) => {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  document.cookie = name + '=;expires=' + exp.toGMTString();
};

// 初始化表单数据
onMounted(() => {
  const savedUserName = getCookie(constant.SYSTEM_AVATAR_NAME + 'userName');
  const savedPassword = getCookie(constant.SYSTEM_AVATAR_NAME + 'userPasswd');
  
  if (savedUserName) {
    loginForm.userName = savedUserName;
  }
  if (savedPassword) {
    loginForm.userPasswd = savedPassword;
    loginForm.autoLogin = true;
  }
});

// 处理登录
const handleSubmit = async () => {
  if (!loginFormRef.value) return;
  
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    loading.value = true;
    errorMessage.value = '';
    
    try {
      const params = {
        userName: loginForm.userName,
        userPasswd: md5(loginForm.userPasswd),
        originPassword: loginForm.userPasswd,
      };
      
      // 调用登录 API
      const subscription = api.user.login(params).subscribe({
        next: (data) => {
          if (data && data.token) {
            // 保存 token
            const token = `Bearer ${data.token}`;
            sessionStorage.setItem(constant.KEY_USER_TOKEN, token);
            
            // 记住密码
            if (loginForm.autoLogin) {
              setCookie(constant.SYSTEM_AVATAR_NAME + 'userName', loginForm.userName);
              setCookie(constant.SYSTEM_AVATAR_NAME + 'userPasswd', loginForm.userPasswd);
            } else {
              deleteCookie(constant.SYSTEM_AVATAR_NAME + 'userName');
              deleteCookie(constant.SYSTEM_AVATAR_NAME + 'userPasswd');
            }
            
            ElMessage.success('登录成功');
            router.push('/');
          } else {
            errorMessage.value = '登录失败，请检查用户名和密码';
          }
        },
        error: (err) => {
          errorMessage.value = err.message || '登录失败，请稍后重试';
          loading.value = false;
        },
        complete: () => {
          loading.value = false;
        },
      });
    } catch (error) {
      errorMessage.value = '登录失败，请稍后重试';
      loading.value = false;
    }
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #333;
}

.login-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}
</style>

