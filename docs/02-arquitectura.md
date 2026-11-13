# Arquitectura

Ver sección 4 de `01-propuesta-desarrollo.md` para la vista general y el modelo de dominio. Decisiones en `adr/`.

## Diagrama de contenedores (C4 nivel 2)
```
[Alumno/Profesor/Editor] --HTTPS--> [Caddy] --> [web: React SPA]
                                            --> [api: NestJS] --> [PostgreSQL]
                                                               --> [Redis: sesiones, colas]
                                                               --> [pdf: Puppeteer] --> [Almacenamiento S3: acuses, respaldos]
```

## Flujo de un trámite
1. `web` pide a `api` el escenario asignado y el contribuyente ficticio.
2. Cada paso envía un DTO validado (Zod/class-validator) a `api/tramites/<tramite>`.
3. `Tramite.validar()` llama al `Evaluador` de `packages/reglas` con el contexto; devuelve avisos con fundamento.
4. Si no hay errores, `Tramite.avanzar()` persiste el estado; al final `generarAcuse()` usa `packages/pdf`.
5. Todo se registra en `Intento` (acciones, errores, tiempos) para el panel del profesor.

## Temas visuales
`portal` (oscuro #2b2b2b / dorado #c9a86a), `clasico` (blanco / guinda #7a1b3c, botones Cancelar rojo y Continuar azul en Buzón), `siat` (login con captcha). Banda roja permanente de simulador académico en todas las pantallas.
