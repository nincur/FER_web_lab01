# Loto 6/45 Web Application

A lottery ticket management system with Auth0 authentication and PostgreSQL database.

## Features

- User authentication via Auth0 (OpenID Connect)
- Lottery ticket submission with QR code generation
- Machine-to-machine API endpoints for round management
- PostgreSQL database with Prisma ORM
- Deployed on Render

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Authentication**: Auth0 (OIDC + M2M)
- **Views**: EJS templates
- **Validation**: Zod
- **QR Codes**: qrcode library

## Project Structure

```
lotto-app/
├─ prisma/
│  └─ schema.prisma          # Database schema
├─ src/
│  ├─ auth/
│  │  ├─ oidc.ts             # End-user authentication (Auth0)
│  │  └─ m2m.ts              # Machine-to-machine protection
│  ├─ routes/
│  │  ├─ web.ts              # Web pages (home, submit, ticket)
│  │  └─ api.ts              # API endpoints (new-round, close, store-results)
│  ├─ services/
│  │  ├─ rounds.ts           # Round management logic
│  │  ├─ tickets.ts          # Ticket creation and retrieval
│  │  └─ results.ts          # Drawing results storage
│  ├─ utils/
│  │  ├─ validation.ts       # Zod validation schemas
│  │  └─ qr.ts               # QR code generation
│  ├─ views/                 # EJS templates
│  │  ├─ index.ejs           # Home page
│  │  ├─ submit.ejs          # Ticket submission form
│  │  └─ ticket.ejs          # Ticket details page
│  ├─ env.ts                 # Environment configuration
│  └─ server.ts              # Express app setup
├─ .env.example              # Environment variables template
├─ .gitignore
├─ package.json
├─ tsconfig.json
└─ render.yaml               # Render deployment config
```

## Quick Start

### Automated Setup (Recommended)

```bash
# 1. Clone and install
git clone https://github.com/nincur/FER_web_lab01.git
cd FER_web_lab01
npm install

# 2. Run the setup script
./scripts/setup.sh
```

The setup script will:
- Create `.env` file from template
- Generate secure `AUTH0_SECRET`
- Guide you through filling in credentials
- Initialize database with Prisma

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Manual Setup

#### 1. Clone the repository

```bash
git clone https://github.com/nincur/FER_web_lab01.git
cd FER_web_lab01
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Set up environment variables

```bash
# Generate AUTH0_SECRET
node scripts/generate-secret.js

# Copy template and fill in values
cp .env.example .env
# Edit .env with your credentials
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions on:
- Creating Supabase database
- Configuring Auth0 (OIDC + M2M)
- Getting all required credentials

#### 4. Set up the database

```bash
npm run prisma:generate
npm run prisma:migrate
```

#### 5. Run the application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Visit http://localhost:3000

## Helper Scripts

- `scripts/setup.sh` - Interactive setup wizard
- `scripts/generate-secret.js` - Generate AUTH0_SECRET
- `scripts/test-m2m.sh` - Test M2M endpoints

## API Endpoints

### Machine-to-Machine Endpoints (require M2M token)

- `POST /new-round` - Create a new lottery round
- `POST /close` - Close the current round
- `POST /store-results` - Store drawn numbers
  ```json
  {
    "numbers": [5, 12, 23, 34, 39, 45]
  }
  ```

### Web Routes

- `GET /` - Home page
- `GET /submit` - Ticket submission form (requires login)
- `POST /submit` - Submit a ticket
- `GET /ticket/:id` - View ticket details (public)

## Auth0 Setup

### Application (OIDC)
1. Create a Regular Web Application in Auth0
2. Set Allowed Callback URLs: `http://localhost:3000/callback`, `https://your-app.onrender.com/callback`
3. Set Allowed Logout URLs: `http://localhost:3000`, `https://your-app.onrender.com`

### API (M2M)
1. Create an API in Auth0
2. Set Identifier (audience): e.g., `https://lotto-api`
3. Create a Machine to Machine Application
4. Authorize it to access your API

## Deployment to Render

1. Push code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Add environment variables in Render dashboard
6. Deploy

## License

MIT
