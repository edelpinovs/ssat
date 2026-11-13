---
title: "SSAT · Especificación de flujos y pantallas del portal del SAT (v0.1)"
subtitle: "Levantamiento de referencia para replicar la interfaz · 12 de noviembre de 2026"
---

# 1. Alcance de este levantamiento

Recorrido de lectura del portal del SAT (www.sat.gob.mx, Buzón Tributario, Citas y aplicativos de login) para documentar navegación, textos, campos y enlaces que el simulador debe replicar. No se capturó ningún dato ni se envió ningún trámite. Las capturas están en la carpeta `capturas/` (27 imágenes) y los textos extraídos en los `.md` que acompañan a este documento.

**Hallazgos que cambian el diseño del simulador:**

1. **El SAT ya no tiene inscripción al RFC de personas físicas 100 % en línea.** La página oficial solo ofrece Oficina Virtual (cita + formato 3/CFF por correo) y oficinas (cita presencial). El "cuestionario de actividades y obligaciones" vive en el aplicativo de **actualización de obligaciones** del Buzón Tributario. Para el Módulo 1 conviene simular: (a) la cita de inscripción + formato 3/CFF, y (b) el cuestionario de actividades/obligaciones tal como aparece en el aviso de actualización, que es el mismo motor de obligaciones que ve un contribuyente nuevo.
2. **Cada aplicativo tiene su propio login.** Entrar al portal ("Mi espacio SAT": RFC + contraseña) no autentica el Buzón ni Declaraciones; cada uno muestra "Acceso por contraseña" con RFC, contraseña, e.firma portable y **captcha**. El simulador debe reproducir este patrón (un login SIAT por aplicativo o un SSO simulado con la misma pantalla).
3. **Tres identidades visuales conviven:** portal nuevo (Svelte, oscuro/dorado, tarjetas), aplicativos clásicos (fondo blanco, encabezado guinda "Gobierno de México | Hacienda | SAT", botones guinda) y login NetIQ (formulario con captcha). El sistema de diseño del simulador necesita los tres temas.
4. **Dos generaciones de aplicativo de pagos provisionales:** "Declaraciones y Pagos" nuevo (ejercicios 2025 en adelante, RESICO, retenciones) en `pstcdypisr.clouda.sat.gob.mx` y el anterior (2024 y anteriores) en `ptscf100.clouda.sat.gob.mx`. El MVP debe replicar el nuevo.

# 2. Mapa del portal (navegación de primer nivel)

Encabezado: logotipos Gobierno de México | Hacienda | SAT · enlaces Trámites · Gobierno · buscar. Barra: **Inicio · Trámites y servicios · Personas · Empresas** · ícono Buzón · ícono calendario (`/portal/public/calendario`) · buscador · selector claro/oscuro · botón "Inicio de sesión" (`/portal/public/iniciar-sesion`).

Inicio (`/portal/public/home`): "Bienvenid@ al Portal del SAT" con tres tarjetas: **Nuevo Contribuyente** (`/portal/public/inscribete`) · **Continuar al sitio** (`/portal/public/tramites-y-servicios`) · **Mi espacio SAT** (`/portal/public/iniciar-sesion`). Lema: "El SAT recauda con piso parejo, vocación humana y conciencia social para la transformación de México."

Trámites y servicios (`/portal/public/tramites-y-servicios`), 10 tarjetas:

| Tarjeta | Ruta | Fase SSAT |
|---|---|---|
| RFC, personas | /portal/public/tramites/inscripcion-y-aviso-al-rfc | 1 |
| e.firma, personas | /portal/public/tramites/firma-electronica-avanzada-efirma | 2 |
| Declaraciones para personas | /portal/public/tramites/declaraciones-pf | 1 |
| Cita | https://citas.sat.gob.mx/ | 1–2 |
| Factura electrónica | /portal/public/tramites/factura-electronica | 3 |
| RFC, empresas | /portal/public/tramites/inscripcion-y-avisos-rfc-pm | fuera |
| e.firma, empresas | /portal/public/tramites/firma-electronica-avanzada-pm | fuera |
| Declaraciones para empresas | /portal/public/tramites/declaraciones-pm | fuera |
| Adeudos fiscales | /portal/public/tramites/adeudos-fiscales | fuera |
| Más trámites y servicios | /portal/public/tramites/mas-tramites | fuera |

