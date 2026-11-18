---
title: "SSAT · Cotejo del envío 02 de Contaduría (Declaraciones) contra el plan en GitHub"
subtitle: "18 de noviembre de 2026 · v2 · continúa el cotejo v1 (envío 01, Módulo 1)"
---

# 1. Documentos revisados (carpeta `Enviado X Cliente/02`)

| # | Guía oficial del SAT | Versión | Págs. | Módulo SSAT | Historias afectadas |
|---|---|---|---|---|---|
| D5 | Pagos provisionales ISR · PF Actividades empresariales y profesionales | abril 2026 | 94 | 2 | E2-01…E2-07, E2-11 |
| D6 | Pagos definitivos IVA · Personas físicas | rev. 18-03-2025 | 93 | 2 | E2-04, E2-05 |
| D7 | Pagos mensuales ISR · RESICO PF | febrero 2026 | 69 | 2 | E2-09 |
| D8 | Declaración anual 2025 · Sueldos, salarios y asimilados | rev. 10-04-2026 | 65 | 3 | E3-01…E3-06 |
| D9 | Declaración anual 2025 · Arrendamiento de inmuebles | rev. 06-04-2026 | 75 | 3 | E3-01…E3-06, E2-10 |

Plan contra el que se coteja: repositorio `edelpinovs/ssat` (commit `ad78f49`, 13-11-2026): `backlog/backlog.csv` (idéntico al de la carpeta local), `docs/01-propuesta-desarrollo.md`, `docs/levantamiento/SSAT_Especificacion_Flujos_v0.1.md`, `packages/reglas` y `apps/api/prisma/schema.prisma`.

**Resumen.** El envío 02 es justo lo que se pidió en el punto 4.2 del cotejo v1 y cierra el levantamiento de los Módulos 2 y 3, que hasta hoy se había descrito "de memoria" porque el aplicativo requiere sesión. El alcance de la propuesta se confirma (AEP, RESICO, IVA, anual de PF), pero el detalle real es bastante más grande que lo estimado: **+83 puntos** (449 → ≈ 532). Hay además **cuatro correcciones de diseño** a la especificación v0.1 y al código ya existente en `packages/reglas`.

# 2. Correcciones a la especificación y al código actual

| # | Lo que dice el plan hoy | Lo que muestran las guías | Dónde corregir |
|---|---|---|---|
| C-1 | Menú del aplicativo: *Presentar declaración / Consultar declaración / Consultar pagos* | Provisionales (D5–D7): **Presentar declaración · Consultas · Presentación declaración otras obligaciones**. Anual (D8–D9): **Presentar declaración · Consultar declaración · Impresión de acuse · Declaraciones pagadas**, precedido por un aviso sobre el Buzón Tributario | Especificación §5 y §6; E2-01, E2-11, E3-01 |
| C-2 | "Pestañas por impuesto" (ISR e IVA en un mismo formulario) | Después de la configuración aparece **Administración de la declaración**: ejercicio, periodo, tipo y **fecha de vencimiento** arriba a la derecha, descripción de pasos y **una tarjeta por obligación** con su total a pagar. Cada obligación abre **su propio formulario** con apartados (ISR AEP: Ingresos, Deducciones autorizadas, Determinación, Pago, Datos adicionales; IVA: IVA a cargo, IVA acreditable, Determinación, Pago; RESICO: Ingresos, Determinación, Pago, Datos adicionales). Botón **Guardar** para guardar el borrador y retomarlo después | Especificación §5; descripción de E2; E2-04 |
| C-3 | E2-06: "Vista previa, envío **con contraseña o e.firma**" | En provisionales **no hay re-autenticación**: Administración → Vista previa (PDF) → *Enviar declaración* → confirmar Sí/No → acuse. En la **anual**, la e.firma solo se pide cuando el **saldo a favor es ≥ $10,001** (la especificación decía "> 10 mil"). Para enviar: *Revisar* → vista previa → *Enviar declaración* → mensaje con el monto → Sí | E2-06, E3-05, especificación §6 |
| C-4 | `pagos.ejemplo.json`: PAG-001 compara el IVA trasladado contra el 16 % de **todos** los ingresos; PAG-002 marca error si la retención de ISR supera el 10 %, en cualquier régimen | El IVA a cargo se separa por tasa: 16 %, 8 % de la región fronteriza, 0 % exportación, 0 % otros, exentos y no objeto. La retención de ISR depende del régimen (10 % en AEP y arrendamiento; en RESICO la guía la llama "ISR retenido por personas morales" y es otra tasa) | E2-05: reescribir PAG-001 por tasa y PAG-002 por régimen antes de usarlas como ejemplo para Contaduría |
| C-5 | `calculadoras/aep.ts`: base = ingresos acumulados − deducciones acumuladas | D5 §3: base gravable = ingresos − deducciones − **PTU** − **pérdidas fiscales de ejercicios anteriores**; además el impuesto del periodo se reduce con estímulos y luego se restan los pagos provisionales y las retenciones | E2-03 |
| C-6 | `schema.prisma` no tiene modelos `CFDI` ni `Declaracion` (aunque E0-04 menciona `Declaracion`) | Toda la precarga sale de CFDI emitidos y recibidos (tipo I/E/P/nómina, método PUE, complemento de pagos, forma de pago bancarizada, uso de CFDI, tasa de IVA, retenciones) y de las declaraciones previas del ejercicio (pagos anteriores, ingresos de meses anteriores) | E0-04 y E2-02 |

