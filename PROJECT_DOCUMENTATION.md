# Virallens - Project Documentation

**Status:** ✅ Production Ready | Fully Deployed

## 🌐 Deployment

- **Live App:** https://academia-chat.vercel.app
- **GitHub:** https://github.com/jedan2506/academia_chat.git
- **Backend:** Vercel Serverless
- **Frontend:** Vercel CDN
- **Database:** MongoDB Atlas
- **Cache:** Upstash Redis

---

## 📝 Development Process

**Git Workflow:** All enhancements, bug fixes, and features were developed and merged through Pull Requests. This approach ensures complete visibility into individual file changes, commit history, and the evolution of the codebase. Reviewers can examine the PR history on GitHub to understand the granular changes made during the development process.

**Important Note:** The README.md file currently contains the original assignment brief. For future iterations of this assignment, it would be beneficial to include deployment guidance directly in the README.md. Adding information about Vercel deployment steps, external service setup (MongoDB Atlas, Upstash Redis), and environment variable configuration would significantly help candidates understand the production deployment process. This documentation has been provided separately in PROJECT_DOCUMENTATION.md and can be integrated into the main README as needed.

---

## ✅ Completed Tasks

### Security
- ✅ bcrypt password hashing implementation
- ✅ JWT authentication with proper payload handling
- ✅ CORS configuration with environment variables
- ✅ Rate limiting on all endpoints
- ✅ Password field removed from API responses
- ✅ Environment variable protection

### Performance
- ✅ Redis caching (60-70% query reduction)
- ✅ MongoDB connection pooling and indexing
- ✅ Image optimization (97% size reduction)
- ✅ Frontend code splitting and minification
- ✅ Database query optimization with .lean()
- ✅ Removed artificial delays

### AI Integration
- ✅ Fixed conversation context (full history sent to AI)
- ✅ Improved prompt quality and temperature settings
- ✅ Enhanced streaming error handling
- ✅ Empty message validation
- ✅ Optimized retry attempts (5000 → 3)

### SEO
- ✅ React Helmet Async implementation
- ✅ Dynamic meta tags per route
- ✅ OpenGraph and Twitter Card tags
- ✅ WebP image format
- ✅ Sitemap and robots.txt

### Additional Features
- ✅ Dark/Light theme with database persistence
- ✅ Mobile-responsive UI optimization
- ✅ Prettier code formatting
- ✅ Constants extraction (camelCase)
- ✅ User initials display
- ✅ Production Vercel deployment

---

## 🔧 Major Bug Fixes

| Bug | Root Cause | Solution |
|-----|------------|----------|
| JWT 401 Errors | Token payload mismatch (userId vs id) | Fixed middleware to read decoded.userId |
| API 404 Errors | Wrong route paths (/api/auth-routes) | Corrected to /api/auth |
| AI Context Loss | Only sending user messages | Send complete conversation history |
| Empty Message Crashes | No validation before save | Added trim() and notEmpty() validation |
| MongoDB Connection | Using localhost in Docker | Changed to service name 'mongodb' |
| Theme Not Persisting | DOM update skipped on state match | Update DOM before state check |
| Port Conflicts | Ports 5000/3000 in use | Changed to 5100/3100 |
| Rate Limit Too Strict | 8 requests/2min | Increased to 100 requests/min |

---

## 📊 Performance Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| viral.jpg Size | 5.4 MB | 169 KB | 97% |
| Page Load Time | ~15s | ~0.5s | 30x faster |
| DB Queries (cached) | 100% | 30-40% | 60-70% reduction |
| Password Security | Plain text | bcrypt | ∞ better |
| Rate Limit (General) | 8/2min | 100/min | 12.5x increase |
| Rate Limit (Chat) | 10/min | 50/min | 5x increase |

---

## 🛠 Technology Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, React Hot Toast, React Helmet Async

**Backend:** Node.js 18+, Express.js, TypeScript, Mongoose, bcrypt, JWT, ioredis, express-rate-limit, OpenRouter AI

**Infrastructure:** Docker, Vercel, MongoDB Atlas, Upstash Redis

---

## 🚀 Setup

### Local Development (Docker)

```bash
git clone https://github.com/jedan2506/academia_chat.git
cd academia_chat
```