Debajo: "Minisitios" (Factura, Declaración anual, Buzón, etc.). Pie de página común: Portal de Trámites y Servicios (Prensa, Derechos del Contribuyente, Datos abiertos, Aviso de privacidad, Guía de usuario, Conciliación de factura, Buscador de correos falsos) · Denuncias SAT · dirección Av. Hidalgo 77 · MarcaSAT 55 627 22 728 · Chat uno a uno · Redes sociales.

**Patrón de página de trámite (todas iguales):** migas de pan → título dorado con línea → párrafo(s) de introducción → sección "Inicia el trámite" con **pestañas** (tarjetas beige; la activa en dorado) → panel oscuro con bloques "En línea / Oficina Virtual / Oficinas del SAT", cada uno con ícono, **Requisitos** (viñetas) y **Pasos a seguir** (numerados, con enlace "servicio" al aplicativo) → acordeones: Información adicional · Fundamento legal · Material adicional · Preguntas frecuentes · Contenidos relacionados · Documentos relacionados.

# 3. Pantallas de autenticación

## 3.1 Mi espacio SAT (portal)
`/portal/public/iniciar-sesion`. Título "Ingresar a 'Mi espacio SAT'". Campos: RFC (ícono), Contraseña (ícono, ojo para mostrar), botón **Enviar** guinda. Texto: "¿Olvidaste tu Contraseña? Si olvidaste tu Contraseña, pero cuentas con e.firma reestablécela aquí. Si aún no cuentas con tu Contraseña, obtenla aquí." Sin captcha. (captura 25)

## 3.2 Login SIAT "Acceso por contraseña" (Buzón, Declaraciones, trámites)
`login.siat.sat.gob.mx/nidp/app/login?id=ptsc-ciec…` y `loginda.siat.sat.gob.mx/…`. Migas "Inicio". Título "Acceso por contraseña". Campos: **RFC**, **Contraseña** (ícono de ayuda), **e.firma portable** "Clave dinámica" (deshabilitado hasta elegir), **Captcha** (imagen de letras con engranes + campo "Escriba la palabra del captcha"). Botones: **e.firma** (contorno) y **Enviar** (guinda). Enlaces: "¿Olvidaste tu contraseña?", "Si aún no cuentas con tu contraseña, obtenla aquí", "Si aún no cuentas con tu e.firma portable, obtenla aquí", "Requisitos de uso de e.firma portable". En Buzón la versión tiene fondo con patrón y logos Hacienda/SAT al centro. (capturas 15 y 20)

Para el simulador: un contribuyente ficticio tendrá RFC + contraseña; la e.firma se simula con archivos .cer/.key ficticios y contraseña de clave privada; el captcha se simula con un captcha propio (texto legible) para enseñar el paso sin fricción.

# 4. Módulo 1 · Inscripción al RFC y obligaciones

## 4.1 Página pública "Inscripción y avisos al RFC para Personas"
Siete pestañas (texto completo en `portal_publico_inscripcion_y_avisos_rfc.md`): Inscríbete en el RFC · Actualiza tu actividad económica y obligaciones · Realiza tu cambio de domicilio · Corrección o cambio de nombre · Suspende actividades · Reanuda actividades · Cancelación de tu RFC.