# 3. Hallazgos por guía

## 3.1 Patrón común a las cinco guías (vale para todo el aplicativo)

- **Acceso**: cada guía muestra la entrada con contraseña (RFC, contraseña y captcha) y con e.firma (.cer, .key y contraseña de la clave privada). Esto confirma el ADR-0004 (un login por aplicativo). Hay varias puertas de entrada al mismo aplicativo: por régimen (*Personas → Régimen → 5 Declara*) o por *Trámites y servicios → Declaraciones para personas → Provisionales y definitivas / Anual*.
- **Configuración**: ejercicio, periodicidad, periodo y tipo (Normal o Complementaria, con un *tipo de complementaria*). Las obligaciones del RFC aparecen marcadas y se pueden activar o desactivar; puede salir un mensaje de aviso. Al cargar se muestra un mensaje con **las fuentes de información y la fecha de corte** de la precarga.
- **Ventanas de captura**: se repiten decenas de veces con la misma mecánica: *Capturar → Instrucciones → Agregar → Concepto + Importe → Guardar → Eliminar (con confirmación Aceptar/Cancelar) → Cerrar*. Junto a ellas aparecen *Ver detalle* (visor de las facturas que forman un monto precargado) y la ventana de **compensaciones** (*Agregar / Continuar / Terminar*). Conviene construirlas una sola vez como componentes reutilizables.
- **Campos calculados e inhabilitados**: cada guía dice qué campos se capturan y cuáles se calculan. Eso es la especificación del formulario y de las calculadoras.
- **Pago**: el apartado Pago se repite (a cargo, parte actualizada, recargos, total de contribuciones, compensaciones, estímulos, total de aplicaciones, cantidad a cargo y cantidad a pagar). **Parte actualizada y recargos solo se habilitan si la declaración es extemporánea.**
- **Acuse**: el *Acuse de recibo · Declaración provisional o definitiva de impuestos federales* trae tipo de declaración, periodicidad, ejercicio, periodo, medio de presentación, versión, fecha y hora, vencimiento, **número de operación** y la sección **Línea de captura** (importe y vigencia), además de la lista de bancos autorizados y el sello digital. En la anual, la línea de captura viene dentro del mismo acuse.

## 3.2 D5 · ISR Actividades empresariales y profesionales (provisional)

