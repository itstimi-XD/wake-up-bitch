# 백엔드 서버 배포 가이드

## 목차
1. [배포 옵션](#배포-옵션)
2. [환경 구성](#환경-구성)
3. [Docker 배포](#docker-배포)
4. [AWS 배포](#aws-배포)
5. [Heroku 배포](#heroku-배포)
6. [데이터베이스 설정](#데이터베이스-설정)
7. [도메인 및 SSL](#도메인-및-ssl)
8. [모니터링](#모니터링)

---

## 배포 옵션

### 1. 추천 배포 플랫폼

| 플랫폼 | 가격 | 난이도 | 추천도 |
|--------|------|--------|--------|
| **Heroku** | 무료~$7/월 | ⭐ 쉬움 | 🔥🔥🔥 초보자 추천 |
| **Railway** | 무료~$5/월 | ⭐⭐ 보통 | 🔥🔥🔥 추천 |
| **Render** | 무료~$7/월 | ⭐⭐ 보통 | 🔥🔥 추천 |
| **AWS EC2** | $5~20/월 | ⭐⭐⭐⭐ 어려움 | 🔥 확장성 높음 |
| **DigitalOcean** | $6~12/월 | ⭐⭐⭐ 중급 | 🔥🔥 추천 |

### 2. 우리 앱 추천

**초보자**: Heroku 또는 Railway (무료!)
**중급자**: AWS EC2 또는 DigitalOcean

이 가이드에서는 **Railway**와 **AWS EC2** 두 가지를 다룹니다.

---

## 환경 구성

### 1. 환경 변수 설정

배포 전 `.env` 파일 준비:

```bash
# .env
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

# Database (Production)
DB_HOST=your-db-host.com
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password
DB_DATABASE=wake_up_bitch_prod
DB_SYNCHRONIZE=false
DB_LOGGING=false

# Redis
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters
JWT_REFRESH_EXPIRATION=30d

# CORS
CORS_ORIGIN=https://your-app.com

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
```

**⚠️ 보안 주의사항:**
- `.env` 파일은 절대 Git에 커밋하지 말 것
- 강력한 비밀번호 사용
- 프로덕션 비밀키는 랜덤 생성

### 2. 비밀키 생성

```bash
# JWT 비밀키 생성 (최소 32자)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 또는 openssl 사용
openssl rand -hex 64
```

---

## Docker 배포

### 1. Dockerfile 생성

`backend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "run", "start:prod"]
```

### 2. Docker Compose

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    env_file:
      - ./backend/.env
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: wake_up_bitch
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: always

volumes:
  postgres_data:
  redis_data:
```

### 3. Docker 빌드 및 실행

```bash
# 빌드
docker-compose build

# 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f app

# 중지
docker-compose down
```

---

## Railway 배포 (가장 쉬움!)

### 1. Railway 가입

1. https://railway.app 접속
2. GitHub 계정으로 로그인
3. 무료 플랜 선택 ($5 무료 크레딧)

### 2. 새 프로젝트 생성

1. **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. wake-up-bitch 레포지토리 선택

### 3. 데이터베이스 추가

#### PostgreSQL 추가
1. **"New"** > **"Database"** > **"Add PostgreSQL"**
2. 자동으로 생성됨
3. 환경 변수 자동 설정

#### Redis 추가
1. **"New"** > **"Database"** > **"Add Redis"**
2. 자동으로 생성됨

### 4. 환경 변수 설정

**프로젝트** > **Variables**

```
NODE_ENV=production
PORT=${{RAILWAY_PRIVATE_PORT}}
JWT_SECRET=your-generated-secret
CORS_ORIGIN=*
```

Railway가 자동 설정하는 변수:
- `DATABASE_URL`
- `REDIS_URL`

### 5. 배포 설정

`railway.json` (프로젝트 루트):

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 6. 배포

1. GitHub에 푸시
2. Railway가 자동으로 감지 및 배포
3. 배포 완료 후 URL 확인

**배포 URL**: `https://your-app-production.up.railway.app`

---

## AWS EC2 배포

### 1. EC2 인스턴스 생성

1. **AWS Console** > **EC2** > **인스턴스 시작**

2. **AMI 선택**:
   - Ubuntu Server 22.04 LTS

3. **인스턴스 유형**:
   - t2.micro (무료 티어)
   - 또는 t3.small (프로덕션 권장)

4. **키 페어 생성**:
   - `wake-up-bitch-key.pem` 다운로드
   - 안전하게 보관

5. **보안 그룹 설정**:
   - SSH (22): 내 IP
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - Custom TCP (3000): 0.0.0.0/0

6. **스토리지**: 20GB

### 2. SSH 접속

```bash
# 키 파일 권한 설정
chmod 400 wake-up-bitch-key.pem

# EC2 접속
ssh -i wake-up-bitch-key.pem ubuntu@your-ec2-ip
```

### 3. 서버 환경 설정

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Node.js 설치 (18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 설치 (프로세스 매니저)
sudo npm install -g pm2

# Git 설치
sudo apt install -y git

# Nginx 설치 (리버스 프록시)
sudo apt install -y nginx
```

### 4. PostgreSQL 설치

```bash
# PostgreSQL 설치
sudo apt install -y postgresql postgresql-contrib

# PostgreSQL 시작
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 데이터베이스 생성
sudo -u postgres psql
```

PostgreSQL 콘솔에서:
```sql
CREATE DATABASE wake_up_bitch;
CREATE USER wakeup_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE wake_up_bitch TO wakeup_user;
\q
```

### 5. Redis 설치

```bash
sudo apt install -y redis-server

# Redis 비밀번호 설정
sudo nano /etc/redis/redis.conf
# 찾기: # requirepass foobared
# 변경: requirepass your_secure_password

# Redis 재시작
sudo systemctl restart redis
sudo systemctl enable redis
```

### 6. 앱 배포

```bash
# 프로젝트 클론
cd /home/ubuntu
git clone https://github.com/yourusername/wake-up-bitch.git
cd wake-up-bitch/backend

# 의존성 설치
npm ci

# 환경 변수 설정
nano .env
# 위의 환경 변수 내용 붙여넣기

# 빌드
npm run build

# PM2로 실행
pm2 start dist/main.js --name wake-up-bitch

# PM2 자동 시작 설정
pm2 startup
pm2 save
```

### 7. Nginx 설정

```bash
sudo nano /etc/nginx/sites-available/wake-up-bitch
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 설정 활성화
sudo ln -s /etc/nginx/sites-available/wake-up-bitch /etc/nginx/sites-enabled/

# Nginx 재시작
sudo nginx -t
sudo systemctl restart nginx
```

### 8. 배포 확인

```bash
# 앱 상태 확인
pm2 status

# 로그 확인
pm2 logs wake-up-bitch

# 재시작
pm2 restart wake-up-bitch
```

---

## 데이터베이스 마이그레이션

### 1. Migration 파일 생성

```bash
cd backend
npm run migration:generate -- src/infrastructure/database/migrations/InitialSchema
```

### 2. Migration 실행

```bash
npm run migration:run
```

### 3. Seed 데이터 추가

`backend/src/infrastructure/database/seeds/missions.seed.ts`:

```typescript
import { MissionType } from '@shared/enums';

export const missionsSeed = [
  {
    type: MissionType.BOSS_FIGHT,
    name: '보스 레이드',
    description: '아침은 전쟁! 보스를 물리쳐라',
    difficultyLevels: {
      easy: { hp: 50, tapRequired: 30 },
      medium: { hp: 100, tapRequired: 50 },
      hard: { hp: 200, tapRequired: 100 },
    },
    icon: '⚔️',
  },
  // ... 나머지 미션들
];
```

Seed 실행:
```bash
npm run seed
```

---

## 도메인 및 SSL

### 1. 도메인 구매

추천 도메인 등록 업체:
- **Namecheap** (저렴)
- **GoDaddy** (유명)
- **가비아** (한국)

가격: 약 $10~15/년

### 2. DNS 설정

도메인 관리 페이지에서:

**A 레코드 추가**:
```
Type: A
Host: @
Value: <EC2 IP 주소>
TTL: 3600
```

**CNAME 레코드** (www):
```
Type: CNAME
Host: www
Value: your-domain.com
TTL: 3600
```

### 3. SSL 인증서 (Let's Encrypt - 무료!)

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 이메일 입력 및 약관 동의

# 자동 갱신 설정 (인증서는 90일 유효)
sudo certbot renew --dry-run
```

Certbot이 자동으로:
- SSL 인증서 발급
- Nginx 설정 수정
- HTTP → HTTPS 리다이렉트 설정

### 4. 확인

https://your-domain.com 접속하여 확인

---

## 모니터링

### 1. PM2 모니터링

```bash
# 실시간 모니터링
pm2 monit

# 웹 대시보드
pm2 web
```

### 2. 로그 관리

```bash
# 로그 확인
pm2 logs

# 로그 파일 위치
~/.pm2/logs/

# 로그 삭제
pm2 flush
```

### 3. 서버 모니터링

#### htop 설치
```bash
sudo apt install -y htop
htop
```

#### New Relic (선택사항)
무료 플랜 제공: https://newrelic.com

---

## 업데이트 배포

### 1. 코드 업데이트

```bash
cd /home/ubuntu/wake-up-bitch
git pull origin main
cd backend
npm ci
npm run build
pm2 restart wake-up-bitch
```

### 2. 자동 배포 스크립트

`deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Deploying Wake Up Bitch Backend..."

cd /home/ubuntu/wake-up-bitch
git pull origin main

cd backend
npm ci
npm run build

echo "📦 Running migrations..."
npm run migration:run

echo "♻️ Restarting app..."
pm2 restart wake-up-bitch

echo "✅ Deployment complete!"
pm2 status
```

실행:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 백업

### 1. 데이터베이스 백업

```bash
# PostgreSQL 백업
pg_dump -U wakeup_user -d wake_up_bitch > backup_$(date +%Y%m%d).sql

# 복원
psql -U wakeup_user -d wake_up_bitch < backup_20241119.sql
```

### 2. 자동 백업 스크립트

`backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# DB 백업
pg_dump -U wakeup_user -d wake_up_bitch > $BACKUP_DIR/db_$DATE.sql

# 오래된 백업 삭제 (7일 이상)
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete

echo "Backup completed: db_$DATE.sql"
```

**Cron으로 자동 실행** (매일 새벽 2시):
```bash
crontab -e

# 추가:
0 2 * * * /home/ubuntu/backup.sh
```

---

## 문제 해결

### 앱이 실행되지 않을 때

```bash
# PM2 로그 확인
pm2 logs wake-up-bitch --lines 100

# 포트 확인
sudo lsof -i :3000

# 프로세스 재시작
pm2 restart wake-up-bitch
```

### 데이터베이스 연결 실패

```bash
# PostgreSQL 상태 확인
sudo systemctl status postgresql

# 연결 테스트
psql -U wakeup_user -d wake_up_bitch -h localhost
```

### Nginx 오류

```bash
# Nginx 로그
sudo tail -f /var/log/nginx/error.log

# 설정 테스트
sudo nginx -t

# 재시작
sudo systemctl restart nginx
```

---

## 체크리스트

배포 전:

- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 생성
- [ ] Redis 설정
- [ ] JWT 비밀키 생성
- [ ] CORS 설정 확인
- [ ] 프로덕션 빌드 테스트

배포 후:

- [ ] API 엔드포인트 테스트
- [ ] 데이터베이스 연결 확인
- [ ] SSL 인증서 적용
- [ ] 로그 모니터링 설정
- [ ] 백업 스크립트 설정

---

## 추가 리소스

- [NestJS 배포 가이드](https://docs.nestjs.com/faq/serverless)
- [PM2 문서](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx 가이드](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**성공적인 서버 운영을 기원합니다! 🚀**
