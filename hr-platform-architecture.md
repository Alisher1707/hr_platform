# HR Platform — Recruiting MVP Architecture
> Stack: React · Node.js · PostgreSQL  
> Yondashuv: Modular Monolith → keyinchalik Microservices ga o'sishi mumkin

---

## 1. LOYIHA HAQIDA UMUMIY MA'LUMOT

**Maqsad:** HR tizimi uchun MVP — Admin orqali ishchi ro'yxatga olish, HR esa Jira/Trello uslubidagi Kanban doskasida arizalarni boshqarish.

**Foydalanuvchi rollari:**
- `SUPER_ADMIN` — tizimni boshqaradi, admin havolalar yaratadi
- `ADMIN` — havola orqali ro'yxatdan o'tadi, yangi ishchi qo'shadi
- `HR` — arizalarni ko'radi, Kanban doskasida boshqaradi
- `EMPLOYEE` — (kelajak uchun saqlanadi)

---

## 2. PAPKA TUZILMASI (Monorepo)

```
hr-platform/
├── apps/
│   ├── frontend/                  # React SPA
│   └── backend/                   # Node.js API
├── packages/
│   └── shared/                    # Umumiy typlar, konstantlar
├── docker-compose.yml
├── .env.example
└── README.md
```

### 2.1 Backend Tuzilmasi

```
apps/backend/
├── src/
│   ├── config/
│   │   ├── database.js            # PostgreSQL ulanish (pg pool)
│   │   ├── env.js                 # .env validatsiya
│   │   └── constants.js           # Rollar, statuslar
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.middleware.js  # JWT tekshirish
│   │   │
│   │   ├── invite/                 # Admin havola tizimi
│   │   │   ├── invite.routes.js
│   │   │   ├── invite.controller.js
│   │   │   └── invite.service.js
│   │   │
│   │   ├── employees/              # Ishchi ma'lumotlari
│   │   │   ├── employees.routes.js
│   │   │   ├── employees.controller.js
│   │   │   └── employees.service.js
│   │   │
│   │   └── applications/           # Arizalar (Kanban)
│   │       ├── applications.routes.js
│   │       ├── applications.controller.js
│   │       └── applications.service.js
│   │
│   ├── shared/
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validate.js        # Joi yoki Zod
│   │   └── utils/
│   │       ├── response.js        # Standart API javob formati
│   │       ├── token.js           # JWT helper
│   │       └── crypto.js          # Havola token generatsiyasi
│   │
│   ├── db/
│   │   ├── migrations/            # SQL migration fayllari
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_invites.sql
│   │   │   ├── 003_create_employees.sql
│   │   │   └── 004_create_applications.sql
│   │   └── seed.js                # Boshlang'ich ma'lumotlar
│   │
│   └── app.js                     # Express app entry point
├── package.json
└── .env
```

### 2.2 Frontend Tuzilmasi

```
apps/frontend/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── globals.css        # CSS variables (light/dark)
│   │
│   ├── components/
│   │   ├── ui/                    # Base komponentlar
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ThemeToggle.jsx    # Kungi/Tungi rejim
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── AppLayout.jsx
│   │   │
│   │   └── kanban/
│   │       ├── KanbanBoard.jsx    # Asosiy doska
│   │       ├── KanbanColumn.jsx   # Har bir ustun
│   │       └── ApplicationCard.jsx # Ariza kartochkasi
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx   # Havola orqali kirish
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── InviteManagement.jsx  # Havola yaratish
│   │   │   └── EmployeeForm.jsx      # Yangi ishchi qo'shish
│   │   │
│   │   └── hr/
│   │       ├── HRDashboard.jsx
│   │       └── KanbanPage.jsx        # Kanban doska sahifasi
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   └── useKanban.js
│   │
│   ├── services/
│   │   ├── api.js                 # Axios instance
│   │   ├── authService.js
│   │   ├── employeeService.js
│   │   └── applicationService.js
│   │
│   ├── store/
│   │   ├── authStore.js           # Zustand
│   │   └── themeStore.js
│   │
│   ├── router/
│   │   └── AppRouter.jsx          # React Router v6
│   │
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## 3. MA'LUMOTLAR BAZASI SXEMASI (PostgreSQL)

### 3.1 Jadvallar

```sql
-- =============================================
-- 001: FOYDALANUVCHILAR
-- =============================================
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'HR', 'EMPLOYEE');

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          user_role NOT NULL DEFAULT 'ADMIN',
  first_name    VARCHAR(100),
  last_name     VARCHAR(100),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 002: ADMIN TAKLIF HAVOLALARI
