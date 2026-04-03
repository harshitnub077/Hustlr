# Hustlr — Student Freelance Marketplace

> A full-stack marketplace connecting verified college students with companies seeking affordable, quality freelance work.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **State** | Zustand (with persist) |
| **Backend** | Node.js + Express.js (ES Modules) |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (HTTP-only bearer tokens) + bcryptjs |
| **Real-time** | Socket.io |
| **Media** | Cloudinary (image uploads) |
| **Payments** | Razorpay (mock escrow) |

## Project Structure

```
Hustlr/
├── server/          Express REST API + Socket.io
│   └── src/
│       ├── config/          MongoDB + Cloudinary setup
│       ├── models/          User, Gig, Order, Review, Challenge, Message
│       ├── controllers/     Auth, Users, Gigs, Orders, Reviews, Challenges, Messages
│       ├── routes/          All API routes
│       ├── middleware/       JWT auth, error handler, multer upload
│       └── server.js        Entry point
│
└── client/          Next.js 14 App Router
    ├── app/
    │   ├── page.tsx             Homepage
    │   ├── login/               Sign in
    │   ├── register/            Sign up (student/company)
    │   ├── gigs/                Browse, detail, create
    │   ├── orders/[id]/         Order management + real-time chat
    │   ├── challenges/          List, detail, create
    │   ├── profile/[id]/        Public user profiles
    │   ├── dashboard/
    │   │   ├── student/         Earnings, orders, gig management
    │   │   ├── company/         Hires, challenges
    │   │   └── admin/           User approval, platform stats
    │   └── how-it-works/
    ├── components/
    │   ├── layout/   Navbar, Footer
    │   ├── gigs/     GigCard
    │   ├── chat/     ChatBox (Socket.io)
    │   └── home/     HeroSection, FeaturedGigs, CategoryGrid, etc.
    ├── store/        authStore.ts (Zustand)
    └── lib/          api.ts (Axios), utils.ts
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or pnpm

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # Fill in MONGO_URI, JWT_SECRET, Cloudinary keys
npm run dev            # → http://localhost:5000
```

### 2. Frontend  

```bash
cd client
npm install
# .env.local is already configured for localhost:5000
npm run dev            # → http://localhost:3000
```

## API Routes

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Current user | Private |
| GET | `/api/gigs` | List/search gigs | Public |
| POST | `/api/gigs` | Create gig | Student |
| GET | `/api/gigs/:id` | Gig detail | Public |
| POST | `/api/orders` | Place order (escrow) | Private |
| PATCH | `/api/orders/:id/accept` | Seller accepts | Seller |
| PATCH | `/api/orders/:id/deliver` | Seller delivers | Seller |
| PATCH | `/api/orders/:id/cancel` | Cancel + refund | Buyer/Admin |
| POST | `/api/reviews` | Leave review | Buyer |
| GET | `/api/challenges` | List challenges | Public |
| POST | `/api/challenges` | Post challenge | Company |
| POST | `/api/challenges/:id/submit` | Submit entry | Student |
| PATCH | `/api/challenges/:id/winner` | Pick winner | Company |
| GET | `/api/users/:id/approve` | Approve student | Admin |

## Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_order` | Client → Server | Join order room |
| `send_message` | Client → Server | Send chat message |
| `new_message` | Server → Client | Receive new message |

## Environment Variables

### Server (`.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hustlr
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Client (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```
