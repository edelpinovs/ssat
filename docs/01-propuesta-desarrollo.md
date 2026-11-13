---
title: "SSAT · Propuesta de desarrollo de software"
subtitle: "Simulador académico del portal del SAT · Versión 1.1 · 13 de noviembre de 2026 (incorpora el cotejo de los documentos de Contaduría)"
---

# 1. Resumen

SSAT es una aplicación web que replica la navegación, formularios y respuestas del portal del SAT para que los alumnos de Contaduría practiquen trámites con contribuyentes ficticios. Esta propuesta define **qué se construye, cómo, con qué, en qué orden y cómo se mide**, a partir del levantamiento del portal real (12-nov-2026), la minuta y la entrevista con Contaduría (10-nov-2026), los documentos oficiales enviados por Contaduría (guía del aviso de obligaciones, ABC de la actualización del RFC, Formato 3/CFF y guía de Oficina Virtual) y el prototipo navegable v0.2 en Claude Design.

| Dato | Valor |
|---|---|
| Equipo de desarrollo | Ing. Edel Pino González, Ing. Darian Pérez Fuentes (maestrantes) · 1 becario de licenciatura (meses 6–11) · revisión técnica Dr. Francisco Eduardo Oliva Ibarra |
| Contenido normativo | Academia de Contaduría (Dra. coordinadora, Dr. Miguel) |
| Duración | 15 meses de ejecución (mar 2027 – may 2028) + pre-arranque (nov 2026 – feb 2027) |
| Metodología | Scrum: sprints de 2 semanas, entrega semanal de avance, demo quincenal |
| Alcance comprometido | Fase 1 (acceso, inscripción/obligaciones, pagos provisionales, declaración anual) + Citas |
| Alcance opcional | Actualización del RFC, contraseña y e.firma (meses 10–13) |
| Ampliación | CFDI, buzón, expediente, manuales (nueva convocatoria) |

# 2. Objetivos y criterios de éxito

**Objetivo general.** Que el alumno domine los trámites más comunes del SAT antes de egresar, sin riesgo y con retroalimentación normativa inmediata.

**Criterios de éxito medibles (v1.0, mayo 2028):**

1. Los 4 módulos comprometidos se completan de inicio a acuse con contribuyentes ficticios.
2. ≥ 90 % de las pantallas de los flujos replicados coinciden en estructura, orden de campos y textos con el portal real (verificación con la matriz de capturas).
3. Cada error del alumno recibe una respuesta con fundamento legal (ISR, IVA, CFF, RCFF, RMF) cargada por Contaduría, sin intervención de Sistemas.
4. Piloto con ≥ 2 grupos y medición pre/post de confianza y de errores por intento.
5. Disponibilidad ≥ 99 % en horario escolar durante los pilotos; tiempo de respuesta < 1 s en formularios.
6. Registro INDAUTOR, 2 artículos y 2 ponencias.

# 3. Alcance funcional por módulo

## 3.1 Módulo 0 · Acceso y contribuyentes ficticios
- Cuenta institucional del alumno (correo @alumnos.udg.mx, contraseña propia del simulador o SSO institucional si está disponible).
- Generador de contribuyentes ficticios: RFC con estructura válida (nunca real, verificado contra lista de exclusión), CURP ficticia, nombre, domicilio, régimen inicial, obligaciones, medios de contacto.
- Login SIAT simulado: RFC + contraseña + captcha legible; opción e.firma con archivos .cer/.key ficticios y contraseña de clave privada. Un login por aplicativo, como en el portal real (opción de SSO simulado configurable por el profesor).
- Tablero "Mi espacio": datos del contribuyente, obligaciones, práctica asignada, historial de acuses.

## 3.2 Módulo 1 · Inscripción al RFC y obligaciones
Se modela como la secuencia real del SAT (decisión D-1 del cotejo): primero la inscripción por Oficina Virtual y después el aviso de actualización de obligaciones para asumir el régimen.
- **Inscripción por Oficina Virtual:** cita (Módulo 4) → Formato 3/CFF digital con sus cuatro bloques (identificación con CURP a 18 posiciones; tipo de inscripción 1 mexicanos en el extranjero / 2 sueldos y salarios / 3 sin obligaciones y origen de los ingresos; domicilio completo; manifestación y firma) → PDF del formato para "firmar y enviar" → sesión virtual simulada → RFC, **Constancia de Situación Fiscal (CSF)** y acuse de inscripción.
- **Aviso de actualización de actividades económicas y obligaciones** (flujo oficial de la guía del SAT, decisión D-2): autenticación por contraseña o e.firma → Paso 1 representante legal y fecha de movimiento → Paso 2 datos de ubicación (condicional) → Paso 3 cuestionario: tipos de ingreso (lista jerárquica oficial con ayudas), grupo de actividad → actividad del catálogo con clave → forma en que se realiza y porcentaje (suma 100 %, una preponderante), relaciones, preguntas complementarias → resumen con régimen y claves, características y obligaciones con próximo vencimiento y estatus Nueva/Baja, características eliminadas → vista preliminar bajo protesta → re-autenticación → folio RF → acuse de movimientos de actualización (2 páginas) y nueva CSF.
- Suspensión y reanudación de actividades (mismo motor, prioridad baja).
- Requiere los catálogos oficiales con clave (actividades económicas por grupo, regímenes c_RegimenFiscal, obligaciones 7xx con regla de vencimiento) que entrega Contaduría.

