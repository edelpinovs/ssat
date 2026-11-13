# ADR-0001 · Stack React + NestJS + PostgreSQL
**Estado:** aceptada · 2026-11-13
**Contexto.** Equipo de 2 maestrantes con experiencia en JavaScript/Web, Cloud y SQL; materia de Programación Orientada a Objetos; hospedaje de bajo costo; necesidad de réplica fiel de tres identidades visuales del portal.
**Decisión.** Monorepo TypeScript: React 19 + Vite en el frontend, NestJS (módulos, servicios, DTOs, inyección de dependencias) en el backend, Prisma + PostgreSQL 16, Redis para sesiones, Docker Compose y Caddy para despliegue.
**Consecuencias.** Un solo lenguaje en todo el proyecto; arquitectura orientada a objetos explícita en el backend; dependencia de Node LTS; el motor de reglas se aísla en un paquete sin framework para probarlo de forma independiente.
