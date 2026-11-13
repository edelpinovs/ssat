# packages/reglas
Motor de reglas declarativas y calculadoras fiscales. Sin dependencias de framework.
- `src/evaluador.ts` evalúa reglas (`data/reglas/*.json`) contra el contexto del trámite y devuelve avisos `{codigo, severidad, mensaje, fundamento}`.
- `src/calculadoras/` estrategias por régimen: `aep.ts` (art. 106), `resico.ts`, `arrendamiento.ts`, `anualPF.ts` (art. 152).
- `data/tarifas/<ejercicio>/` tarifas ISR mensual/anual, subsidio, UMA, topes.
Pruebas: `pnpm --filter reglas test` (casos de Contaduría en `test/casos/`).
