# 第一阶段：构建阶段
FROM node:14 AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件并安装依赖
COPY package*.json ./
RUN npm install

# 复制源代码并构建应用
COPY . .
RUN npm run build

# 第二阶段：生产阶段
FROM nginx:1.21-alpine

# 将构建阶段生成的静态文件复制到 Nginx 服务器
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 默认的 HTTP 端口
EXPOSE 3000

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]