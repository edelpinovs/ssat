# apps/api
NestJS + Prisma + PostgreSQL. Módulos (uno por trámite, arquitectura orientada a objetos):
```
src/
├── auth/            cuentas institucionales, roles, JWT
├── contribuyentes/  generador y padrón ficticio, credenciales simuladas
├── tramites/        Tramite (abstracta) → inscripcion, obligaciones, pagos, anual, citas
├── declaraciones/   configuración, cálculo (usa packages/reglas), acuses, líneas de captura
├── reglas/          carga y versiones de reglas y tarifas (editor de contenido)
├── escenarios/      grupos, escenarios, intentos, bitácora
├── acuses/          generación PDF (packages/pdf)
└── common/          guards, filtros, DTOs
```
`pnpm --filter api prisma migrate dev` · `pnpm --filter api seed`.