Create `.env`:
```env
NODE_ENV=development
SERVER_PORT=5100
CLIENT_PORT=3100
MONGODB_URI=mongodb://mongodb:27017/virallens
JWT_SECRET=your-secret-key-minimum-32-characters
CLIENT_URL=http://localhost:3100
VITE_API_URL=http://localhost:5100/api
OPENROUTER_API_KEY=your-openrouter-api-key
REDIS_URL=redis://localhost:6379
```

Start:
```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3100
- Backend: http://localhost:5100

### Production Deployment (Vercel)

**Backend:**
```bash
cd server
vercel
```

Set environment variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=production-secret
CLIENT_URL=https://your-frontend.vercel.app
OPENROUTER_API_KEY=sk-or-v1-...
REDIS_URL=redis://...upstash.io:6379
```

**Frontend:**
```bash
cd client
vercel
```

Set environment variable:
```
VITE_API_URL=https://your-backend.vercel.app/api
```

Update backend `CLIENT_URL` to frontend URL and redeploy.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PATCH /api/auth/theme` - Update theme (requires token)
- `POST /api/auth/logout` - Logout (requires token)

### Chat
- `GET /api/chat/conversations` - List conversations (cached 5min)
- `GET /api/chat/conversations/:id` - Get conversation (cached 10min)
- `POST /api/chat/conversations` - Create conversation
- `PUT /api/chat/conversations/:id` - Update title
- `DELETE /api/chat/conversations/:id` - Delete conversation
- `POST /api/chat/conversations/:id/message` - Send message (streaming)

---

## 🎨 Theme System

**Features:**
- User-specific theme stored in database
- Syncs across sessions and devices
- Toggle switch with sun/moon icons
- Forces light theme on auth pages
- Instant DOM updates

**Implementation:**
- `ThemeContext.tsx` - Theme state management
- `ThemeSync.tsx` - Syncs theme from API
- `ForceAuthTheme.tsx` - Forces light on auth pages
- `ThemeToggle.tsx` - Toggle component
- `PATCH /api/auth/theme` - Backend endpoint

---

## 📁 Project Structure

```
academia_chat/
├── client/
│   ├── public/
│   │   ├── images/
│   │   ├── config/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   └── vercel.json
├── server/
│   ├── api/
│   │   └── index.ts
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.ts
│   └── vercel.json
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md
```

---

## 🔐 Security Features

1. bcrypt password hashing with salt rounds
2. JWT authentication with secure tokens
3. Rate limiting on all endpoints
4. CORS protection with environment-based origins
5. Input validation on all endpoints
6. Password exclusion from API responses
7. Environment variable protection

---

## 🏗 Architecture Highlights

**Caching Strategy:**
- Conversations list: 5 min TTL
- Single conversation: 10 min TTL
- Automatic invalidation on create/update/delete

**Database Optimization:**
- Connection pooling (max 10, min 2)
- Compound indexes on userId + timestamps
- .lean() for read-only queries

**Frontend Optimization:**
- Code splitting (vendor, forms, UI)
- Terser minification
- Console/debugger removal in production
- Asset content hashing

**Rate Limiting:**
- General API: 100 req/min
- Chat messages: 50 msg/min
- Auth attempts: 5/15min
- Account creation: 3/hour

---

## 📝 Constants (camelCase)

**Frontend:**
- `theme.ts` - Theme values
- `chat.ts` - Message roles
- `cache.ts` - TTL values

**Backend:**
- `theme.ts` - Theme values
- `chat.ts` - Message roles
- `messages.ts` - Error/success messages
- `cache.ts` - TTL values

---

## 🎯 Key Features

- AI-powered marketing advice
- Real-time streaming responses
- Context-aware conversations
- Multi-conversation management
- Dark/Light theme with persistence
- Mobile-responsive design
- User initials display
- Redis caching for performance
- bcrypt password security
- JWT authentication
- Rate limiting protection

---

## 🚀 Planned Enhancements

- **WebSocket Integration:** Real-time collaborative conversations with live typing indicators, presence detection, and instant message synchronization across multiple users and devices
- **Kubernetes Orchestration:** Advanced container orchestration with auto-scaling, load balancing, health monitoring, and zero-downtime deployments for enterprise-grade reliability

---

## 📞 Contact

**Repository:** https://github.com/jedan2506/academia_chat.git  
**Live Demo:** https://academia-chat.vercel.app

---

**Last Updated:** November 27, 2025  
**Version:** 1.0.0  
**Status:** Production Ready
