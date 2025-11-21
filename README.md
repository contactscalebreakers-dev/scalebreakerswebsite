# Scalebreakers Website

A full-stack creative platform featuring workshops, art portfolio, e-commerce shop, and mural request services.

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + tRPC
- **Database**: MySQL with Drizzle ORM
- **Authentication**: OAuth 2.0 + JWT
- **Deployment**: Railway
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18.x or higher
- pnpm 10.x or higher
- MySQL 8.0 or higher (for local development)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/contactscalebreakers-dev/scalebreakerswebsite.git
cd scalebreakerswebsite
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Application
VITE_APP_ID=your_app_id
VITE_APP_TITLE="Scalebreakers"
VITE_APP_LOGO=https://yourdomain.com/logo.png

# Database
DATABASE_URL=mysql://user:password@localhost:3306/scalebreakers

# Authentication
JWT_SECRET=your-secure-jwt-secret-min-32-chars
OAUTH_SERVER_URL=https://your-oauth-server.com
VITE_OAUTH_PORTAL_URL=https://your-oauth-portal.com
OWNER_OPEN_ID=your-owner-id

# Optional: Analytics
VITE_ANALYTICS_ENDPOINT=https://your-analytics-endpoint.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# Optional: AI Features
OPENAI_API_URL=https://api.openai.com/v1
OPENAI_API_KEY=sk-your-api-key

# Server
PORT=3000
NODE_ENV=development
```

### 4. Database Setup

Push the database schema:

```bash
pnpm db:push
```

### 5. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Build for Production

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

## 📦 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # App entry point
│   └── public/            # Static assets
├── server/                # Backend application
│   ├── _core/            # Core server utilities
│   │   ├── index.ts      # Express server setup
│   │   ├── vite.ts       # Vite integration
│   │   ├── oauth.ts      # OAuth routes
│   │   ├── context.ts    # tRPC context
│   │   ├── env.ts        # Environment config
│   │   ├── errorHandler.ts    # Error handling
│   │   ├── security.ts   # Security middleware
│   │   ├── validation.ts # Input validation
│   │   └── logger.ts     # Structured logging
│   ├── db.ts             # Database queries
│   └── routers.ts        # tRPC API routes
├── drizzle/              # Database schema
│   └── schema.ts
├── shared/               # Shared types and constants
├── dist/                 # Build output
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔒 Security Features

### Implemented Security Measures

1. **Environment Variable Validation**: Required variables are validated at startup
2. **Input Sanitization**: XSS protection and input validation using Zod
3. **Rate Limiting**: In-memory rate limiter (upgrade to Redis for production scale)
4. **Security Headers**: Helmet-like security headers (CSP, X-Frame-Options, etc.)
5. **SQL Injection Protection**: Parameterized queries via Drizzle ORM
6. **Authentication**: OAuth 2.0 + JWT with secure cookie storage
7. **Error Handling**: Global error handler that doesn't leak sensitive info
8. **Structured Logging**: Comprehensive logging for audit trails

### Security Best Practices

- Never commit `.env` files to version control
- Use strong JWT secrets (minimum 32 characters)
- Rotate secrets regularly
- Use HTTPS in production
- Keep dependencies updated
- Review security headers for your specific needs
- Implement CORS properly for your domain
- Use environment-specific configurations

## 🗃️ Database Schema

Main tables:
- `users` - User accounts and authentication
- `workshops` - Creative workshop listings
- `products` - Shop items (art, models, dioramas)
- `portfolioItems` - Portfolio showcase
- `muralRequests` - Custom mural quote requests
- `newsletterSubscriptions` - Email subscribers
- `orders` - E-commerce orders
- `cartItems` - Shopping cart

## 🌐 API Routes

### Authentication
- `GET /api/oauth/callback` - OAuth callback handler
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Workshops
- `workshops.list` - List all workshops
- `workshops.getById` - Get workshop details

### Products
- `products.list` - List products (optionally filtered by category)
- `products.getById` - Get product details
- `products.create` - Create product (admin only)
- `products.update` - Update product (admin only)
- `products.delete` - Delete product (admin only)

### Portfolio
- `portfolio.list` - List portfolio items

### Mural Requests
- `muralRequests.submit` - Submit mural quote request

### Newsletter
- `newsletter.subscribe` - Subscribe to newsletter

## 🚢 Deployment

### Railway Deployment

1. **Create Railway Project**:
   ```bash
   # Railway will auto-detect the repository
   ```

2. **Set Environment Variables** in Railway dashboard:
   - All variables from `.env.example`
   - Ensure `NODE_ENV=production`
   - Set proper `DATABASE_URL`

3. **Configure Build**:
   - Build Command: `pnpm build`
   - Start Command: `pnpm start`

4. **Database**:
   - Add MySQL plugin in Railway
   - Copy `DATABASE_URL` to environment variables

5. **Domain**:
   - Add custom domain in Railway settings
   - Configure DNS with your provider

### Database Migrations

Run migrations in production:
```bash
# SSH into your Railway deployment or use Railway CLI
pnpm db:push
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Type checking
pnpm check
```

## 📝 Code Quality

```bash
# Format code
pnpm format

# Check for errors
pnpm check
```

## 🐛 Troubleshooting

### Build Issues

**Problem**: `import.meta.dirname` errors
- **Solution**: Using `fileURLToPath(import.meta.url)` for path resolution

**Problem**: Module not found errors
- **Solution**: Run `pnpm install` to ensure all dependencies are installed

### Database Issues

**Problem**: Connection refused
- **Solution**: Check `DATABASE_URL` format and credentials
- **Solution**: Ensure MySQL is running

**Problem**: Table doesn't exist
- **Solution**: Run `pnpm db:push` to create tables

### Runtime Issues

**Problem**: "Required environment variable missing"
- **Solution**: Check all required env vars are set in `.env` or Railway dashboard

**Problem**: CORS errors
- **Solution**: Update allowed origins in CORS configuration

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📞 Support

For issues and questions, please open a GitHub issue or contact the development team.

---

Built with ❤️ by Scalebreakers


