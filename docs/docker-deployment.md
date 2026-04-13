# Docker Deployment Guide

## Prerequisites
- Docker Engine 24+
- Docker Compose v2+

## Environment Setup
1. Create the Docker env file:
   ```bash
   cp docker/.env.docker.example docker/.env.docker
   ```
2. Update secrets and passwords in `docker/.env.docker`.
3. Ensure `.env.local` exists for app runtime values (for example, Supabase keys and public site URL):
   ```bash
   cp .env.example .env.local
   ```
4. For VPS/domain deployments, set:
   ```bash
   NEXT_PUBLIC_SITE_URL=https://feasibility-study.machinevision.global
   ```
5. In Supabase Auth URL configuration, add both:
   - `https://feasibility-study.machinevision.global/auth/confirm`
   - `https://feasibility-study.machinevision.global/auth/update-password`

## First-Time Startup
```bash
npm run docker:up
```

Services:
- Web app: `http://localhost:3000`
- n8n: `http://localhost:5678`
- Directus: `http://localhost:8055`

## Upgrade Flow
```bash
git pull
npm run docker:up
```

## Logs and Shutdown
```bash
npm run docker:logs
npm run docker:down
```

## Backup and Restore
### Backup volumes
```bash
docker run --rm -v feasibility-study_pg_data:/from -v "$PWD":/to alpine tar czf /to/backup_pg_data.tgz -C /from .
docker run --rm -v feasibility-study_n8n_data:/from -v "$PWD":/to alpine tar czf /to/backup_n8n_data.tgz -C /from .
docker run --rm -v feasibility-study_directus_uploads:/from -v "$PWD":/to alpine tar czf /to/backup_directus_uploads.tgz -C /from .
```

### Restore volumes
```bash
docker run --rm -v feasibility-study_pg_data:/to -v "$PWD":/from alpine sh -c "cd /to && tar xzf /from/backup_pg_data.tgz"
docker run --rm -v feasibility-study_n8n_data:/to -v "$PWD":/from alpine sh -c "cd /to && tar xzf /from/backup_n8n_data.tgz"
docker run --rm -v feasibility-study_directus_uploads:/to -v "$PWD":/from alpine sh -c "cd /to && tar xzf /from/backup_directus_uploads.tgz"
```

## Troubleshooting
| Problem | Likely Cause | Fix |
|---|---|---|
| `docker compose` env errors | `docker/.env.docker` missing | Copy from example and fill values |
| Web container exits on start | Missing `.env.local` values | Set required Supabase vars |
| n8n cannot connect to DB | Postgres not healthy yet | Check `docker compose logs postgres n8n` |
| Directus health endpoint fails | Admin/secret vars invalid | Update `DIRECTUS_*` vars and restart |
| Port already in use | Existing local process | Change `APP_PORT`/`N8N_PORT`/`DIRECTUS_PORT` |
