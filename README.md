# Offline-First Talent-to-Employment Platform
### Built by Premier Ufitinema

---

## Stack
- **Frontend:** React 18, React Router, Axios, react-hot-toast
- **Backend:** Node.js, Express, Sequelize ORM
- **Database:** SQLite (development) → PostgreSQL (production)
- **Payments:** MTN Mobile Money (Collections API)
- **Auth:** JWT (7-day tokens)

---

## Payment Model
| Role     | Fee                | Trigger                         |
|----------|--------------------|---------------------------------|
| Learner  | $10 one-time       | First time they open a course   |
| Employer | $20/month          | To browse graduate portfolios   |
| Mentor   | Free               | Admin creates account           |
| Admin    | Free               | Admin creates account           |

All payments processed via **MTN Mobile Money** in RWF.

---

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # fill in your MTN MoMo keys and SMTP credentials
npm run dev               # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm start                 # starts on http://localhost:3000
```

---

## Project Structure
```
platform/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize + SQLite config
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   ├── paymentController.js # MTN MoMo initiate + verify
│   │   └── moduleController.js  # Courses + offline sync
│   ├── middleware/
│   │   └── auth.js              # JWT protect, role guard, payment gate
│   ├── models/
│   │   ├── User.js
│   │   ├── Payment.js
│   │   ├── LearningModule.js
│   │   └── index.js             # All other models
│   ├── routes/
│   │   ├── auth.js
│   │   ├── payments.js
│   │   ├── modules.js
│   │   ├── admin.js
│   │   └── resources.js         # Submissions, portfolio, messages, sessions, progress
│   ├── utils/
│   │   ├── momoService.js       # MTN MoMo API wrapper
│   │   └── emailService.js      # Nodemailer notifications
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.js   # Global user state
        ├── hooks/
        │   └── useMomoPayment.js # Payment initiate + polling
        ├── pages/
        │   ├── Auth.jsx          # Register + Login
        │   ├── LearnerDashboard.jsx
        │   └── Dashboards.jsx   # Employer, Mentor, Admin
        ├── components/
        │   └── MomoPaymentModal.jsx
        ├── utils/
        │   └── api.js            # Axios instance
        └── App.js               # Routes + Landing page
```

---

## Key API Endpoints

### Auth
| Method | Endpoint            | Access  | Description           |
|--------|---------------------|---------|-----------------------|
| POST   | /api/auth/register  | Public  | Create learner/employer account |
| POST   | /api/auth/login     | Public  | Login and get JWT     |
| GET    | /api/auth/me        | Any     | Get current user      |
| PATCH  | /api/auth/profile   | Any     | Update profile        |

### Payments
| Method | Endpoint                        | Access   | Description                    |
|--------|---------------------------------|----------|--------------------------------|
| POST   | /api/payments/learner/initiate  | Learner  | Request $10 MoMo payment       |
| POST   | /api/payments/employer/initiate | Employer | Request $20/month MoMo payment |
| GET    | /api/payments/verify/:id        | Owner    | Poll payment status            |
| POST   | /api/payments/momo-callback     | MTN      | Server-to-server webhook       |

### Modules
| Method | Endpoint               | Access             | Description                     |
|--------|------------------------|--------------------|---------------------------------|
| GET    | /api/modules           | Any (auth)         | List all published modules      |
| GET    | /api/modules/:id       | Learner (paid)     | Open module — triggers payment gate |
| POST   | /api/modules/sync      | Learner (paid)     | Sync offline progress           |
| POST   | /api/modules           | Admin              | Create module                   |

### Submissions & Feedback
| Method | Endpoint                            | Access  | Description              |
|--------|-------------------------------------|---------|--------------------------|
| POST   | /api/submissions                    | Learner | Submit project           |
| GET    | /api/submissions/mine               | Learner | My submissions           |
| POST   | /api/submissions/:id/feedback       | Mentor  | Give feedback            |

---

## MTN MoMo Setup
1. Register at https://momodeveloper.mtn.com
2. Create a Collections subscription
3. Get your Subscription Key, create an API User and API Key
4. Fill these into your `.env` file
5. In production: update `MTN_MOMO_ENVIRONMENT=mtncongo` (or your country)
6. Update `MTN_MOMO_CALLBACK_URL` to your public server URL

---

## Environment Variables (backend/.env)
```
PORT=5000
JWT_SECRET=your_secret_here
MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_SUBSCRIPTION_KEY=your_key
MTN_MOMO_API_USER=your_uuid
MTN_MOMO_API_KEY=your_api_key
MTN_MOMO_ENVIRONMENT=sandbox
MTN_MOMO_CURRENCY=RWF
MTN_MOMO_CALLBACK_URL=https://yourdomain.com/api/payments/momo-callback
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email
SMTP_PASS=your_app_password
```