## 4.2 Inscripción (`/portal/public/tramites/inscripcion-al-rfc-pf`)
Dos pestañas con ícono: **Oficina Virtual** y **Oficinas del SAT**. Oficina Virtual: cita en citas.sat.gob.mx con tres opciones (mexicanos en el extranjero / ingresos por salarios / sin obligaciones fiscales), identificación, comprobante de domicilio, **Formato 3/CFF** (PDF), envío de documentos a oficina.virtual@sat.gob.mx, acuse de cita desde avisocitas@sat.gob.mx. Presencial: cita, identificación, comprobante, USB para e.firma. Resultado: **acuse de inscripción**.

**Flujo simulado propuesto:** Nuevo contribuyente → captura CURP y datos del formato 3/CFF → agenda cita (módulo Citas) → "sesión virtual" simulada → el sistema genera RFC (formato válido, no real), **Constancia de Situación Fiscal** y acuse → cuestionario de actividades y obligaciones (4.3) → obligaciones asignadas.

## 4.3 Aviso de actualización de actividades económicas y obligaciones (Buzón Tributario, con sesión)
URL `wwwmat.sat.gob.mx/operacion/33758/presenta-el-aviso-de-actualizacion-de-actividades-economicas-y-obligaciones-fiscales-como-persona-fisica`. Encabezado: logos · nombre del contribuyente con flecha · fecha/hora · lupa · **Mis expedientes** · **Servicios Disponibles** · botón **Cerrar sesión** (guinda). Migas "> Trámites del RFC > Presenta el aviso de actualización de actividades económicas y obligaciones".

**Paso 1. Datos de representante legal** (pestaña gris con el nombre del paso):
- Título "Datos del representante legal" con línea roja corta.
- Texto: "Si el trámite lo estás realizando a nombre de otra persona (en representación), ingresa tu Clave del RFC."
- Campos: RFC (editable) · CURP, Nombre(s), Primer apellido, Segundo apellido, Fecha de nacimiento, Estado (grises, se autollenan al validar el RFC).
- Subtítulo "Ingrese la fecha de la actualización de actividades y obligaciones fiscales."
- **Fecha de movimiento\*** con selector de calendario e ícono de ayuda (?).
- Nota: "Estimado contribuyente: Responda el cuestionario únicamente con información de las actividades que actualmente realiza o realizará. No debe incluir datos de actividades que ya no tiene o que dejará de realizar".
- "\* Campos obligatorios" · botones **Cancelar** (rojo) y **Continuar** (azul). (capturas 01–03b)

Pasos 2 en adelante (según la guía oficial del SAT, pendiente de capturar con sesión): cuestionario "¿Qué tipo de ingresos percibes?" → actividades económicas por catálogo (búsqueda por palabra, porcentaje de ingresos) → preguntas complementarias (¿tienes trabajadores?, ¿tendrás ingresos por…?) → **Resumen de obligaciones** (régimen, obligaciones y periodicidad) → Confirmar → **Acuse de movimientos de actualización** en PDF con cadena original y sello digital.

# 5. Módulo 2 · Pagos provisionales

Página pública: `declaraciones-pf`, pestaña "Provisionales y definitivas" (texto en `portal_publico_declaraciones_pf.md`). Lista por régimen: ISR e IVA RESICO · Retenciones por salarios y asimilados · Actividad empresarial PODEBI · Actividad empresarial y profesional 2025+ · Arrendamiento 2025+ · IVA 2025+ (aplicativo nuevo **pstcdypisr.clouda.sat.gob.mx**) y los regímenes 2024 y anteriores, IEPS, ISAN (aplicativo anterior **ptscf100.clouda.sat.gob.mx**).

En línea: Requisitos "Contraseña o e.firma". Pasos: 1) Ingresa al servicio. 2) Selecciona el tipo de declaración a presentar y llena los datos que te solicita. 3) Envía la declaración, guarda el acuse de la declaración y, en su caso, la línea de captura.