-- =============================================
CREATE TABLE invites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token         VARCHAR(64) UNIQUE NOT NULL,   -- crypto.randomBytes(32)
  created_by    UUID REFERENCES users(id),
  used_by       UUID REFERENCES users(id),
  expires_at    TIMESTAMPTZ NOT NULL,           -- Masalan, 7 kun
  used_at       TIMESTAMPTZ,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 003: ISHCHILAR (Admin tomonidan qo'shiladi)
-- =============================================
CREATE TABLE employees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(20),
  address       TEXT,
  birth_date    DATE,                           -- Yosh hisoblash uchun
  experience    SMALLINT DEFAULT 0,             -- Staj (yil)
  created_by    UUID REFERENCES users(id),      -- Qaysi admin qo'shgan
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 004: ARIZALAR (Kanban kartalari)
-- =============================================
CREATE TYPE application_status AS ENUM (
  'KELDI',          -- Yangi ariza tushdi
  'QOSHILDI',       -- HR ko'rib chiqdi, qabul qilindi
  'SHARTNOMA'       -- Shartnoma imzolandi
);

CREATE TABLE applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   UUID REFERENCES employees(id) ON DELETE CASCADE,
  status        application_status NOT NULL DEFAULT 'KELDI',
  position      VARCHAR(200),                   -- Lavozim nomi
  notes         TEXT,                           -- HR izohi
  order_index   INTEGER DEFAULT 0,              -- Ustun ichidagi tartib (DnD uchun)
  assigned_to   UUID REFERENCES users(id),      -- HR tayinlash
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 005: KARD O'ZGARISHLAR TARIXI (Audit log)
-- =============================================
CREATE TABLE application_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  UUID REFERENCES applications(id) ON DELETE CASCADE,
  changed_by      UUID REFERENCES users(id),
  old_status      application_status,
  new_status      application_status,
  comment         TEXT,
  changed_at      TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXLAR
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_employee ON applications(employee_id);
CREATE INDEX idx_invites_token ON invites(token);
CREATE INDEX idx_employees_created_by ON employees(created_by);
```

---

## 4. API ENDPOINTLAR

### Base URL: `/api/v1`

#### 4.1 AUTH

| Method | Endpoint | Tavsif | Himoya |
|--------|----------|--------|--------|
| POST | `/auth/login` | Login | Ochiq |
| POST | `/auth/register` | Havola orqali ro'yxat | Token kerak |
| POST | `/auth/logout` | Chiqish | JWT |
| GET | `/auth/me` | Joriy foydalanuvchi | JWT |

#### 4.2 HAVOLALAR (Invite)

| Method | Endpoint | Tavsif | Himoya |
|--------|----------|--------|--------|
| POST | `/invites` | Yangi havola yaratish | SUPER_ADMIN |
| GET | `/invites` | Barcha havolalar | SUPER_ADMIN |
| GET | `/invites/:token/validate` | Token tekshirish | Ochiq |
| DELETE | `/invites/:id` | Havolani o'chirish | SUPER_ADMIN |

#### 4.3 ISHCHILAR (Employees)

| Method | Endpoint | Tavsif | Himoya |
|--------|----------|--------|--------|
| POST | `/employees` | Yangi ishchi + ariza | ADMIN |
| GET | `/employees` | Barcha ishchilar | ADMIN, HR |
| GET | `/employees/:id` | Bitta ishchi | ADMIN, HR |
| PUT | `/employees/:id` | Ma'lumot yangilash | ADMIN |

#### 4.4 ARIZALAR / KANBAN

| Method | Endpoint | Tavsif | Himoya |
|--------|----------|--------|--------|
| GET | `/applications` | Barcha arizalar (status bo'yicha) | HR, ADMIN |
| PATCH | `/applications/:id/status` | Status o'zgartirish (DnD) | HR |
| PATCH | `/applications/:id/order` | Tartib o'zgartirish | HR |
| PUT | `/applications/:id` | Ma'lumot yangilash | HR |
| GET | `/applications/:id/history` | O'zgarishlar tarixi | HR |

---

## 5. ASOSIY BUSINESS LOGIKA

### 5.1 Admin Havola Oqimi

```
SUPER_ADMIN
  └── POST /invites
        └── Noyob token yaratiladi (crypto.randomBytes)
        └── expires_at = hozir + 7 kun
        └── URL: https://platform.com/register?token=XYZ

Yangi Admin
  └── Havolani ochadi → /register?token=XYZ
  └── GET /invites/:token/validate → token tekshiriladi
  └── Form to'ldiriladi (email, parol, ism, familya)
  └── POST /auth/register → token bilan
        └── Token valid va muddati o'tmagan → ✅
        └── User yaratiladi (role: ADMIN)
        └── Token used_at va used_by yangilanadi
```

### 5.2 Ishchi Qo'shish va Ariza Yaratish

```
ADMIN
  └── POST /employees
        └── employees jadvaliga yoziladi
        └── Avtomatik: applications jadvalida
            status: 'KELDI' bilan yangi kard yaratiladi
        └── application_history ga log yoziladi
```

### 5.3 Kanban Status O'zgartirish

```
HR
  └── Kartani sudrab boshqa ustunga tashlaydi
  └── PATCH /applications/:id/status
        └── { status: 'QOSHILDI' }
        └── application_history ga: old→new, kim o'zgartirdi
        └── applications.updated_at yangilanadi
```

---

## 6. FRONTEND ARXITEKTURA

### 6.1 Routing

```
/login                    → LoginPage (public)
/register?token=...       → RegisterPage (public, token kerak)

/admin                    → AdminDashboard (role: ADMIN)
/admin/invites            → InviteManagement
/admin/employees/new      → EmployeeForm

/hr                       → HRDashboard (role: HR)
/hr/kanban                → KanbanPage
```

### 6.2 Kanban Doska Komponenti

```
KanbanPage
  └── KanbanBoard
        ├── KanbanColumn [status: "KELDI"]
        │     └── ApplicationCard (drag source)
        │           ├── Ishchi ismi, familyasi
        │           ├── Lavozim
        │           ├── Sana badge
        │           └── HR tayinlash
        │
        ├── KanbanColumn [status: "QOSHILDI"]
        │     └── ApplicationCard ...
        │
        └── KanbanColumn [status: "SHARTNOMA"]
              └── ApplicationCard ...
```

**Drag & Drop:** `@dnd-kit/core` kutubxonasi ishlatiladi (engil va modern).

### 6.3 Theme Tizimi (Kungi/Tungi)

```css
/* globals.css */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f7fa;
  --bg-card: #ffffff;
  --text-primary: #1a1a2e;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  --accent: #4f46e5;        /* Indigo */
  --accent-hover: #4338ca;
  --status-keldi: #f59e0b;   /* Sariq */
  --status-qoshildi: #3b82f6; /* Ko'k */
  --status-shartnoma: #10b981; /* Yashil */
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border: #334155;
  --accent: #818cf8;
  --shadow: 0 1px 3px rgba(0,0,0,0.4);
}
```

Theme `localStorage` da saqlanadi, `data-theme` atributi `<html>` ga qo'yiladi.

---

## 7. AUTH VA XAVFSIZLIK

### JWT Strategiyasi

```
Login → { accessToken (15 min), refreshToken (7 kun) }

