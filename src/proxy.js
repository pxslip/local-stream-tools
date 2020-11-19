import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

/**
 * Initialize a proxy server that loads different parts of this application in a way OBS can read
 */
export default function() {
  const proxy = createProxyMiddleware({
    target: 'lst://./index.html',
    changeOrigin: true,
  });

  const app = express();

  app.use('/', proxy);
  app.listen(30303);
}
