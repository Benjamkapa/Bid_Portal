const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://197.248.122.31:3000',
    //   "http://197.248.122.31:3000/api/admin/login"
      changeOrigin: true,
    })
  );
};