# Nomenclatura App 部署指南

## 方案 A：Docker 部署（推荐）

### 前置条件
- Docker 20.10+
- Docker Compose v2+

### 部署步骤

```bash
# 克隆项目并进入目录
cd nomenclatura-app

# 一键构建并启动（包含前端 + 后端 API + Nginx）
docker compose up -d

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f

# 停止服务
docker compose down

# 重新构建并启动（代码更新后）
docker compose up -d --build
```

### 容器架构

Docker 容器内运行两个进程：
- **Nginx**（端口 80）：托管前端静态文件，并将 `/api/*` 请求反向代理到后端
- **Node.js Express**（端口 3001）：提供 API 服务，连接 SQLite 数据库

### 数据库

- 数据库路径：`/home/rootadmin/data/nomenclatura/nomenclatura.db`
- 通过 Docker volume 挂载持久化，容器重建不会丢失数据
- 首次启动时自动创建数据库和表结构

### 访问地址
- `http://localhost:8003`

### 自定义端口
编辑 `docker-compose.yml`，修改 `ports` 映射：
```yaml
ports:
  - "8080:80"  # 改为 8080 端口
```

---

## 方案 B：Systemd + Nginx 部署

### 前置条件
- Node.js 22+（用于构建和运行后端）
- Nginx
- Linux 服务器

### 部署步骤

#### 1. 构建前端
```bash
cd nomenclatura-app
npm ci
npm run build
```

#### 2. 构建后端
```bash
cd server
npm ci
npm run build
```

#### 3. 复制静态文件
```bash
sudo mkdir -p /var/www/nomenclatura-app
sudo cp -r dist/* /var/www/nomenclatura-app/
sudo chown -R www-data:www-data /var/www/nomenclatura-app
```

#### 4. 部署后端 API
```bash
sudo mkdir -p /opt/nomenclatura-api
sudo cp -r server/dist server/node_modules server/package.json /opt/nomenclatura-api/
```

#### 5. 创建后端 systemd 服务
```bash
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

#### 6. 配置 Nginx
```bash
# 复制站点配置
sudo cp nginx/nomenclatura.conf /etc/nginx/sites-available/nomenclatura

# 编辑配置，确保包含 API 代理块：
# location /api/ {
#     proxy_pass http://127.0.0.1:3001;
#     proxy_set_header Host $host;
#     proxy_set_header X-Real-IP $remote_addr;
# }

# 启用站点
sudo ln -s /etc/nginx/sites-available/nomenclatura /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

#### 7.（可选）使用 systemd 管理前端 Nginx
```bash
sudo cp nomenclatura-app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable nomenclatura-app
sudo systemctl start nomenclatura-app
```

### 自动化部署脚本
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 文件说明

| 文件 | 用途 |
|------|------|
| `Dockerfile` | 三阶段构建（前端构建 + 后端构建 + Node.js+Nginx 生产镜像） |
| `docker-compose.yml` | Docker 编排配置，包含数据库目录 volume 挂载 |
| `start.sh` | Docker 容器入口脚本，启动 Nginx 和 Node.js |
| `.dockerignore` | Docker 构建排除列表 |
| `nginx/nginx.conf` | Docker 内 Nginx 配置（含 /api 反向代理） |
| `nginx/nomenclatura.conf` | 独立 Nginx 站点配置 |
| `nomenclatura-app.service` | systemd 单元文件 |
| `deploy.sh` | 自动化部署脚本 |
| `server/` | Express.js 后端 API（SQLite 数据库管理） |

## 数据库说明

| 项目 | 说明 |
|------|------|
| 类型 | SQLite（通过 better-sqlite3） |
| 路径 | `/home/rootadmin/data/nomenclatura/nomenclatura.db` |
| 创建 | 应用启动时自动创建（如不存在） |
| 功能 | 存储文件 hash + 名称记录，版本建议，完整性验证 |
| 环境变量 | `DB_PATH` 可覆盖默认数据库目录 |
