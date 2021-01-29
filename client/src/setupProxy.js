require('dotenv-expand')(require('dotenv').config());
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app)=> {
  app.use(
    '/auth',
    createProxyMiddleware({
      target: process.env.REACT_APP_PROXY_URL,
      changeOrigin: true,
    })
  );
};