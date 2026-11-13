# Guía de contribución

## Flujo
1. Toma una historia del tablero (columna *Sprint actual*) y asígnatela.
2. Rama desde `main`: `feat/E2-03-calculadora-isr-aep` (prefijo `feat|fix|docs|chore|test` + id del backlog).
3. Commits con Conventional Commits: `feat(reglas): tarifa acumulada art. 106`.
4. Abre PR con la plantilla; enlaza la issue (`Closes #12`); pide revisión al otro desarrollador.
5. CI verde + 1 aprobación = merge con *squash*.

## Definición de Hecho (DoD)
- [ ] Criterios de aceptación de la historia cumplidos y demostrados al PO.
- [ ] Pruebas unitarias (motor de reglas ≥ 90 % cobertura) y e2e del flujo cuando aplique.
- [ ] Pantalla comparada contra la captura del portal real (`docs/levantamiento/`).
- [ ] Textos y fundamentos revisados por Contaduría (etiqueta `contenido-validado`).
- [ ] Sin errores críticos de accesibilidad (axe) ni de lint/typecheck.
- [ ] Documentación actualizada (`docs/`, ADR si hubo decisión).

## Estilo
TypeScript estricto, ESLint + Prettier (`pnpm lint`, `pnpm format`). Nombres de dominio en español (`Contribuyente`, `Declaracion`), código técnico en inglés cuando sea convención del framework.

## Reglas normativas
Toda regla nueva o cambio de tarifa entra por `packages/reglas/data/` con PR etiquetado `reglas` y revisado por Contaduría. Usa la plantilla de issue *Regla normativa*.