Flujo del aplicativo nuevo (por capturar con sesión; estructura conocida del aplicativo "Declaraciones y Pagos"): login SIAT → menú **Presentar declaración / Consultar declaración / Consultar pagos** → Configuración: ejercicio, periodicidad (mensual), periodo, tipo de declaración (normal/complementaria) → obligaciones precargadas según el RFC (ISR personas físicas actividad empresarial, IVA) → pestañas por impuesto: **Ingresos** (precargados de CFDI, editables), **Deducciones**, **Determinación** (base, tarifa, pagos anteriores, retenciones), **Pago** (a cargo / a favor, compensaciones) → **Vista previa** → Enviar (con contraseña o e.firma) → **Acuse de recibo** + **Línea de captura** (importe, vigencia, formato de pago). Los **Visores** (deducciones, nómina, facturas RESICO) alimentan la precarga.

# 6. Módulo 3 · Declaración anual

Página pública pestaña "Anual" → aplicativo **anualpf.clouda.sat.gob.mx**. Requisitos: Contraseña o e.firma. Pasos: ingresa, selecciona el tipo de declaración (personas físicas con ingresos por salarios, asimilados, actividad empresarial, servicios profesionales, arrendamiento, intereses, premios, dividendos, adquisición/enajenación de bienes, plataformas tecnológicas, impuesto pagado en el extranjero · RIF · RESICO · REFIPRES · acciones en bolsa), en su caso descarga ISSIF, envía, guarda acuse y línea de captura.

Flujo conocido del aplicativo (a capturar con sesión): login → Presentar declaración → ejercicio, tipo (normal/complementaria), periodo → Ingresos (por capítulo, precargados de CFDI de nómina y facturas) → **Deducciones personales** (precargadas del visor: médicos, funerales, donativos, intereses hipotecarios, aportaciones, primas, transporte escolar, colegiaturas) → Determinación (ISR del ejercicio, retenciones, pagos provisionales, subsidio) → resultado **saldo a favor / a cargo** → Pago (en parcialidades, compensación) o Devolución (CLABE) → Vista previa → Enviar con e.firma (saldo a favor > 10 mil) → Acuse.

# 7. Módulo 4 · Citas (citas.sat.gob.mx)

Pantalla **Registro de cita** (`/datosPersonales`): barra "Trámites Digitales ▾ · Consulta el aviso de privacidad · Ayuda". Texto "Recuerda que las citas son intransferibles." Sección **Opciones de trámite** con tres acordeones guinda:
- **Contribuyente que cuente con RFC** → campos RFC\*, Correo electrónico\*, Confirmar correo electrónico\* → botones Salir / Siguiente.
- Inscripción al padrón de contribuyentes Personas Morales.
- **Inscripción al padrón de contribuyentes Personas Físicas** → CURP\*, Nombre Completo\*, Correo electrónico\*, Confirmar correo electrónico\* → Salir / Siguiente.
Pasos siguientes (por capturar; conocidos del sistema): captcha/validación → selección de **servicio** (e.firma primera vez, renovación, inscripción, constancia, etc.) → **entidad federativa y módulo** → calendario con días/horas disponibles (o fila virtual) → confirmación → **acuse de cita** (folio, QR, requisitos) + correo desde avisocitas@sat.gob.mx. También: consultar / cancelar cita con folio.

El menú "Trámites Digitales" enlaza a: Inscripción al RFC como PF, Consulta del RFC (www54.sat.gob.mx/curp/Consult), Constancia de Situación Fiscal (portal y SAT ID), Generar contraseña (SAT ID / portal), Certificado de e.firma (vigente próximo a vencer / vencido, PF y PM).

# 8. Fase 2 · Contraseña y e.firma

