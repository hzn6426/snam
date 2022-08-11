import { defineConfig } from 'umi'
import settings from './defaultSettings'
import router from './router'
import proxy from './proxy'
const { REACT_APP_ENV } = process.env
export default defineConfig({
  mfsu: {},
  dynamicImport: {
    loading: '@/components/PageLoading/index'
  },
  routes: router,
  ignoreMomentLocale: true,
  theme: {
    'primary-color': settings.primaryColor
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: false
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/'
  }
})
