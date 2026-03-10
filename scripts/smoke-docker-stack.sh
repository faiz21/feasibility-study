#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="docker/.env.docker"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE. Create it from docker/.env.docker.example" >&2
  exit 1
fi

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

compose --env-file "$ENV_FILE" up -d --build

APP_PORT="${APP_PORT:-3000}"
N8N_PORT="${N8N_PORT:-5678}"
DIRECTUS_PORT="${DIRECTUS_PORT:-8055}"

curl -fsS "http://localhost:${APP_PORT}" >/dev/null
curl -fsS "http://localhost:${N8N_PORT}" >/dev/null
curl -fsS "http://localhost:${DIRECTUS_PORT}/server/health" >/dev/null

echo "Docker stack smoke test passed."