Resumen de `portal_publico_contrasena.md` y `portal_publico_efirma.md`:
- **Contraseña**: generar/actualizar con e.firma (servicio SIAT `recuperarContrasenia.jsf`: e.firma + captcha → crear y confirmar contraseña → acuse), con SAT ID (INE, liga por correo), oficina (solo adultos mayores, discapacidad, embarazo) y **Validador de contraseña** (RFC + contraseña + captcha → Validar).
- **e.firma**: primera vez presencial (cita, USB, identificación, comprobante) → acuse; renovación en línea con **Certifica** (.ren) + **CertiSAT WEB** + **Recuperación de certificados**; renovación con SAT ID (.req); revocación (CertiSAT WEB con .cer, contraseña de clave privada y .key).
Simulación: generar archivos .cer/.key ficticios descargables y un "Certifica" simplificado.

# 9. Fase 3 · Factura electrónica, Buzón, Expediente

- **Factura electrónica**: pestañas Genera tu factura (Servicios de facturación de CFDI, Factura SAT Móvil, Mi nómina, Factura fácil, listado de PAC), Servicios de factura (cancelación, conciliación, consulta/cancela/recupera, verifica, Web Service de descarga masiva) e Información especializada (Anexo 20, complementos, región fronteriza, organismos públicos).
- **Buzón Tributario** (minisitio): aviso modal "Debes tener registrados dos medios de contacto… correo electrónico (hasta cinco) y un número de teléfono celular"; secciones ¿Qué es?, ¿Quiénes deben habilitarlo?, Beneficios y requisitos, Habilita o actualiza, Servicios disponibles. Con sesión: **Servicios disponibles** → Trámites (Contabilidad electrónica, Fiscalización electrónica, Devoluciones y Compensaciones, Recurso de revocación en línea, Consultas y autorizaciones jurídica, Donatarias autorizadas), Avisos (Avisos, Monederos electrónicos), Decretos (Sociedades Cooperativas, Servicios parciales de construcción) y nota sobre reglas 1.6 y 2.2.6 de la RMF. (capturas 04–06, 27)
- **Expediente / Constancia de situación fiscal**: `www.sat.gob.mx/aplicacion/53027/genera-tu-constancia-de-situacion-fiscal` y SAT ID.

# 10. Sistema de diseño a replicar

| Elemento | Portal nuevo | Aplicativos clásicos (Buzón, Citas, trámites) | Login SIAT |
|---|---|---|---|
| Fondo | gris oscuro #2b2b2b / claro alternable | blanco | blanco con patrón |
| Color primario | dorado/arena #c9a86a para títulos y tarjetas | guinda #7a1b3c (barra, botones, acordeones) | guinda |
| Tipografía | sans-serif (Montserrat-like), títulos grandes en dorado | Open Sans-like, títulos finos gris oscuro | Noto Sans / serif en títulos |
| Botones | guinda relleno "Enviar"; tarjetas beige como pestañas | guinda relleno; secundarios contorno; en trámites Buzón: rojo "Cancelar", azul "Continuar" | guinda "Enviar", contorno "e.firma" |
| Patrones | tarjetas con ícono + flecha; pestañas; acordeones con chevron | formularios de 3 columnas con etiquetas arriba; campos obligatorios con \* rojo; pasos en pestañas grises | formulario vertical etiqueta-izquierda |
| Pie | 3 columnas (Portal · SAT · Contacto) | igual | ninguno |

Reglas del simulador: no usar escudo nacional, logotipo SAT ni marca gob.mx; sustituir por marca "SSAT · Simulador académico" conservando la estructura y los colores.

# 11. Pendientes de levantamiento (requieren sesión con captcha)

1. Cuestionario de actividades y obligaciones (pasos 2–5 del aviso de actualización) y acuse.
2. Aplicativo "Declaraciones y Pagos" (pstcdypisr): menú, configuración de la declaración, pestañas de ISR/IVA, vista previa, acuse y línea de captura.
3. Declaración anual (anualpf): deducciones precargadas, determinación, acuse.
4. Citas: pasos posteriores a datos personales (servicio, módulo, calendario, acuse).
5. Tablero "Mi espacio SAT" tras iniciar sesión.
Contaduría ya cuenta con capturas reales de estos aplicativos; conviene pedirlas en alta resolución y en el orden del flujo.
