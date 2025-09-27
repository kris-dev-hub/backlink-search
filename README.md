# Backlink Search Frontend

A modern Vue.js frontend for searching backlinks across 2 billion pages scanned monthly. Built with Vue 3, TypeScript, PrimeVue, and Tailwind CSS.

![Vue.js](https://img.shields.io/badge/Vue.js-3.4+-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)

## 🌟 Features

- **Domain Backlink Search**: Search backlinks for any domain with real-time results
- **Advanced Filtering**: Filter by link URL, source host/path, anchor text, nofollow status, and IP
- **Export Capabilities**: Export results to CSV, Excel, and PDF formats
- **Direct Domain URLs**: Support for shareable links like `/domain/example.com`
- **Mobile-First Design**: Responsive interface optimized for all device sizes
- **Real-time Search**: Instant results with debounced input and smart filtering
- **SEO Optimized**: Canonical URLs and proper meta tags for search engines

## 🚀 Quick Start

### Prerequisites

- **Backend API**: GlobalLinks backend running on http://localhost:8010
- **For Development**: Node.js 18+
- **For Production**: Docker (recommended)

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173/dev/backlink-search in your browser
```

### Environment Configuration

```bash
# Copy example environment file
cp .env.example .env.local

# Configure your API endpoint
echo "VITE_APP_API_BASE_URL=http://localhost:8010" > .env.local
```

## 🐳 Docker Deployment (Recommended)

The application is available as a Docker container with automatic builds on tags, optimized for production use.

### 🔐 Authentication Required

Since this is a **private repository**, authenticate with GitHub Container Registry:

```bash
# Login to GitHub Container Registry
docker login ghcr.io
# Username: your-github-username
# Password: your-github-personal-access-token (with read:packages scope)
```

### 📦 Available Images

```bash
# Latest stable release
ghcr.io/kris-dev-hub/backlink-search:latest

# Specific versions
ghcr.io/kris-dev-hub/backlink-search:v1.0.0
```

### 🚀 Quick Deploy

**Standalone Frontend:**
```bash
# Pull and run the frontend
docker pull ghcr.io/kris-dev-hub/backlink-search:latest

docker run -d \
  --name backlink-search-frontend \
  -p 3000:3000 \
  ghcr.io/kris-dev-hub/backlink-search:latest
```

**With Backend Connection:**
```bash
# Start backend first (adjust as needed for your backend)
docker run -d \
  --name backlink-search-backend \
  -p 8010:8010 \
  your-backend-image:latest

# Start frontend with backend connection
docker run -d \
  --name backlink-search-frontend \
  -p 3000:3000 \
  -e BACKEND_URL=http://backlink-search-backend:8010 \
  --link backlink-search-backend:backend \
  ghcr.io/kris-dev-hub/backlink-search:latest
```

**Custom Port:**
```bash
# Run on different host port
docker run -d \
  --name backlink-search-frontend \
  -p 8080:3000 \
  ghcr.io/kris-dev-hub/backlink-search:latest

# Access at http://localhost:8080
```

**Docker Compose (Complete Stack):**
```yaml
version: '3.8'
services:
  backend:
    image: your-backend-image:latest
    ports:
      - "8010:8010"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8010/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: ghcr.io/kris-dev-hub/backlink-search:latest
    ports:
      - "3000:3000"
    environment:
      - BACKEND_URL=http://backend:8010
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 5s
      retries: 3
```

### 🔧 Environment Variables

**Runtime Configuration:**
- `BACKEND_URL` - Backend API URL (default: `http://localhost:8010`)

**Docker Examples:**
```bash
# Local backend
docker run -d \
  --name backlink-search-frontend \
  -p 3000:3000 \
  -e BACKEND_URL=http://localhost:8010 \
  ghcr.io/kris-dev-hub/backlink-search:latest

# Kubernetes service backend
docker run -d \
  --name backlink-search-frontend \
  -p 3000:3000 \
  -e BACKEND_URL=http://backend-service:8010 \
  ghcr.io/kris-dev-hub/backlink-search:latest
```

### 📱 Container Features

- **Minimal size**: ~15-25MB Alpine-based image
- **Memory efficient**: ~10-20MB RAM usage
- **Multi-architecture**: Supports AMD64 and ARM64
- **Health checks**: Built-in health endpoint at `/health`
- **Non-root user**: Runs as unprivileged user for security
- **Optimized nginx**: Gzip compression, caching, security headers

### 🏗️ Build Locally

```bash
# Build the Docker image locally
docker build -t backlink-search-frontend .

# Run locally built image
docker run -d -p 3000:3000 backlink-search-frontend
```

### 📋 Versioning and Releases

The project uses semantic versioning with automatic Docker image builds:

**Creating a Release:**
```bash
# Tag a new version (triggers automated build)
git tag v1.0.0
git push origin v1.0.0

# Images are automatically built and pushed to:
# ghcr.io/kris-dev-hub/backlink-search:v1.0.0
# ghcr.io/kris-dev-hub/backlink-search:latest
```

### ☸️ Kubernetes Deployment

**Example Kubernetes Deployment:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backlink-search-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backlink-search-frontend
  template:
    metadata:
      labels:
        app: backlink-search-frontend
    spec:
      containers:
      - name: frontend
        image: ghcr.io/kris-dev-hub/backlink-search:latest
        ports:
        - containerPort: 3000
        env:
        - name: BACKEND_URL
          value: "http://backend-service:8010"
        resources:
          requests:
            memory: "32Mi"
            cpu: "10m"
          limits:
            memory: "64Mi"
            cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  name: backlink-search-frontend-service
spec:
  selector:
    app: backlink-search-frontend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Technology Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript 5.3+
- **Build Tool**: Vite 5.0+
- **UI Components**: PrimeVue + Custom HTML tables
- **Styling**: Tailwind CSS 3.3+
- **HTTP Client**: Axios
- **Export Libraries**: XLSX, jsPDF, jsPDF-autoTable

## 📊 API Integration

The frontend integrates with the GlobalLinks backend API:

### Endpoints

- `POST /api/links` - Search backlinks for a domain with filtering and pagination

### Request Format

```typescript
{
  domain: "example.com",
  page: 1,
  limit: 25,
  sort: "linkUrl",
  order: "asc",
  filters: [
    { name: "Link Path", val: "blog", kind: "any" },
    { name: "No Follow", val: "1", kind: "exact" }
  ]
}
```

### Available Filters

- **Link Path**: Filter by link URL patterns
- **Source Host**: Filter by source domain/host
- **Source Path**: Filter by source page path
- **Anchor**: Filter by anchor text
- **No Follow**: Filter by nofollow status (exact: "1" or "0")
- **IP**: Filter by server IP address

## 🎯 Key Features

### Direct Domain Access

Support for shareable URLs with automatic search:
- `/domain/example.com` - Direct access to domain search
- Automatic canonical URLs pointing to main search page
- SEO-friendly with proper meta tags

### Advanced Filtering

- **Column-based filters**: Filters directly under table headers
- **Dual input system**: Separate host and path filtering
- **Real-time search**: 300ms debounced filtering
- **Smart pattern matching**: Regex support for complex patterns

### Export Functionality

- **CSV Export**: Clean CSV with proper escaping
- **Excel Export**: XLSX format with headers
- **PDF Export**: Professional landscape layout with optimized columns
- **Smart formatting**: Full URLs in exports, cleaned data presentation

### Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Flexible layout**: Adapts to different screen sizes
- **Touch-friendly**: Proper touch targets and interactions

## 📝 Demo

- [Live Demo](https://krisdevhub.com/dev/backlink-search/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is part of the GlobalLinks/KrisDevHub suite. See the main project for licensing information.

---

**Built with ❤️ using Vue.js, TypeScript, and modern containerization**
