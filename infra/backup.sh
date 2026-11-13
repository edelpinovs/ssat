#!/usr/bin/env bash
# Respaldo nocturno cifrado de PostgreSQL (E0-10). Programar con cron: 0 3 * * * /opt/ssat/infra/backup.sh
set -euo pipefail
FECHA=$(date +%F)
docker compose exec -T postgres pg_dump -U ssat ssat | gzip | gpg --symmetric --batch --passphrase-file /etc/ssat/backup.key > "backups/ssat-$FECHA.sql.gz.gpg"
find backups -name 'ssat-*.gpg' -mtime +90 -delete