## 3.3 Módulo 2 · Pagos provisionales (aplicativo "Declaraciones y Pagos")
- Configuración: ejercicio, periodicidad, periodo, tipo (normal/complementaria), obligaciones precargadas por RFC.
- Pestañas ISR (ingresos precargados de CFDI ficticios, deducciones, determinación con tarifa acumulada art. 106 LISR, pagos anteriores, retenciones), IVA (trasladado, acreditable, retenido, saldo a favor), Pago (a cargo / a favor, compensación).
- Vista previa, envío con contraseña o e.firma, acuse de recibo y línea de captura con vigencia; pago simulado; recargos y actualización si vence.
- Regímenes del MVP: Actividades empresariales y profesionales, RESICO, Arrendamiento; Sueldos (solo retenciones) opcional.

## 3.4 Módulo 3 · Declaración anual
- Selección de tipo de declaración, ingresos por capítulo precargados (nómina y facturas ficticias), deducciones personales con topes, determinación anual, subsidio, saldo a favor/a cargo, pago en parcialidades o devolución (CLABE ficticia), envío con e.firma cuando aplique, acuse.

## 3.5 Módulo 4 · Citas
- Registro de cita (con RFC / inscripción PF), selección de servicio, entidad y módulo, calendario con disponibilidad simulada, confirmación, acuse con folio y QR, correo simulado, consulta y cancelación.

## 3.6 Transversal · Motor de reglas y retroalimentación
- Reglas declarativas (JSON/YAML versionadas por ejercicio fiscal): condición → severidad → mensaje al contribuyente → fundamento (ley, artículo, fracción) → sugerencia pedagógica.
- Tablas y tarifas por ejercicio (ISR mensual y anual, subsidio, UMA, topes de deducciones) editables desde el panel de contenido.
- Reglas del aplicativo tomadas de la guía oficial (OBL-001…005): baja de características no reseleccionadas, porcentajes que suman 100 % con una sola preponderante, campos obligatorios, expiración de sesión a ~20 minutos (configurable) y mensajes de ayuda por tipo de ingreso.
- **Constancia de Situación Fiscal** como producto transversal (decisión D-3): se genera en la inscripción, se regenera en cada aviso y se consulta desde Mi espacio; el fundamento legal que muestra el SSAT es un apoyo pedagógico que el SAT no exhibe.
- Bitácora de intentos: cada acción, error y acuse por alumno, para evaluación e investigación.

## 3.7 Transversal · Panel del profesor y panel de contenido
- Profesor: grupos, escenarios (contribuyente + datos + resultado esperado + rúbrica), seguimiento de intentos, exportación CSV.
- Contaduría (editor de contenido): CRUD de reglas, mensajes, catálogos, tarifas, con historial de cambios y vista previa.
- Administrador: usuarios, respaldos, parámetros, versiones del simulador.

# 4. Arquitectura

## 4.1 Vista general
Monorepo con tres aplicaciones y dos paquetes compartidos:

| Componente | Tecnología | Responsabilidad |
|---|---|---|
| `apps/web` | React 19 + TypeScript + Vite, React Router, TanStack Query, Zustand; componentes propios con tres temas (portal, clásico guinda, login SIAT) | Pantallas del simulador, paneles de profesor/contenido/admin |
| `apps/api` | Node 22 + NestJS + TypeScript, Prisma ORM, PostgreSQL 16, Redis (sesiones y colas), Zod/class-validator | Dominio, trámites, autenticación, acuses, bitácora |
| `packages/reglas` | TypeScript puro | Motor de reglas y calculadoras ISR/IVA por régimen; sin dependencias de framework; probado con Vitest |
| `packages/shared` | TypeScript | Tipos, catálogos (regímenes, obligaciones, actividades), validadores de RFC/CURP, formato de acuses |
| `packages/pdf` | Puppeteer + plantillas HTML | Acuses, constancias, líneas de captura con sello "SIMULADOR ACADÉMICO" |
| Infraestructura | Docker Compose, Caddy (TLS automático), GitHub Actions, respaldos nocturnos a almacenamiento S3-compatible | Despliegue en servidor de la universidad o VPS |

