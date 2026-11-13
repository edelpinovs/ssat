# Backlog inicial

Fuente de verdad: `backlog/backlog.csv` (id, épica, título, descripción, prioridad, puntos, sprint, etiquetas). Se importa a GitHub con `backlog/crear-issues.sh` y se gestiona en GitHub Projects.

## Épicas
| Épica | Sprints | Puntos aprox. |
|---|---|---|
| E0 Infraestructura y base | 0–2 | 59 |
| E1 Inscripción y obligaciones | 3–6 | 104 |
| E2 Pagos provisionales | 7–10 | 87 |
| E3 Declaración anual | 11–14 | 50 |
| E4 Citas | 17–18 | 23 |
| E5 Motor de reglas y contenido | 1–15 | 49 |
| E6 Profesor y evaluación | 5–16 | 26 |
| E7 Calidad y entrega | 18–27 | 42 |
| E8 Fase 2 opcional | 21–22 | 29 |

Velocidad supuesta: 20–25 puntos por sprint con 2 desarrolladores (30 con becario). Total comprometido (E0–E7) ≈ 449 puntos ≈ 18–22 sprints de trabajo neto; el resto del calendario absorbe pilotos, documentación y holgura.

## Tablero (GitHub Projects)
https://github.com/users/edelpinovs/projects/2 · Estados: **Todo → Backlog · Ready for sprint → Current Sprint → In progress → Under Review → Validated by Client → Done**. Campos: Status, Estimate (puntos), Sprint (30 iteraciones de 2 semanas, 1 mar 2027 – 23 abr 2028), Priority. Las historias son sub-issues de su épica, así que "Sub-issues progress" muestra el avance por épica.

Carga de Estimate y Sprint desde el CSV: `gh auth refresh -s project && python3 backlog/cargar-campos-proyecto.py`.

## Hitos (milestones)
`S0 Pre-arranque` · `M1 Base (sprint 2)` · `M2 Módulo 1 (sprint 6)` · `M3 Módulo 2 (sprint 10)` · `M4 Módulo 3 (sprint 14)` · `M5 MVP integrado (sprint 18)` · `M6 Piloto 1 (sprint 24)` · `M7 v1.0 + INDAUTOR (sprint 26)` · `M8 Cierre (sprint 30)`.