- **Ingresos**: copropiedad Sí/No (con Sí se activa *Datos adicionales*), ingresos cobrados (precargados de CFDI PUE y de complementos de pago), ingresos a disminuir y adicionales (preguntas Sí/No que abren ventanas de captura), ingresos exentos por derechos de autor (solo con la obligación 31 o con ciertas actividades: 2323, 2324, 1028, 1029, 2322), ingresos de meses anteriores (precargados) y total del periodo.
- **Deducciones autorizadas**: nómina no precargada, compras y gastos (desglose de 9 renglones: facturados PUE bancarizados, devoluciones, no deducibles, sin factura, egresos, meses anteriores solo de declaraciones pagadas…), deducción de inversiones, deducción inmediata (Decreto de Relocalización / Plan México) y estímulos.
- **Determinación**: PTU (con límite), pérdidas fiscales (con límite), base gravable, impuesto causado con la **tarifa del Anexo 8 de la RMF**, estímulo de la región fronteriza (reduce una tercera parte), estímulos, impuesto del periodo, pagos provisionales anteriores, ISR retenido e impuesto a cargo.
- **Datos adicionales (copropiedad)**: RFC del representante común (13 posiciones), integrantes con su porcentaje (la suma debe ser 100 %), ingresos e ISR por integrante.

## 3.3 D6 · IVA personas físicas (definitivo)

- Es **otra obligación con su propio formulario**, no una pestaña de ISR (ver C-2).
- **IVA a cargo**: valor de actos a 16 %, región fronteriza (8 %), 0 % exportación (captura), 0 % otros, exentos y no objeto; ajustes por reintegro.
- **IVA acreditable**: actos pagados a 16 %, región fronteriza, importación, 0 % y exentos; **proporción de IVA por art. 5 o 5-B de la LIVA** para el IVA de uso indistinto.
- **Determinación**: IVA retenido (precargado), otras cantidades a cargo o a favor, **acreditamiento de saldos a favor de periodos anteriores**, y cuando hay saldo a favor: devolución inmediata e impuesto a favor.
- Criterio de precarga de lo recibido: PUE, **forma de pago bancarizada** y uso de CFDI "adquisición de mercancías / gastos en general". El generador de CFDI ficticios (E2-02) debe producir estos atributos, porque si no la precarga no se puede reproducir.

## 3.4 D7 · RESICO personas físicas (mensual)

- No hay deducciones ni tarifa acumulada: el impuesto es **ingresos cobrados del mes × tasa** con la tabla de la guía: hasta 25,000 → 1.00 %; hasta 50,000 → 1.10 %; hasta 83,333.33 → 1.50 %; hasta 208,333.33 → 2.00 %; hasta 3,500,000 → 2.50 %.
- Ingresos: descuentos y devoluciones (CFDI de egreso), ingresos a disminuir y adicionales, y **detalle del ingreso por tipo de actividad**.
- **Sector primario**: exención de **$900,000 al año**, con cálculo de la base gravable y dos mensajes informativos según se mezclen actividades o no.
- Determinación: pagos efectuados con anterioridad en AEP o arrendamiento (para quien cambió de régimen) e ISR retenido por personas morales; Pago y Datos adicionales iguales a D5.

## 3.5 D8 · Anual 2025 de sueldos, salarios y asimilados

- **Configuración**: los *Ingresos a declarar* aparecen marcados y **no se pueden desmarcar si hay precarga**; se pregunta por ingresos en el extranjero.
- **Ingresos**: precarga **por retenedor** con la pregunta *¿Aceptas y reconoces la información precargada?*; si se responde No, hay que eliminar el registro. Se pueden agregar retenedores. Hay pestañas para asimilados, indemnización, jubilación en parcialidades, jubilación en pago único e ingresos del seguro de retiro. Mensaje si los exentos superan el **47 %**; ingresos no acumulables (indemnización y pago único, con el último sueldo mensual ordinario); subsidio; impuesto retenido.
- **Deducciones personales**: cuadrícula de íconos con **contador rojo** de CFDI; *Facturado / Deducible*; aceptar o reconocer; por factura *Validar / Ver CFDI / Eliminar*; cantidad recuperada; *Agregar*; sección de **eliminadas**; **Sin clasificación** (con el motivo y la opción de reclasificar); botón *Actualizar*. El tope para 2025 es el **menor entre $206,368 y el 15 % de los ingresos totales**.
- **Determinación**: tarifa del art. 152 (Anexo 8), subsidio, ISR por ingresos no acumulables, pagos provisionales, retenciones. Saldo a favor → **Devolución** (CLABE de 18 dígitos y confirmación de titularidad) o **Compensación**.
- **Datos informativos**: otros ingresos exentos mayores a $600,000 (préstamos, donativos, premios, viáticos, casa habitación, herencias), apoyos gubernamentales y **esquemas reportables**.
- **Pago**: compensaciones, **parcialidades (hasta 6)** con el cálculo de la primera y del resto, y la cantidad a pagar.

