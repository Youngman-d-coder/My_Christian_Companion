# Deployment Guide

This guide covers deploying the My Christian Companion application to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Database Setup](#database-setup)
- [Security Checklist](#security-checklist)

---

## Prerequisites

### Required Tools
- Node.js 18+ 
- MongoDB 5.0+
- Git
- npm or yarn

### Production Requirements
- SSL/TLS certificate (HTTPS)
- Domain name (recommended)
- MongoDB Atlas or self-hosted MongoDB
- CDN for static assets (recommended)

---

## Environment Variables

### Server (.env)

Create `server/.env` with these **required** variables:

```env
# REQUIRED - Server Configuration
PORT=5000
NODE_ENV=production

# REQUIRED - Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/christian-companion?retryWrites=true&w=majority

# REQUIRED - Security (Generate with: openssl rand -base64 32)
JWT_SECRET=<your-super-secret-64-char-random-string>

# REQUIRED - CORS Configuration
CLIENT_URL=https://yourdomain.com

# Optional - Logging
LOG_LEVEL=info

# Optional - External APIs
BIBLE_API_KEY=your-api-key-if-using-external-bible-api
```

⚠️ **CRITICAL:** Never use default JWT_SECRET values in production!

### Client (.env)

Create `client/.env`:

```env
VITE_API_URL=https://api.yourdomain.com
```

---

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Create `docker-compose.yml` in project root:**

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: <strong-password>
    ports:
      - "27017:27017"

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=mongodb://admin:<strong-password>@mongodb:27017/christian-companion?authSource=admin
      - JWT_SECRET=${JWT_SECRET}
      - CLIENT_URL=https://yourdomain.com
    depends_on:
      - mongodb

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=https://api.yourdomain.com
    restart: always
    ports:
      - "80:80"
    depends_on:
      - server

volumes:
  mongodb_data:
```

2. **Create `server/Dockerfile`:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/index.js"]
```

3. **Create `client/Dockerfile`:**

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

4. **Create `client/nginx.conf`:**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

5. **Deploy:**

```bash
export JWT_SECRET=$(openssl rand -base64 32)
docker-compose up -d
```

---

## Cloud Platforms

### Heroku

#### Server Deployment

1. **Install Heroku CLI and login:**
```bash
heroku login
```

2. **Create app:**
```bash
cd server
heroku create my-christian-companion-api
```

3. **Add MongoDB:**
```bash
heroku addons:create mongolab:sandbox
```

4. **Set environment variables:**
```bash
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-frontend-url.herokuapp.com
```

5. **Deploy:**
```bash
git push heroku main
```

#### Client Deployment

1. **Create app:**
```bash
cd client
heroku create my-christian-companion-web
```

2. **Add buildpack:**
```bash
heroku buildpacks:add heroku/nodejs
```

3. **Set environment:**
```bash
heroku config:set VITE_API_URL=https://my-christian-companion-api.herokuapp.com
```

4. **Create `static.json` for SPA routing:**
```json
{
  "root": "dist",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}
```

5. **Deploy:**
```bash
git push heroku main
```

---

### Vercel (Client Only)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd client
vercel --prod
```

3. **Configure in Vercel Dashboard:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: `VITE_API_URL`

---

### Railway

1. **Connect GitHub repo to Railway**

2. **Add MongoDB:**
   - Click "New" → "Database" → "MongoDB"

3. **Configure Server Service:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

4. **Configure Client Service:**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Start Command: `npm run preview`
   - Add environment variables

---

### DigitalOcean App Platform

1. **Create App from GitHub**

2. **Configure Server:**
   - Type: Web Service
   - Source Directory: `server`
   - Build Command: `npm install`
   - Run Command: `npm start`
   - HTTP Port: 5000

3. **Configure Client:**
   - Type: Static Site
   - Source Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add MongoDB Managed Database**

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**

2. **Configure Network Access:**
   - Add your IP or allow access from anywhere (0.0.0.0/0)

3. **Create Database User:**
   - Username: `christian-companion`
   - Password: Generate strong password
   - Role: Read and write to any database

4. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<database>` with `christian-companion`

5. **Set Environment Variable:**
```bash
export MONGODB_URI="mongodb+srv://christian-companion:<password>@cluster.mongodb.net/christian-companion"
```

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
> use christian-companion
> db.createUser({
    user: "appuser",
    pwd: "<strong-password>",
    roles: ["readWrite"]
  })
```

---

## Security Checklist

Before deploying to production:

### Environment
- [ ] `NODE_ENV=production` is set
- [ ] Strong `JWT_SECRET` generated (32+ characters)
- [ ] No default/example secrets used
- [ ] All sensitive data in environment variables, not code
- [ ] `.env` files in `.gitignore`

### Server Security
- [ ] HTTPS/SSL enabled
- [ ] CORS properly configured with allowed origins
- [ ] Rate limiting active
- [ ] Input validation on all routes
- [ ] MongoDB connection string uses authentication
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens have reasonable expiration (7 days)

### Database
- [ ] MongoDB authentication enabled
- [ ] Strong database passwords
- [ ] Network access restricted to application servers
- [ ] Regular backups configured
- [ ] Indexes created for performance

### Monitoring
- [ ] Error logging configured (Winston)
- [ ] Health check endpoint responding
- [ ] Uptime monitoring set up
- [ ] Log rotation configured

### Client
- [ ] Environment-specific API URLs
- [ ] Service worker and PWA configured
- [ ] Assets compressed and optimized
- [ ] Analytics configured (optional)

---

## Troubleshooting

### Server won't start
```bash
# Check environment variables
node -e "console.log(process.env.JWT_SECRET)"

# Check MongoDB connection
mongosh "$MONGODB_URI"

# Check logs
tail -f logs/error.log
```

### Database connection fails
- Verify MongoDB URI format
- Check network access rules
- Confirm database user has correct permissions
- Test connection with `mongosh`

### CORS errors
- Verify `CLIENT_URL` matches your frontend domain
- Check browser console for specific origin
- Ensure HTTPS/HTTP protocol matches

### Rate limiting too strict
- Adjust limits in `server/src/index.js`
- Consider IP whitelisting for known clients

---

## Monitoring & Maintenance

### Health Checks
```bash
curl https://api.yourdomain.com/health
```

### Logs
```bash
# View error logs
tail -f server/logs/error.log

# View combined logs
tail -f server/logs/combined.log
```

### Database Backup
```bash
# MongoDB Atlas - automatic backups enabled by default

# Self-hosted
mongodump --uri="$MONGODB_URI" --out=/backups/$(date +%Y%m%d)
```

### Updates
```bash
# Pull latest code
git pull origin main

# Update dependencies
cd server && npm install
cd ../client && npm install

# Rebuild client
cd client && npm run build

# Restart services
pm2 restart all  # or docker-compose restart
```

---

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/Youngman-d-coder/My_Christian_Companion/issues)
- Review API logs
- Verify environment variables
- Test locally first

---

**Built with faith and love** ✝️ **for the global Christian community**
