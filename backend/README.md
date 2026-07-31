# PRISM Backend

Express + MongoDB REST API with JWT auth, role-based access, and a mocked AI outbreak-detection
engine. Clean MVC architecture with Swagger docs.

```bash
cp .env.example .env
npm install
npm run seed     # populate demo data + generate AI alerts
npm run dev      # http://localhost:4000  ·  Swagger UI at /api/docs
```

Requires MongoDB (default `mongodb://127.0.0.1:27017/prism`).

## Layout

```
src/
├── config/      env · db · swagger
├── controllers/ request handlers (thin)
├── routes/      RESTful routes + OpenAPI annotations
├── models/      Mongoose schemas (User, Pharmacy, Medicine, Inventory, Reservation, Sale, Alert)
├── middleware/  protect + authorize (RBAC) · validate · error handler
├── services/    analyticsService · aiAlertService
├── validators/  express-validator chains
└── utils/       ApiError · asyncHandler · ApiResponse · token · logger · seed
```

## Roles

`patient` · `pharmacy` · `authority` · `admin` — enforced by the `authorize(...)` middleware.

See the root [`README.md`](../README.md) for the endpoint map, demo accounts, and how the AI
detection works.
