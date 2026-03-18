# Nomenclatura App — 内部服务器部署指南

本文档提供三种部署方式的完整操作手册，适用于企业内网 Linux 服务器。

---

## 目录

- [方案一：Docker 部署（推荐）](#方案一docker-部署推荐)
- [方案二：Systemd + Nginx 原生部署](#方案二systemd--nginx-原生部署)
- [方案三：仅 Systemd 部署（不使用 Nginx）](#方案三仅-systemd-部署不使用-nginx)
- [附录：项目文件说明](#附录项目文件说明)

---

## 方案一：Docker 部署（推荐）

> 适用于已安装 Docker 的服务器。无需手动安装 Node.js 或 Nginx，所有依赖由容器自包含。

### 1.1 前置条件

| 软件 | 最低版本 | 安装参考 |
|------|---------|---------|
| Docker Engine | 20.10+ | [docs.docker.com/engine/install](https://docs.docker.com/engine/install/) |
| Docker Compose | v2+ | 随 Docker Engine 一并安装 |

检查是否已安装：

```bash
docker --version
docker compose version
```

### 1.2 获取项目代码

**方式 A — 服务器可访问 Git 仓库：**

```bash
git clone <your-repo-url> /opt/nomenclatura-app
cd /opt/nomenclatura-app
```

**方式 B — 服务器无外网（离线部署）：**

在本地开发机上打包，然后通过 SCP/SFTP 上传：

```bash
# 本地机器
tar czf nomenclatura-app.tar.gz --exclude=node_modules --exclude=.git nomenclatura-app/
scp nomenclatura-app.tar.gz user@server-ip:/opt/

# 服务器
cd /opt
tar xzf nomenclatura-app.tar.gz
cd nomenclatura-app
```

### 1.3 了解项目自带的 Docker 配置

项目中已包含完整的 Docker 相关文件：

**`Dockerfile`** — 三阶段构建：

```
阶段 1 (frontend-build)：使用 node:22-alpine 安装依赖并执行 npm run build（前端）
阶段 2 (backend-build)：使用 node:22-alpine 安装后端依赖并编译 TypeScript（Express API）
阶段 3 (production)：使用 node:22-alpine + nginx，同时运行 Nginx（静态文件）和 Node.js（API 服务）
```

**`docker-compose.yml`** — 编排配置：

```yaml
services:
  nomenclatura-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nomenclatura-app
    ports:
      - "8003:80"          # 宿主机 8003 → 容器 80
    volumes:
      - /home/rootadmin/data/nomenclatura:/home/rootadmin/data/nomenclatura  # 数据库持久化
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

**`nginx/nginx.conf`** — 容器内 Nginx 配置（已包含 gzip 压缩、静态资源长缓存、SPA 路由回退、`/api/` 反向代理到 Node.js 后端）。

**`start.sh`** — 容器入口脚本，先启动 Nginx（daemon 模式），再启动 Node.js API 服务器。

### 1.3.1 数据库说明

V2.1 新增了 SQLite 数据库用于文件完整性验证和版本建议：

| 项目 | 说明 |
|------|------|
| 类型 | SQLite（通过 better-sqlite3） |
| 路径 | `/home/rootadmin/data/nomenclatura/nomenclatura.db` |
| 创建 | 应用启动时自动创建（如不存在） |
| 持久化 | 通过 Docker volume 挂载，容器重建不丢失数据 |
| 功能 | 记录文件 SHA-256 哈希值和命名，提供版本建议，检测内容变更 |
| 环境变量 | `DB_PATH` 可覆盖默认数据库目录 |

### 1.4 修改端口（可选）

默认映射端口为 `8003`。如需修改，编辑 `docker-compose.yml` 中的 `ports`：

```yaml
ports:
  - "80:80"       # 直接使用 80 端口
  # 或
  - "8080:80"     # 使用 8080 端口
```

### 1.5 构建并启动

```bash
# 构建镜像并以后台模式启动容器
docker compose up -d
```

> ⏱ 首次构建需下载基础镜像（node:22-alpine、nginx:alpine）并安装依赖，可能需要 3-5 分钟。

### 1.6 验证部署

```bash
# 查看容器状态（期望状态：Up (healthy)）
docker compose ps

# 测试 HTTP 响应
curl -I http://localhost:8003
# 应返回 HTTP/1.1 200 OK
```

在同一局域网内的浏览器中访问：

```
http://<服务器内网 IP>:8003
```

### 1.7 日常运维命令

```bash
# 查看实时日志
docker compose logs -f

# 停止服务
docker compose down

# 代码更新后重新构建并部署
docker compose up -d --build

# 清理旧的无用镜像（释放磁盘空间）
docker image prune -f
```

### 1.8 反向代理 HTTPS（可选但推荐）

如果需要 HTTPS 访问（Teams 集成必需），可在宿主机额外安装 Nginx 做反向代理：

```nginx
# /etc/nginx/sites-available/nomenclatura-proxy
server {
    listen 443 ssl;
    server_name nomenclatura.yourcompany.com;

    ssl_certificate     /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;

    location / {
        proxy_pass http://127.0.0.1:8003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name nomenclatura.yourcompany.com;
    return 301 https://$host$request_uri;
}
```

---

## 方案二：Systemd + Nginx 原生部署

> 适用于不使用 Docker 的传统服务器环境，直接将构建产物托管于系统 Nginx。

### 2.1 前置条件

| 软件 | 最低版本 | 用途 |
|------|---------|------|
| Node.js | 22+ | 构建前端资源（可在本地完成） |
| Nginx | 1.18+ | 托管静态文件 |
| Linux | Ubuntu 22.04 / Debian 12 / CentOS 8+ | 服务器操作系统 |

### 2.2 构建前端资源

> 💡 如果服务器上没有 Node.js 环境，可以在**本地开发机**上完成此步，再将 `dist` 目录上传到服务器。

```bash
cd nomenclatura-app

# 安装精确依赖
npm ci

# 构建生产环境产物
npm run build
```

构建完成后会生成 `dist/` 目录，包含所有优化后的静态文件（HTML、CSS、JS、图片等）。

### 2.3 部署静态文件到服务器

**如果在本地构建的**，先上传 `dist` 目录：

```bash
# 本地 → 服务器
scp -r dist/ user@server-ip:/tmp/nomenclatura-dist/
```

**在服务器上执行：**

```bash
# 创建 Web 目录
sudo mkdir -p /var/www/nomenclatura-app

# 拷贝构建产物
sudo cp -r /tmp/nomenclatura-dist/* /var/www/nomenclatura-app/
# 如果直接在服务器构建，则：
# sudo cp -r dist/* /var/www/nomenclatura-app/

# 设置正确的权限
sudo chown -R www-data:www-data /var/www/nomenclatura-app
sudo chmod -R 755 /var/www/nomenclatura-app
```

### 2.4 配置 Nginx

项目已提供了 Nginx 配置模板 `nginx/nomenclatura.conf`。

**步骤 1 — 复制配置文件：**

```bash
sudo cp nginx/nomenclatura.conf /etc/nginx/sites-available/nomenclatura
```

**步骤 2 — 修改配置：**

```bash
sudo nano /etc/nginx/sites-available/nomenclatura
```

需要修改的关键项：

```nginx
server {
    listen 80;
    server_name nomenclatura.yourcompany.com;  # ← 改为您的内网域名或 IP
    root /var/www/nomenclatura-app;             # ← 确认路径正确
    index index.html;

    # gzip 压缩（已预配置）
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript
               image/svg+xml;

    # 静态资源长缓存（已预配置）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 反向代理到 Node.js 后端（V2.1 新增）
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # SPA 路由回退（已预配置）
    location / {
        try_files $uri $uri/ /index.html;
    }

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }
}
```

**步骤 3 — 启用站点并生效：**

```bash
# 创建软链接启用站点
sudo ln -sf /etc/nginx/sites-available/nomenclatura /etc/nginx/sites-enabled/

# 移除默认站点（可选，避免冲突）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置语法
sudo nginx -t
# 期望输出：nginx: configuration file /etc/nginx/nginx.conf test is successful

# 重新加载 Nginx
sudo systemctl reload nginx
```

### 2.5 部署后端 API 服务

V2.1 新增了 Express.js 后端 API，需要单独部署和管理：

```bash
# 构建后端
cd server
npm ci
npm run build

# 复制后端文件到部署目录
sudo mkdir -p /opt/nomenclatura-api
sudo cp -r dist node_modules package.json /opt/nomenclatura-api/

# 创建后端 systemd 服务
sudo tee /etc/systemd/system/nomenclatura-api.service > /dev/null <<EOF
[Unit]
Description=Nomenclatura API Server
After=network.target

[Service]
Type=simple
User=rootadmin
WorkingDirectory=/opt/nomenclatura-api
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=5
Environment=PORT=3001
Environment=DB_PATH=/home/rootadmin/data/nomenclatura

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable nomenclatura-api
sudo systemctl start nomenclatura-api
```

> **重要：** Nginx 配置中需添加 API 反向代理块（参见 2.4 节配置中的 `/api/` location）。

### 2.6 配置 Systemd 服务管理 Nginx（可选）

项目提供了 systemd 服务文件 `nomenclatura-app.service`，可用来通过 systemctl 统一管理 Nginx 进程：

```bash
# 复制服务文件
sudo cp nomenclatura-app.service /etc/systemd/system/

# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 设置开机自启
sudo systemctl enable nomenclatura-app

# 启动服务
sudo systemctl start nomenclatura-app

# 查看状态
sudo systemctl status nomenclatura-app
```

### 2.6 配置 HTTPS（可选但推荐）

如果需要 HTTPS（Teams 集成所必需），在 Nginx 配置中添加 SSL：

```nginx
server {
    listen 443 ssl;
    server_name nomenclatura.yourcompany.com;

    ssl_certificate     /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;

    root /var/www/nomenclatura-app;
    index index.html;

    # ... 其余配置与 HTTP 版本相同 ...
}

# HTTP → HTTPS 重定向
server {
    listen 80;
    server_name nomenclatura.yourcompany.com;
    return 301 https://$host$request_uri;
}
```

### 2.7 使用自动化部署脚本

项目根目录提供了 `deploy.sh` 一键部署脚本，集成了上述的构建、拷贝、配置步骤：

```bash
# 赋予执行权限
chmod +x deploy.sh

# 执行部署（需要 sudo 权限）
./deploy.sh
```

脚本执行流程：

1. `npm ci` — 安装依赖
2. `npm run build` — 构建生产环境产物
3. 拷贝 `dist/*` 至 `/var/www/nomenclatura-app/`
4. 拷贝 Nginx 配置并建立软链接
5. 执行 `nginx -t` 测试后 `systemctl reload nginx`

### 2.8 验证部署

```bash
# 测试 HTTP 响应
curl -I http://localhost
# 应返回 HTTP/1.1 200 OK

# 查看 Nginx 状态
sudo systemctl status nginx
```

在局域网浏览器中访问：

```
http://<服务器内网 IP>
# 或
http://nomenclatura.yourcompany.com
```

---

## 方案三：仅 Systemd 部署（不使用 Nginx）

> 最轻量的部署方式。服务器上仅需 Node.js，使用 `serve`（一个零配置的静态文件服务器）直接托管构建产物，并通过 systemd 管理进程生命周期。
>
> **适用场景：** 服务器未安装且不方便安装 Nginx；仅需快速上线内部工具；用户量较少（< 100 并发）。

### 3.1 前置条件

| 软件 | 最低版本 | 用途 |
|------|---------|------|
| Node.js | 22+ | 构建前端资源 + 运行 `serve` 静态服务器 |
| npm | 10+ | 随 Node.js 一起安装 |
| Linux | Ubuntu 22.04 / Debian 12 / CentOS 8+ | 服务器操作系统 |

在服务器上确认 Node.js 已安装：

```bash
node --version   # 期望 v22.x.x 或更高
npm --version    # 期望 10.x.x 或更高
```

如尚未安装，可使用 NodeSource 快速安装：

```bash
# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS / RHEL
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs
```

### 3.2 构建前端资源

```bash
cd /opt/nomenclatura-app

# 安装项目依赖
npm ci

# 构建生产环境静态资源
npm run build
```

构建完成后生成 `dist/` 目录。

### 3.3 安装 `serve` 静态文件服务器

[serve](https://github.com/vercel/serve) 是由 Vercel 维护的零配置静态文件服务工具，专为 SPA 设计，原生支持路由回退。

```bash
# 全局安装 serve
sudo npm install -g serve

# 验证安装
serve --version
```

### 3.4 手动测试运行

在正式配置 systemd 之前，先手动启动确认能正常访问：

```bash
# 使用 serve 托管 dist 目录
# -s 启用 SPA 模式（所有路由回退到 index.html）
# -l 指定监听端口
serve -s dist -l 8003
```

在浏览器中访问 `http://<服务器 IP>:8003`，确认页面正常加载后按 `Ctrl+C` 停止。

### 3.5 创建 Systemd 服务

创建一个专用的 systemd service 文件，让 `serve` 在后台持续运行并开机自启。

```bash
sudo nano /etc/systemd/system/nomenclatura.service
```

写入以下内容：

```ini
[Unit]
Description=Nomenclatura App (serve static files)
After=network.target

[Service]
Type=simple
User=rootadmin
Group=rootadmin
WorkingDirectory=/home/rootadmin/portal-suite/nomenclatura
ExecStart=/usr/local/bin/serve -s dist -l 8003
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

# segridad
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/home/rootadmin/portal-suite/nomenclatura

[Install]
WantedBy=multi-user.target
```

> **端口说明：** 上述配置使用 `8003` 端口。如需使用 `80` 端口，将 `-l 8003` 改为 `-l 80`，并将 `User` 改为 `root`（或使用 `setcap` 授权非 root 用户绑定低端口）。

> **`serve` 路径说明：** `ExecStart` 中的 `/usr/bin/serve` 是全局安装后的默认路径。如果不确定，可运行 `which serve` 获取实际路径并替换。

### 3.6 设置文件权限

```bash
# 确保 www-data 用户能读取项目目录
sudo chown -R www-data:www-data /opt/nomenclatura-app
sudo chmod -R 755 /opt/nomenclatura-app
```

### 3.7 启动并启用服务

```bash
# 重新加载 systemd 配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start nomenclatura

# 设置开机自启
sudo systemctl enable nomenclatura

# 查看运行状态
sudo systemctl status nomenclatura
```

期望输出中包含 `Active: active (running)`。

### 3.8 验证部署

```bash
# 测试 HTTP 响应
curl -I http://localhost:8003
# 应返回 HTTP/1.1 200 OK
```

在局域网浏览器中访问：

```
http://<服务器内网 IP>:8003
```

### 3.9 日常运维命令

```bash
# 查看服务状态
sudo systemctl status nomenclatura-serve

# 查看实时日志
sudo journalctl -u nomenclatura-serve -f

# 查看最近 50 行日志
sudo journalctl -u nomenclatura-serve -n 50

# 重启服务
sudo systemctl restart nomenclatura-serve

# 停止服务
sudo systemctl stop nomenclatura-serve
```

### 3.10 代码更新流程

当应用代码有更新时，执行以下步骤：

```bash
cd /opt/nomenclatura-app

# 拉取最新代码（如使用 Git）
git pull

# 重新安装依赖并构建
npm ci
npm run build

# 重启服务使新构建生效
sudo systemctl restart nomenclatura-serve
```

---

### 3.11 后续添加 Nginx 反向代理

当您的应用规模扩大或需要以下功能时，建议在 `serve` 前方加入 Nginx 反向代理层：

| 需求 | 说明 |
|------|------|
| **HTTPS / SSL** | Teams 集成必需，也是生产环境安全最佳实践 |
| **gzip / Brotli 压缩** | 减小传输体积，加速页面加载 |
| **静态资源缓存** | 利用 Nginx 的高效缓存策略降低服务器负载 |
| **访问控制** | IP 白名单、Rate Limiting 等安全防护 |
| **多应用复用端口** | 通过虚拟主机让多个应用共享 80/443 端口 |

#### 步骤 1 — 安装 Nginx

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install -y nginx

# CentOS / RHEL
sudo yum install -y nginx
```

#### 步骤 2 — 创建反向代理配置

```bash
sudo nano /etc/nginx/sites-available/nomenclatura
```

写入以下配置（将请求转发到 `serve` 监听的 8003 端口）：

```nginx
server {
    listen 80;
    server_name nomenclatura.yourcompany.com;  # 改为您的内网域名或 IP

    # gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript
               image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:8003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 步骤 3 — 启用站点

```bash
# 创建软链接
sudo ln -sf /etc/nginx/sites-available/nomenclatura /etc/nginx/sites-enabled/

# 移除默认站点（可选）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重新加载
sudo systemctl reload nginx
```

#### 步骤 4 — 添加 HTTPS（如需要）

将 Nginx 配置替换为 SSL 版本：

```nginx
server {
    listen 443 ssl;
    server_name nomenclatura.yourcompany.com;

    ssl_certificate     /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript
               image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:8003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# HTTP 自动跳转 HTTPS
server {
    listen 80;
    server_name nomenclatura.yourcompany.com;
    return 301 https://$host$request_uri;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

#### 步骤 5 — 安全加固：限制 `serve` 仅监听 localhost

添加 Nginx 反代后，`serve` 不再需要对外暴露端口。修改 systemd 服务文件：

```bash
sudo nano /etc/systemd/system/nomenclatura-serve.service
```

将 `ExecStart` 行改为仅监听 `127.0.0.1`：

```ini
ExecStart=/usr/bin/serve -s dist -l tcp://127.0.0.1:8003
```

重新加载并重启：

```bash
sudo systemctl daemon-reload
sudo systemctl restart nomenclatura-serve
```

此时外部用户只能通过 Nginx（80/443 端口）访问应用，8003 端口仅对本机可达。

> **切换完成！** 至此您已从「仅 Systemd」方案平滑升级为「Systemd + Nginx 反代」的完整生产架构，原有的 systemd 服务无需卸载重装。

---

## 附录：项目文件说明

| 文件 | 用途 |
|------|------|
| `Dockerfile` | 三阶段构建（前端构建 + 后端构建 + Node.js+Nginx 生产镜像） |
| `docker-compose.yml` | Docker 编排配置，定义端口映射、健康检查和数据库 volume 挂载 |
| `start.sh` | Docker 容器入口脚本（启动 Nginx + Node.js） |
| `.dockerignore` | Docker 构建时排除的文件列表 |
| `nginx/nginx.conf` | Docker 容器内使用的 Nginx 配置（含 `/api/` 反向代理） |
| `nginx/nomenclatura.conf` | 方案二使用的独立 Nginx 站点配置模板 |
| `nomenclatura-app.service` | 方案二的 systemd 服务单元文件（管理 Nginx） |
| `server/` | Express.js 后端 API 目录（SQLite 数据库管理、文件记录存储与验证） |
| `deploy.sh` | 方案二的自动化部署脚本 |
| `serve`（全局 npm 包） | 方案三使用的零配置 SPA 静态文件服务器 |
