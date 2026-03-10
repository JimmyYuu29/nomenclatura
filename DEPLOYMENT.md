# Nomenclatura App 部署指南

## 方案 A：Docker 部署（推荐）

### 前置条件
- Docker 20.10+
- Docker Compose v2+

### 部署步骤

```bash
# 克隆项目并进入目录
cd nomenclatura-app

# 一键构建并启动
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

### 访问地址
- `http://localhost:3080`

### 自定义端口
编辑 `docker-compose.yml`，修改 `ports` 映射：
```yaml
ports:
  - "8080:80"  # 改为 8080 端口
```

---

## 方案 B：Systemd + Nginx 部署

### 前置条件
- Node.js 22+（用于构建）
- Nginx
- Linux 服务器

### 部署步骤

#### 1. 构建项目
```bash
cd nomenclatura-app
npm ci
npm run build
```

#### 2. 复制静态文件
```bash
sudo mkdir -p /var/www/nomenclatura-app
sudo cp -r dist/* /var/www/nomenclatura-app/
sudo chown -R www-data:www-data /var/www/nomenclatura-app
```

#### 3. 配置 Nginx
```bash
# 复制站点配置
sudo cp nginx/nomenclatura.conf /etc/nginx/sites-available/nomenclatura

# 编辑配置，修改 server_name 为实际域名
sudo nano /etc/nginx/sites-available/nomenclatura

# 启用站点
sudo ln -s /etc/nginx/sites-available/nomenclatura /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

#### 4.（可选）使用 systemd 管理
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
| `Dockerfile` | 多阶段构建（Node 构建 + Nginx 服务） |
| `docker-compose.yml` | Docker 编排配置 |
| `.dockerignore` | Docker 构建排除列表 |
| `nginx/nginx.conf` | Docker 内 Nginx 配置 |
| `nginx/nomenclatura.conf` | 独立 Nginx 站点配置 |
| `nomenclatura-app.service` | systemd 单元文件 |
| `deploy.sh` | 自动化部署脚本 |
