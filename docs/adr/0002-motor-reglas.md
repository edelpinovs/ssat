# ADR-0002 · Motor de reglas declarativo editable por Contaduría
**Estado:** aceptada · 2026-11-13
**Contexto.** Las respuestas de la autoridad y los fundamentos cambian cada ejercicio y los redacta Contaduría, no Sistemas.
**Decisión.** Reglas en JSON validadas por esquema (`packages/reglas/data/reglas/schema.json`): condición segura (sin `eval`), severidad, mensaje, fundamento, sugerencia y vigencia. Tarifas y catálogos por ejercicio. Panel de contenido con versiones y publicación.
**Consecuencias.** Contaduría carga y edita sin desplegar código; las reglas se prueban con casos de Contaduría; el evaluador debe mantenerse pequeño y auditable.
