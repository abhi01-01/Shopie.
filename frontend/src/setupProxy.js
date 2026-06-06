const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = process.env.API_PROXY_TARGET || 'http://localhost:4000';

  app.use(
    '/api/v1',
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
