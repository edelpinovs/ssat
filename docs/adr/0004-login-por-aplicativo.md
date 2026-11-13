# ADR-0004 · Un login por aplicativo con SSO simulado opcional
**Estado:** aceptada · 2026-11-13
**Contexto.** En el portal real, Mi espacio SAT, Buzón y Declaraciones piden autenticarse por separado (con captcha).
**Decisión.** Por defecto el simulador reproduce ese patrón; el profesor puede activar `SSAT_SSO_SIMULADO` para reducir fricción en prácticas cortas.
**Consecuencias.** El alumno vive la experiencia real; la sesión del simulador (cuenta institucional) es independiente de las sesiones simuladas del contribuyente.
