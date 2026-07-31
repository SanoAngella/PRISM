# PRISM — AI-Powered Pharmacy Intelligence Platform

> Find medicines faster. Detect outbreaks earlier.
> Built for the **IGAD Husika Hackathon 2026** — _“Smarter Early Warning, Stronger Communities.”_

PRISM connects patients to available medicines in real time, lets pharmacies manage stock and
sales, and turns everyday pharmacy demand into an **early-warning signal** for health authorities —
days before hospitals are overwhelmed.

---

## The problem

People move from pharmacy to pharmacy searching for medicines with no way to know where stock
exists. Meanwhile, outbreaks are usually detected only **after** hospitals are overwhelmed — even
though pharmacies see unusual demand spikes first.

## The solution

One platform with three roles:

| Role | Capabilities |
| --- | --- |
| **Patient** | Search medicines · view nearby pharmacies · check stock · compare · reserve · navigate |
| **Pharmacy** | Manage inventory · update stock · record sales · low-stock alerts · fulfil reservations |
| **Health Authority** | Analytics dashboard · outbreak alerts · demand monitoring · hotspot maps · AI recommendations |

The AI service continuously analyses medicine demand across pharmacies. When abnormal patterns
appear in one location, it raises an **outbreak alert** with a confidence score and recommended
response.

---

## Tech stack

**Frontend** — React · Vite · Tailwind CSS · React Router · Axios · Lucide Icons · Recharts · Leaflet
**Backend** — Node.js · Express · MongoDB (Mongoose) · JWT · express-validator · Swagger

---

## Project structure

```
Prism/
├── frontend/          # React + Vite SPA
│   └── src/
│       ├── components/   # Reusable UI, charts, maps
│       ├── layouts/      # Public, Patient, Pharmacy, Authority shells
│       ├── pages/        # Route pages by role
│       ├── contexts/     # Auth + Toast providers
│       ├── services/     # API layer (mock-backed, ready for real API)
│       ├── hooks/  utils/  data/
│       └── App.jsx       # Routing
└── backend/           # Express REST API (MVC)
    └── src/
        ├── config/      # env, db, swagger
        ├── controllers/ # request handlers
        ├── routes/      # RESTful routes + OpenAPI annotations
        ├── models/      # Mongoose schemas
        ├── middleware/  # auth (JWT + RBAC), validation, errors
        ├── services/    # analytics + AI alert engine
        ├── validators/  utils/
        └── server.js
```

---

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env        # adjust MONGO_URI / JWT_SECRET as needed
npm install
npm run seed                # populate realistic demo data + generate AI alerts
npm run dev                 # http://localhost:4000  ·  docs at /api/docs
```

Requires a running MongoDB (local `mongodb://127.0.0.1:27017/prism` by default).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api` to the backend on port 4000.

---

## Demo accounts

All demo accounts use the password **`password`**:

| Role | Email |
| --- | --- |
| Pharmacy | `pharmacy@prism.rw` |
| Health Authority | `authority@prism.rw` |
| Patient | `patient@prism.rw` |

On the login screen, pick a role to auto-fill its demo email. The patient portal is also usable
without signing in.

---

## API overview

Full interactive docs (Swagger UI) at **`http://localhost:4000/api/docs`**.

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/register` · `POST /auth/register-pharmacy` · `POST /auth/login` · `GET /auth/me` |
| Medicines | `GET /medicines` · `GET /medicines/:id` · `GET /medicines/:id/availability` · `POST/PATCH/DELETE` |
| Pharmacies | `GET /pharmacies` (geo-sortable) · `GET /pharmacies/:id` · `PATCH /pharmacies/:id` |
| Inventory | `GET /inventory` · `GET /inventory/stats` · `POST` · `PATCH/DELETE /inventory/:id` |
| Reservations | `POST /reservations` · `GET /reservations` · `PATCH /reservations/:id/status` |
| Sales | `GET /sales` · `GET /sales/trend` · `POST /sales` |
| Analytics | `GET /analytics/dashboard` · `GET /analytics/demand` · `GET /analytics/hotspots` |
| Alerts | `GET /alerts` · `GET /alerts/:id` · `PATCH /alerts/:id/status` · `POST /alerts/run-detection` |

All responses follow a consistent envelope: `{ success, message, data, meta? }`.

---

## How the AI outbreak detection works

The `aiAlertService` compares each district's demand for **tracer medicine categories**
(rehydration, antimalarial, antibiotic, respiratory) in a recent window against the previous
window. A large positive swing above the configured threshold raises an alert, with:

- **Severity** scaled by the magnitude of the swing
- **Confidence** derived from the anomaly strength
- A **disease mapping** and canned **response recommendation**

Thresholds are configurable via `ALERT_WARNING_THRESHOLD` / `ALERT_CRITICAL_THRESHOLD`. The seed
script injects a realistic rehydration + antimalarial spike in Nyarugenge so the engine produces a
credible cholera/malaria alert out of the box.

---

## Notes

- The frontend ships with a mock service layer that mirrors the backend response shapes, so the UI
  runs standalone for demos and is ready to switch to the live API by pointing `VITE_API_URL` at
  the backend.
- Design language: a compact, enterprise healthcare SaaS look (Linear / Stripe-style) — flat
  surfaces, restrained radii, professional blue, minimal charts.
