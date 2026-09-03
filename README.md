# candy_cake_by_moxina

Fullstack-витрина: Next.js + Prisma + PostgreSQL (Docker).

## Быстрый старт

1. Запусти Docker Desktop.
2. В папке `cake`:

```bash
cp .env.example .env
docker compose up -d
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

- Сайт: http://localhost:3000/ru  
- Админка: http://localhost:3000/admin/login  
- Логин по умолчанию: `admin@candy.cake` / `admin123`

## PRD

См. [docs/PRD.md](docs/PRD.md).
