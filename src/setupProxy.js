const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy pour les événements (port 8080)
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    })
  );

  // Proxy pour l'authentification (port 8181)
  app.use(
    '/user',
    createProxyMiddleware({
      target: 'http://localhost:8181',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    })
  );
}; 