#!/usr/bin/env bash
# Crea épicas, hitos e issues en GitHub a partir de backlog.csv usando gh CLI.
# Uso: ./backlog/crear-issues.sh <owner/repo>
set -euo pipefail
REPO="${1:?owner/repo}"
CSV="$(dirname "$0")/backlog.csv"

# Hitos
for m in "S0 Pre-arranque" "M1 Base" "M2 Módulo 1" "M3 Módulo 2" "M4 Módulo 3" "M5 MVP integrado" "M6 Piloto 1" "M7 v1.0 + INDAUTOR" "M8 Cierre"; do
  gh api -X POST "repos/$REPO/milestones" -f title="$m" >/dev/null 2>&1 || true
done

# Issues (python para parsear CSV con comas y comillas)
python3 - "$REPO" "$CSV" <<'PY'
import csv, subprocess, sys
repo, path = sys.argv[1], sys.argv[2]
epics = {}
with open(path, newline='', encoding='utf-8') as f:
    for r in csv.DictReader(f):
        labels = [l.strip() for l in r['etiquetas'].split(',') if l.strip()]
        if r['prioridad']: labels.append(f"prioridad: {r['prioridad'].lower()}")
        body = r['descripcion'] + f"\n\n**ID:** {r['id']} · **Épica:** {r['epic']} · **Sprint:** {r['sprint']} · **Puntos:** {r['puntos'] or '-'}"
        if r['id'] in epics or not r['id'].startswith('E') or '-' in r['id']:
            parent = epics.get(r['epic'])
            if parent: body += f"\n\nParte de #{parent}"
        title = f"[{r['id']}] {r['titulo']}"
        cmd = ['gh', 'issue', 'create', '-R', repo, '-t', title, '-b', body] + sum([['-l', l] for l in labels], [])
        out = subprocess.run(cmd, capture_output=True, text=True, check=True).stdout.strip()
        num = out.rsplit('/', 1)[-1]
        if '-' not in r['id']: epics[r['epic']] = num
        print(num, title)
PY
echo "Listo. Crea el tablero en GitHub Projects y agrega las issues con: gh project item-add <num> --owner <owner> --url <issue-url>"
