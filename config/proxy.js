export default {
  dev: {
    '/authority/': {
      // target: 'http://erp.dsi-log.cn:2020/',
      target: 'http://127.0.0.1:8090/',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/core/': {
      //target: 'http://192.168.1.223:8070/',
      target: 'http://127.0.0.1:8090/',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
