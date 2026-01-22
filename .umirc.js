import { defineConfig } from '@umijs/max';
import proxy from './config/proxy';
import routes from './config/router';

export default defineConfig({
  // 路由配置
  routes,
  
  // 代理配置
  proxy: proxy[process.env.UMI_ENV || 'dev'],
  
  // 标题
  title: false,
  
  // 忽略 moment 的 locale 文件，用于减少尺寸
  ignoreMomentLocale: true,
  
  // 开启 hash 模式
  hash: true,
  
  // 配置 publicPath
  publicPath: '/',
  
  // 配置 outputPath
  outputPath: 'dist',
  
  // 配置主题
  theme: {},
  
  // 禁用 MFSU 以避免依赖解析问题
  mfsu: false,
});