## 3.6 D9 · Anual 2025 de arrendamiento

- Se agrega la pregunta **ISSIF (art. 32-H del CFF)** en la configuración.
- **Ingresos** en tres secciones: *Datos de nómina* (el arrendador con trabajadores: nómina deducible y no deducible, asimilados, subsidio), *ISSIF* y *Arrendamiento* (datos iniciales con copropiedad; tipo arrendamiento, subarrendamiento o ambos; ingresos cobrados precargados de los provisionales; exentos; FIBRAS).
- **Deducciones**: **opcional del 35 %** o **comprobable**, más el **impuesto predial** en los dos casos. Solo en la anual se puede cambiar la opción elegida en los provisionales (art. 196 del RLISR).
- Estímulos (contratación de personas con discapacidad y adultos mayores), resultado, detalle de los pagos provisionales con su número de operación, y **retenciones de personas morales** con la opción *Agregar desde archivo*.
- Regla transversal que se repite: para corregir ingresos, deducciones o retenciones de la anual hay que presentar **complementarias de los provisionales**. Esto une el Módulo 2 con el 3 y conviene llevarlo a un escenario de práctica.

# 4. Decisiones propuestas

**D-4 · Alcance de estímulos y casos especiales.** Las guías usan como ejemplo un contribuyente de la región fronteriza con estímulos. Para el MVP se propone mostrar esas preguntas con "No" por defecto y los campos ocultos, sin cálculo: región fronteriza (IVA 8 % y una tercera parte del ISR), Plan México, Decreto de Relocalización, deducción inmediata, ISSIF, FIBRAS y esquemas reportables. Quedan como escenarios avanzados que se pueden activar después. **Lo decide Contaduría.**

**D-5 · Formularios por obligación sobre componentes comunes.** El aplicativo se modela como *Configuración → Administración de la declaración → formulario por obligación → Vista previa → Envío → Acuse con línea de captura*. Las ventanas de captura, los visores *Ver detalle*, las compensaciones, la copropiedad y el bloque Pago se construyen una vez y los usan AEP, IVA, RESICO y la anual.

**D-6 · Escenario inicial del Módulo 3.** El primer escenario de la anual será **sueldos y salarios con deducciones personales** (D8), que es el caso más común del alumno y ya está completamente especificado. Arrendamiento (D9) va después.

**D-7 · El modelo de datos se adelanta.** `CFDI` y `Declaracion` (con su estatus presentada / pagada / pagada en cero, número de operación y versión) entran en E0-04, porque de ellos dependen la precarga, los "meses anteriores" y la regla de las complementarias.

# 5. Cambios al backlog (`backlog/backlog.csv`)

