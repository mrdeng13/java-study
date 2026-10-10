import { defineConfig } from 'vite';

export default defineConfig({
  // 相对路径产出静态资源：部署到站点根目录、GitHub Pages 子路径（/仓库名/）、
  // 对象存储等任意位置都能加载（此前绝对路径 /assets/... 在子路径下会全部 404）
  base: './',
  server: {
    host: true, // 必需：允许外部访问
    allowedHosts: true, // 必需：跳过 Host Header 检查
    port: 8000,
    proxy: {
      // 将前端 /api 请求转发到 Spring Boot 后端（8080），避免跨域、也兼容任意预览域名
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
