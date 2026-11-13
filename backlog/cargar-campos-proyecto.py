#!/usr/bin/env python3
"""Carga Estimate (puntos) y Sprint (iteración) en el tablero de GitHub Projects a partir de backlog.csv.

Requisitos (una sola vez):
    gh auth login            # si aún no has iniciado sesión
    gh auth refresh -s project
Uso:
    python3 backlog/cargar-campos-proyecto.py            # proyecto 2 de edelpinovs
    python3 backlog/cargar-campos-proyecto.py --project 2 --owner edelpinovs --status "Backlog · Ready for sprint"

Reglas:
- Estimate = columna "puntos" (las épicas no llevan).
- Sprint = iteración "Sprint N" donde N = columna "sprint" (sprint 0 = pre-arranque, sin iteración).
- --status (opcional) fija ese estado a todas las historias con sprint <= 2 (primer bloque de trabajo).
"""
import argparse, csv, json, re, subprocess, sys
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('--project', type=int, default=2)
ap.add_argument('--owner', default='edelpinovs')
ap.add_argument('--status', default=None)
ap.add_argument('--csv', default=str(Path(__file__).with_name('backlog.csv')))
a = ap.parse_args()

def gh(*args):
    r = subprocess.run(['gh', *args], capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"gh {' '.join(args[:3])} falló:\n{r.stderr}")
    return r.stdout

proj = json.loads(gh('project', 'view', str(a.project), '--owner', a.owner, '--format', 'json'))
project_id = proj['id']
fields = json.loads(gh('project', 'field-list', str(a.project), '--owner', a.owner, '--format', 'json'))['fields']
by_name = {f['name']: f for f in fields}
estimate = by_name.get('Estimate'); sprint = by_name.get('Sprint') or by_name.get('Iteration'); status = by_name.get('Status')
if not estimate or not sprint:
    sys.exit('No encuentro los campos Estimate y Sprint en el proyecto.')
iter_ids = {it['title']: it['id'] for it in sprint.get('configuration', {}).get('iterations', [])}
status_ids = {o['name']: o['id'] for o in status.get('options', [])} if status else {}

items = json.loads(gh('project', 'item-list', str(a.project), '--owner', a.owner, '--format', 'json', '-L', '500'))['items']
by_key = {}
for it in items:
    m = re.match(r'\[(E\d(?:-\d+[ab]?)?)\]', it.get('title', ''))
    if m: by_key[m.group(1)] = it['id']

rows = list(csv.DictReader(open(a.csv, encoding='utf-8')))
done = 0
for r in rows:
    item = by_key.get(r['id'])
    if not item:
        print('sin ítem en el tablero:', r['id']); continue
    if r['puntos']:
        gh('project', 'item-edit', '--project-id', project_id, '--id', item, '--field-id', estimate['id'], '--number', r['puntos'])
    s = int(r['sprint'] or 0)
    it_id = iter_ids.get(f'Sprint {s}')
    if s > 0 and it_id:
        gh('project', 'item-edit', '--project-id', project_id, '--id', item, '--field-id', sprint['id'], '--iteration-id', it_id)
    if a.status and status_ids.get(a.status) and '-' in r['id'] and s <= 2:
        gh('project', 'item-edit', '--project-id', project_id, '--id', item, '--field-id', status['id'], '--single-select-option-id', status_ids[a.status])
    done += 1
    print('ok', r['id'], r['puntos'] or '-', f'Sprint {s}' if s else 'pre-arranque')
print(f'{done} ítems actualizados')
