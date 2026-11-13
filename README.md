# SSAT · Simulador académico del portal del SAT

Simulador web para que estudiantes de Contaduría practiquen trámites fiscales (inscripción y obligaciones, pagos provisionales, declaración anual y citas) con contribuyentes ficticios y retroalimentación normativa inmediata.

> **Simulador académico.** No es el portal del SAT, no se conecta a servicios del SAT y no usa logotipos oficiales. Todos los RFC, nombres, montos y acuses son ficticios y carecen de validez fiscal.

## Estado

Pre-arranque (nov 2026 – feb 2027). Convocatoria de fomento a la investigación: ejecución mar 2027 – may 2028.

| Documento | Ruta |
|---|---|
| Propuesta de desarrollo | [`docs/01-propuesta-desarrollo.md`](docs/01-propuesta-desarrollo.md) |
| Arquitectura y ADRs | [`docs/02-arquitectura.md`](docs/02-arquitectura.md) · [`docs/adr/`](docs/adr/) |
| Backlog inicial | [`docs/03-backlog.md`](docs/03-backlog.md) · [`backlog/backlog.csv`](backlog/backlog.csv) |
| Especificación de flujos del portal real | `docs/levantamiento/` (capturas y textos del 12-nov-2026) |
| Prototipo navegable | Claude Design: *SSAT · Prototipo del Simulador SAT* |

## Estructura del repositorio

```
ssat/
├── apps/
│   ├── web/            React 19 + TypeScript + Vite · pantallas del simulador y paneles
│   └── api/            NestJS + Prisma + PostgreSQL · dominio, trámites, acuses, bitácora
├── packages/
│   ├── reglas/         Motor de reglas declarativas y calculadoras ISR/IVA (TS puro, Vitest)
│   ├── shared/         Tipos, catálogos, validadores RFC/CURP, contratos de API
│   └── pdf/            Plantillas y generación de acuses, constancias y líneas de captura
├── docs/               Propuesta, arquitectura, ADRs, backlog, plantillas, levantamiento
├── backlog/            backlog.csv + script para crear issues con gh
├── infra/              docker-compose, Caddyfile, scripts de respaldo
└── .github/            Plantillas de issues/PR, workflows de CI, etiquetas, CODEOWNERS
```

## Arranque rápido (desarrollo)

Requisitos: Node 22, pnpm 9, Docker.

```bash
pnpm install
cp .env.example .env
docker compose -f infra/docker-compose.yml up -d postgres redis
pnpm --filter api prisma migrate dev
pnpm --filter api seed          # contribuyentes ficticios, tarifas y reglas de ejemplo
pnpm dev                        # web en http://localhost:5173 · api en http://localhost:3000
```

## Forma de trabajo

- Scrum, sprints de 2 semanas; tablero en GitHub Projects (ver `docs/03-backlog.md`).
- Trunk-based: ramas `feat/<id>-descripcion`, `fix/...`, `docs/...`; PR con revisión cruzada; `main` protegido; CI verde obligatorio.
- Convención de commits: [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat(reglas): ...`, `fix(web): ...`).
- Definición de Hecho en [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Equipo

Ing. Edel Pino González · Ing. Darian Pérez Fuentes (desarrollo) · Dr. Francisco Eduardo Oliva Ibarra (revisión técnica) · Academia de Contaduría, CUValles (contenido normativo).

## Licencia

Código propiedad del Centro Universitario; registro ante INDAUTOR en trámite. Ver [`LICENSE`](LICENSE).