accessToken → Authorization: Bearer <token> headerda
refreshToken → httpOnly cookie da (JS dan ko'rinmaydi)

Token yangilash:
  POST /auth/refresh → cookie dan refreshToken o'qib, yangi accessToken beradi
```

### Parol Xavfsizligi

```javascript
// bcrypt, saltRounds: 12
const hash = await bcrypt.hash(password, 12);
```

### Role Guards (Backend Middleware)

```javascript
// Foydalanish namunasi
router.post('/invites', 
  authenticate,           // JWT tekshiradi
  authorize('SUPER_ADMIN'), // Role tekshiradi
  inviteController.create
);
```

---

## 8. MUHIT SOZLAMALARI

### `.env.example`

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/hr_platform

# JWT
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Invite
INVITE_TOKEN_EXPIRES_DAYS=7
```

---

## 9. DOCKER COMPOSE (Local Development)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: hr_platform
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./apps/backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/hr_platform
    depends_on:
      - postgres
    volumes:
      - ./apps/backend:/app
      - /app/node_modules

  frontend:
    build: ./apps/frontend
    ports:
      - "5173:5173"
    volumes:
      - ./apps/frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

---

## 10. TEXNOLOGIYALAR RO'YXATI

### Backend

| Kutubxona | Vazifasi |
|-----------|----------|
| `express` | HTTP server |
| `pg` | PostgreSQL driver |
| `bcrypt` | Parol shifrlash |
| `jsonwebtoken` | JWT |
| `cookie-parser` | Cookie o'qish |
| `cors` | CORS sozlash |
| `joi` | So'rov validatsiyasi |
| `crypto` (builtin) | Havola token |
| `helmet` | HTTP xavfsizlik headerlari |
| `express-rate-limit` | Rate limiting |

### Frontend

| Kutubxona | Vazifasi |
|-----------|----------|
| `react` + `vite` | UI framework |
| `react-router-dom` v6 | Routing |
| `axios` | API so'rovlar |
| `zustand` | State management |
| `@dnd-kit/core` | Drag & Drop |
| `@tanstack/react-query` | Server state, cache |
| `date-fns` | Sana formatlash |

---

## 11. CLAUDE CODE UCHUN BOSHLASH BUYRUQLARI

Claude Code ga quyidagi prompt bering:

```
Menga quyidagi arxitektura asosida loyiha yarating:

1. apps/backend va apps/frontend papkalarini yarating
2. Backend uchun Express + PostgreSQL bilan:
   - src/config/database.js (pg pool)
   - db/migrations/ papkasida barcha SQL fayllar
   - Barcha modullar: auth, invite, employees, applications
   - JWT middleware (accessToken + refreshToken cookie)
3. Frontend uchun Vite + React bilan:
   - CSS variables bilan light/dark theme
   - React Router v6 routing
   - Zustand store (auth, theme)
   - Kanban doska (@dnd-kit/core bilan)
4. docker-compose.yml
5. .env.example
6. README.md (qanday ishga tushirish)

Hamma API endpointlar va DB sxema yuqoridagi arxitekturada bor.
```

---

## 12. KELAJAKDAGI KENGAYTMALAR (MVP dan keyin)

```
v2.0 Rejasi:
├── Email bildirishnomalar (Nodemailer)
├── Arizaga fayl biriktirish (CV upload - Multer + S3)
├── HR va Admin dashboard statistikasi
├── Qidiruv va filtrlash (status, sana, lavozim)
├── Ishchi profili sahifasi
├── Vazifalar (Tasks) moduli
└── Real-time yangilanishlar (Socket.io - Kanban uchun)

v3.0 Rejasi:
├── To'liq EMPLOYEE moduli (ish vaqti, maosh)
├── Hisobotlar va eksport (PDF/Excel)
├── Ko'p filial qo'llab-quvvatlash
└── Mobile app (React Native)
```

---

## 13. ISHGA TUSHIRISH TARTIBI

```bash
# 1. Reponi clone qilish
git clone <repo> hr-platform
cd hr-platform

# 2. Environment fayllarini sozlash
cp apps/backend/.env.example apps/backend/.env
# .env ni tahrirlang

# 3. Docker bilan ishga tushirish (tavsiya etiladi)
docker-compose up -d

# 4. Ma'lumotlar bazasini yaratish
cd apps/backend
npm run migrate     # SQL migrationlarni ishga tushiradi
npm run seed        # SUPER_ADMIN yaratadi

# 5. Backend ishga tushirish (Docker'siz)
npm install
npm run dev         # Port: 5000

# 6. Frontend ishga tushirish (yangi terminal)
cd apps/frontend
npm install
npm run dev         # Port: 5173

# 7. Brauzerda ochish
# http://localhost:5173
# Super admin: admin@platform.com / Admin123!
```

---

*Arxitektura: 10 yillik tajriba asosida MVP uchun optimallashtirilgan.*  
*Hamma qism keyinchalik kengaytirishga tayyor.*