## 4.2 Modelo de dominio (núcleo orientado a objetos)
- `Contribuyente` (RFC, CURP, nombre, domicilio, regímenes[], obligaciones[], mediosContacto, estado) · `Credenciales` (contraseña, e.firma ficticia, vigencias).
- `Tramite` (abstracta: pasos[], validar(), avanzar(), generarAcuse()) → `InscripcionRFC`, `AvisoObligaciones`, `PagoProvisional`, `DeclaracionAnual`, `Cita`, `ActualizacionRFC`, `GeneracionEFirma`.
- `Declaracion` (periodo, régimen, conceptos, cálculo, lineaCaptura, estado) · `Calculo` (estrategia por régimen: `CalculadoraAEP`, `CalculadoraRESICO`, `CalculadoraArrendamiento`, `CalculadoraAnualPF`).
- `ReglaNormativa` (código, condición, severidad, mensaje, fundamento, vigencia) · `Tarifa` (ejercicio, tramos).
- `Escenario` (contribuyente, datos del caso, resultado esperado, rúbrica) · `Intento` (alumno, escenario, acciones[], errores[], acuses[], tiempo, calificación).
- `Usuario` (alumno | profesor | editor | admin) · `Grupo`.

## 4.3 Decisiones registradas (ADR)
- ADR-0001 Stack React + NestJS + PostgreSQL (alineado a POO, al equipo y a hospedaje de bajo costo).
- ADR-0002 Motor de reglas declarativo en JSON versionado, editable por Contaduría.
- ADR-0003 Identidad visual propia "SSAT" sin logotipos oficiales; estructura y colores replicados.
- ADR-0004 Un login por aplicativo (fiel al SAT) con SSO simulado opcional.
- ADR-0005 Datos 100 % ficticios; generador con lista de exclusión y sin conexión a servicios del SAT.

# 5. Metodología y forma de trabajo

- **Scrum** con sprints de 2 semanas (30 sprints en 15 meses), planeación el lunes, demo y retrospectiva el viernes de la segunda semana. **Entrega semanal** a la coordinación: avance + bitácora + riesgos.
- **Roles:** Product Owner académico (Dra. coordinadora), Experto de dominio (Dr. Miguel), Scrum Master y Tech Lead (Edel), Desarrollador (Darian), Becario (frontend y pruebas), Revisor técnico (Dr. Oliva).
- **Flujo Git:** trunk-based con ramas cortas `feat/`, `fix/`, `docs/`; PR obligatorio con revisión cruzada; `main` protegido; CI verde para fusionar; etiquetas semánticas `v0.1.0`…
- **Definición de Hecho (DoD):** historia aceptada por el PO en demo; pruebas unitarias del motor ≥ 90 % de cobertura; pruebas e2e del flujo; pantalla comparada contra captura del portal; textos revisados por Contaduría; documentación actualizada; sin errores de accesibilidad críticos (axe).
- **Calidad:** ESLint + Prettier, TypeScript estricto, Vitest (unitarias), Playwright (e2e), axe-core, revisión de seguridad (OWASP ASVS nivel 1), Dependabot.
- **Documentación:** `docs/` en el repositorio (arquitectura, ADR, manuales), especificación de flujos y matriz de capturas; wiki del profesor.

# 6. Plan de entregas (resumen por sprint)

