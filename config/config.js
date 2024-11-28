import { defineConfig } from 'umi';
import proxy from './proxy';
import router from './router';
const { REACT_ENV } = process.env;
export default defineConfig({
  mfsu: {},
  dynamicImport: {
    loading: '@/components/PageLoading',
  },
  routes: router,
  ignoreMomentLocale: true,
  locale: {
    default: 'zh-CN',
    antd: false,
    baseNavigator: false,
  },
  proxy: proxy[REACT_ENV || 'dev'],
  // workerLoader:{}
})