| Acción | Historia | Puntos | Sprint propuesto |
|---|---|---|---|
| Modificar | E0-04 Esquema Prisma: agregar `CFDI` (tipo, método, forma de pago, uso, tasas, retenciones, nómina) y `Declaracion` (obligación, periodo, tipo, estatus, número de operación, versión) | 8 → 11 | 1 |
| Modificar | E2 (épica): "formularios por obligación desde Administración de la declaración" en lugar de "pestañas" | — | — |
| Modificar | E2-01 Configuración y **Administración de la declaración**: menú real (C-1), activar o desactivar obligaciones, mensaje de fuentes y fecha de corte, tarjetas por obligación con total, vencimiento, Guardar y retomar | 5 → 8 | 7 |
| Modificar | E2-02 CFDI ficticios con los atributos que exige la precarga (I/E/P/N, PUE/PPD, complemento de pagos, forma bancarizada, uso, tasa de IVA, retenciones) y visores *Ver detalle* | 8 → 13 | 8 |
| Modificar | E2-03 Calculadora AEP: PTU y pérdidas con límite, exentos por derechos de autor, compras y gastos con sus 9 renglones, inversiones; base y determinación según D5 (C-5) | 13 | 8 |
| Modificar | E2-04 Formulario **IVA PF** (obligación propia): IVA a cargo por tasa, acreditable con proporción art. 5 / 5-B, retenido, acreditamiento de saldos anteriores, devolución inmediata | 8 → 13 | 9 |
| Modificar | E2-05 Reglas de pagos: rehacer PAG-001 por tasa y PAG-002 por régimen (C-4); extemporaneidad que habilita actualización y recargos | 8 | 10 |
| Modificar | E2-06 Vista previa y envío **sin re-autenticación** (C-3); acuse con número de operación y sección de línea de captura | 8 | 10 |
| Modificar | E2-09 RESICO PF (cálculo y formulario): tabla de tasas mensual, ingresos por actividad, exención del sector primario de $900,000 con sus mensajes, retenido por PM, pagos de otros regímenes | 8 → 13 | 11 |
| Bloquear | E2-10 Arrendamiento provisional: **falta la guía** de pagos provisionales de arrendamiento | 8 | 16 (sujeto a la guía) |
| Nueva | E2-12 Formulario ISR AEP: apartados Ingresos, Deducciones autorizadas, Determinación, Pago y Datos adicionales, con campos capturables y calculados según D5 | 13 | 9 |
| Nueva | E2-13 Componentes de captura reutilizables: ventana Capturar/Instrucciones/Agregar/Eliminar, *Ver detalle*, compensaciones (Agregar/Continuar/Terminar), bloque Pago | 8 | 7 |
| Nueva | E2-14 Copropiedad / Datos adicionales: representante común, integrantes, suma = 100 %, consistencia con los ingresos | 5 | 11 |
| Dividir | E3-01 → **E3-01a** Configuración anual (menú de 4 opciones, aviso del Buzón, ingresos a declarar bloqueados si hay precarga, extranjero, ISSIF) y **E3-01b** Ingresos de sueldos y asimilados (aceptar o rechazar por retenedor, 5 pestañas, exentos, mensaje del 47 %, no acumulables) | 8 → 5 + 13 | 12 |
| Modificar | E3-02 Deducciones personales según D8 (íconos con contador, validar, ver CFDI, eliminar, eliminadas, sin clasificación y reclasificación, Actualizar, tope 2025) | 8 → 13 | 12 |
| Modificar | E3-04 Saldo a favor y a cargo: CLABE de 18 dígitos con confirmación, parcialidades hasta 6 con la primera calculada, compensaciones | 8 | 14 |
| Modificar | E3-05 Envío anual: *Revisar*, e.firma solo con saldo a favor ≥ $10,001, acuse con línea de captura | 8 | 14 |
| Nueva | E3-07 Ingresos de **arrendamiento** en la anual (datos de nómina, tipo de arrendamiento, exentos, deducción opcional 35 % o comprobable + predial, estímulos, provisionales, retenciones con carga de archivo) | 13 | 13 |
| Nueva | E3-08 Datos informativos (exentos > $600,000, apoyos, esquemas reportables) | 5 | 15 |
| Modificar | E5-02 Parámetros por ejercicio: tabla RESICO, tope de deducciones personales, límite de exención primaria, umbral de e.firma, umbral de $600,000, porcentaje del 47 % | 5 → 8 | 7 |

**Impacto.** +44 puntos en E2, +33 en E3, +3 en E0 y +3 en E5: **≈ +83 puntos**, con lo que el total comprometido pasa de 449 a **≈ 532**. Con el calendario actual, el Módulo 2 ya no cabe en los sprints 7–10 (E2 sube de 87 a 131 puntos). Se propone:

- Sprints 7–10 (24–26 puntos cada uno): núcleo del Módulo 2 = 100 puntos. S7: E2-01, E2-13, E5-02 · S8: E2-02, E2-03 · S9: E2-12, E2-04 · S10: E2-05, E2-06, E2-07.
- Sprint 11 (entra el becario): RESICO, complementaria, consultas y copropiedad (E2-09, -08, -11, -14 = 31). **El hito M3 pasa del sprint 10 al 11.**
- Sprints 12–15: Módulo 3 (83 puntos). S12: E3-01a, E3-01b, E3-02 · S13: E3-03, E3-07 · S14: E3-04, E3-05 y E5-04 · S15: E3-06, E3-08 junto con lo que ya estaba (E5-05, E6-03). **El hito M4 pasa del sprint 14 al 15.** M5 (MVP integrado, sprint 18) no se mueve.
- Si hay que recortar, los primeros candidatos son E2-10, E2-14 y E3-08.