| Sprint | Fechas | Entregable |
|---|---|---|
| 0 (pre-arranque) | ene–feb 2027 | Repositorio, CI, Docker, diseño detallado, sistema de diseño SSAT, prototipo navegable aprobado |
| 1–2 | mar 2027 | Modelo de datos, autenticación institucional, generador de contribuyentes, login SIAT simulado, Mi espacio |
| 3–4 | abr 2027 | Módulo 1: inscripción por Oficina Virtual (Formato 3/CFF digital, sesión virtual simulada), CSF, acuse; catálogos oficiales con clave importados |
| 5–6 | may 2027 | Módulo 1: aviso de obligaciones completo (Paso 1, ubicación, cuestionario oficial, resumen con claves, vista preliminar, folio RF, acuse y CSF) + motor de reglas v1 con OBL-001…005 + panel de profesor (grupos y escenarios) |
| 7–8 | jun 2027 | Módulo 2: configuración, ISR AEP con tarifa acumulada, pestañas ISR/IVA |
| 9–10 | jul 2027 | Módulo 2: vista previa, acuse, línea de captura, pago simulado, complementarias; RESICO y arrendamiento |
| 11–12 | ago 2027 | Módulo 3: anual PF ingresos y deducciones personales (entra el becario) |
| 13–14 | sep 2027 | Módulo 3: determinación, saldo a favor/cargo, e.firma, acuse; panel de contenido para Contaduría |
| 15–16 | oct 2027 | Carga de la base de respuestas de Contaduría; bitácora y reportes del profesor |
| 17–18 | nov 2027 | Módulo 4: citas completo; MVP integrado; pruebas e2e de los 4 flujos |
| 19–20 | dic 2027 | Endurecimiento, accesibilidad, manuales (alumno, profesor, admin); piloto interno |
| 21–24 | ene–feb 2028 | Piloto formal en 2 grupos; medición; correcciones; opcional: actualización del RFC y e.firma |
| 25–26 | mar 2028 | v1.0 estable; registro INDAUTOR; artículo 1 y congreso 1 |
| 27–28 | abr 2028 | Segundo piloto; artículo 2; documentación final |
| 29–30 | may 2028 | Cierre: instalación definitiva, informe final, propuesta de Fase 3 |

# 7. Seguridad, privacidad y aspectos legales

- Ningún dato personal real de contribuyentes; los alumnos se identifican con su cuenta institucional. Aviso de privacidad del simulador.
- Sin marca gob.mx, escudo ni logotipo SAT; leyenda permanente "Simulador académico · no es el portal del SAT"; acuses con sello "SIN VALIDEZ FISCAL".
- Contraseñas con Argon2, sesiones con expiración, HTTPS obligatorio, rate-limit en login, registro de auditoría en paneles de contenido.
- Respaldos cifrados diarios; retención 90 días; restauración probada cada trimestre.
- Licencia: código propiedad de la universidad, registro ante INDAUTOR; dependencias open source compatibles (MIT/Apache).

# 8. Riesgos y mitigación

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Base de respuestas de Contaduría llega tarde | Media | Alto | Motor con set mínimo desde sprint 5; panel de contenido en sprint 13; plantillas de captura de reglas desde el mes 1 |
| Cambios del SAT (tarifas, pantallas, regímenes) | Alta | Medio | Reglas y tarifas versionadas por ejercicio; UI por componentes; matriz de capturas fechada |
| Crecimiento del alcance | Media | Alto | Backlog priorizado por el PO; cambios de alcance solo en planeación de sprint; Fase 3 explícita |
| Dependencia de 2 desarrolladores | Media | Alto | Documentación continua, PR cruzados, becario como relevo, ADRs |
| Becas incompatibles con la beca de posgrado | Media | Medio | Resolver contra lineamientos antes de nombrar becarios |
| Uso indebido de identidad gráfica | Baja | Alto | ADR-0003; revisión jurídica de la universidad antes del piloto |

# 9. Indicadores de seguimiento

- Velocidad por sprint (puntos), burndown del release, porcentaje de historias aceptadas en demo.
- Cobertura de pruebas del motor de reglas y número de reglas cargadas por Contaduría.
- Pantallas replicadas vs. matriz de capturas (porcentaje).
- En pilotos: alumnos activos, trámites completados, errores por intento (1.º vs n-ésimo), confianza pre/post (escala Likert), SUS de usabilidad.

# 10. Siguientes pasos inmediatos

1. Aprobar esta propuesta con la Dra. y el Dr. Oliva (viernes 13 / lunes 16 de noviembre).
2. Crear el repositorio `ssat` en GitHub con la estructura adjunta e importar el backlog inicial.
3. Agendar con Contaduría la sesión de captura de reglas (plantilla en `docs/plantillas/regla-normativa.md`).
4. Solicitar a Contaduría los catálogos oficiales con clave (actividades por grupo, regímenes, obligaciones con regla de vencimiento), las guías oficiales de Declaraciones y Pagos, anual y citas, y un acuse y una CSF anonimizados en alta resolución.
5. Validar con Contaduría el prototipo v0.2 (Módulo 1 completo) contra su propia guía antes del sprint 0.

**Backlog comprometido tras el cotejo:** 449 puntos (E0–E7) + 29 opcionales (E8); detalle en `docs/03-backlog.md` y `docs/04-cotejo-docs-contaduria.md`.
