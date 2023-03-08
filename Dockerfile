FROM node:18-alpine

# 设置工作目录
WORKDIR /usr/local/wmx_blog_server

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装 Node.js 依赖包
RUN npm install

# 复制源代码到工作目录
COPY . .

# 暴露容器的端口
EXPOSE 8080

# 定义容器启动命令
CMD [ "node", "server.js" ]