**Riesgo previo que conviene atender.** Con los cambios del v1, el sprint 5 suma 62 puntos y el 6 suma 39, muy por encima de la capacidad de 20–25. Hay que repartirlos antes de cargar el calendario en GitHub Projects; los sprints 0–4 (15–29 puntos) y 11 son los que tienen margen.

# 6. Qué pedir a Contaduría ahora

1. **Guía de pagos provisionales de arrendamiento** (2025 en adelante). E2-10 está bloqueada sin ella.
2. Si entran en el MVP, las guías de la anual por **actividad empresarial y profesional** e **intereses** (capítulos que la propuesta incluye en E3-01).
3. **Casos resueltos con cifras** (2–3 por régimen: AEP, IVA, RESICO, anual de sueldos y anual de arrendamiento) para `packages/reglas/test/casos`; E2-03 y E3-03 los exigen como criterio de aceptación.
4. **Contenido de las listas desplegables** que las guías no traen: conceptos de ingresos a disminuir y adicionales, tipos de estímulo, tipos de deducción personal, tipos de complementaria y motivos de "no clasificación".
5. **Decisión D-4** (estímulos, región fronteriza, ISSIF, FIBRAS, esquemas reportables: dentro o fuera del MVP).
6. **Confirmar cuatro puntos dudosos de las guías**:
   - Tope de deducciones personales: dice "$206,368.00" con letra "80/100". ¿Cuál es el importe?
   - Anual de arrendamiento: "Ingresos acumulables = Ingresos − Deducciones **+** Estímulos fiscales". ¿El signo es correcto?
   - RESICO: la definición de "Impuesto a favor" frente al ISR retenido por personas morales.
   - RESICO: cómo debe tratar el simulador los ingresos mayores a $3,500,000 (¿solo 2.5 % o advertencia de pérdida del régimen?).
7. Sigue pendiente del v1: catálogos con clave (actividades, regímenes y obligaciones), guía o capturas de Citas, y un acuse y una CSF anonimizados en alta resolución.

# 7. Ajustes al prototipo (siguiente iteración)

- Menú del aplicativo Declaraciones y Pagos y pantalla **Administración de la declaración** con tarjetas por obligación.
- Formulario ISR AEP por apartados y formulario IVA aparte; una ventana de captura modelo y un visor *Ver detalle*.
- Vista previa → confirmación → **acuse con número de operación y línea de captura**.
- Anual: configuración con ingresos a declarar, aceptación por retenedor, cuadrícula de deducciones personales con contadores y "Sin clasificación", saldo a favor con CLABE y pago en parcialidades.

# 8. Aplicado en el repositorio (18-nov-2026)

- `backlog/backlog.csv`: historias modificadas, divididas (E3-01 → E3-01a / E3-01b) y nuevas (E2-12, E2-13, E2-14, E3-07, E3-08), con puntos y sprints de la sección 5. Total comprometido: 532 puntos.
- `docs/03-backlog.md` y `docs/01-propuesta-desarrollo.md`: épicas, hitos (M3 → sprint 11, M4 → sprint 15), alcance de los Módulos 2 y 3 y plan de entregas.
- `docs/levantamiento/SSAT_Especificacion_Flujos_v0.1.md`: §5 y §6 reescritos con el flujo de las guías (C-1, C-2, C-3).
- `packages/reglas`: PAG-001 por tasa, PAG-002 por régimen y nueva PAG-004 para RESICO (1.25 %, a validar con Contaduría) (C-4); `pagoProvisionalAEP` con PTU, pérdidas fiscales y estímulos, y sus pruebas (C-5).
- `docs/levantamiento/docs_contaduria/02-*.pdf`: las cinco guías del envío 02.
- Pendiente: el esquema Prisma (C-6) se implementa en E0-04 (sprint 1), y hay que repartir la carga de los sprints 5 y 6.
