---
title: "SSAT · Cotejo de los documentos enviados por Contaduría contra el plan y el prototipo"
subtitle: "13 de noviembre de 2026 · v1"
---

# 1. Documentos revisados

| # | Documento | Qué aporta | Fuente |
|---|---|---|---|
| D1 | *Guía para presentar en línea tu aviso de actualización de actividades económicas y obligaciones* (SAT, 13 págs.) | Flujo oficial pantalla por pantalla del aplicativo: autenticación, Paso 1, cuestionario completo, resumen, vista preliminar, mensaje final y acuse | SAT |
| D2 | *ABC de la actualización del RFC* (Contaduría, 7 págs.) | Versión didáctica del mismo flujo con capturas; ejemplos de **acuse** y de la nueva **Constancia de Situación Fiscal (CSF)** | Contaduría |
| D3 | *Formato 3/CFF · Solicitud de inscripción en el RFC de personas físicas a través de Oficina Virtual* (4 págs., 06-11-2026) | Campos exactos del formato que hoy sustituye a la inscripción en línea | SAT |
| D4 | *Guía para el llenado del formato (FOV) de inscripción por Oficina Virtual* (2026, 5 págs.) | Instrucciones campo por campo del D3; tipos de inscripción admitidos | SAT |

# 2. Qué confirman y qué corrigen respecto al plan

## 2.1 Módulo 1 · Inscripción al RFC (D3 + D4)

**Confirman** el hallazgo del levantamiento: la inscripción de personas físicas ya no es un trámite en línea; se hace con cita en Oficina Virtual y el Formato 3/CFF impreso, firmado, digitalizado y enviado por correo antes de la cita.

**Precisan** (nuevo para el plan):
- Oficina Virtual solo admite **tres tipos de inscripción**: 1) mexicanos en el extranjero, 2) sueldos y salarios (patrón en México o patrón extranjero/embajadas), 3) **sin obligaciones fiscales**. Un alumno que quiera "dar de alta un negocio" no se inscribe así: primero se inscribe (salarios o sin obligaciones) y después presenta el **aviso de actualización de obligaciones** para asumir Actividades Empresariales, RESICO o Arrendamiento.
- El formato tiene cuatro bloques con campos fijos: lugar y fecha de solicitud; **1. Datos de identificación** (nombre, apellidos, CURP a 18 posiciones); **2. Tipo de movimiento → 2.1 Inscripción** (tipo de solicitud 1/2/3, fecha de cita, origen de los ingresos por salarios); **3. Datos de ubicación o domicilio** (característica del domicilio 1 casa / 2 oficina / 3 finca / 4 otro, tipo de vialidad, calle, núm. exterior e interior, entre calles, colonia, referencias, localidad, municipio, C.P., entidad, teléfono 1 y 2 con lada, correo 1 y 2); **4. Manifestación bajo protesta y firma autógrafa**.
- Reglas de validación explícitas en D4: CURP a 18 posiciones; nombre como en acta; si solo hay un apellido va en paterno; teléfonos con lada separada; correos personales; formato se tiene por no presentado si está incompleto.

**Decisión propuesta D-1.** El Módulo 1 se modela como la secuencia real: *Inscripción por Oficina Virtual (cita + Formato 3/CFF digital + sesión virtual simulada → RFC, CSF y acuse de inscripción)* **seguida** del *Aviso de actualización de obligaciones* para asignar el régimen. El escenario típico del profesor ("alumno que inicia un negocio") recorre ambos. Esto ya coincide con el backlog (E1-02, E1-03, E1-04…E1-07); solo se afinan los criterios de aceptación con los campos del D3/D4.

## 2.2 Módulo 1 · Aviso de actualización de obligaciones (D1 + D2)

El flujo real es más largo que el del prototipo. Secuencia oficial:

| Paso real | Pantalla | Lo que tenemos | Brecha |
|---|---|---|---|
| Autenticación | "Acceso por contraseña" o **"Acceso con e.firma"** (Buscar .cer, Buscar .key, contraseña de clave privada; el RFC se llena solo) | Login por contraseña + captcha en el prototipo | Falta la variante e.firma con carga de archivos (E0-08 ya la contempla; agregar criterio) |
| Paso 1 | Datos de representante legal + fecha de movimiento (calendario) | Replicado | Ninguna |
| Paso 2 (condicional) | **Datos de ubicación** (aparece en inscripción/reanudación cuando se requiere domicilio) | No existe | Nueva historia |
| Paso 3 · Cuestionario · a) Tipos de ingreso | Lista jerárquica con casillas: asalariado/asimilado; jubilado; servicios profesionales; rentas; *Tienes un negocio y eres:* RIF, actividades agrícolas (dos subopciones), empresarial; *Otro tipo de ingresos:* intereses, dividendos, obras de tu creación, otros; venta de materiales reciclables. Cada opción tiene **tooltip de ayuda** y mensajes informativos emergentes | 5 casillas planas | Reemplazar por la lista oficial completa con ayudas |
| b) Identifica tu actividad económica | 1) grupo de actividades (tarjetas con imagen), 2) lista de actividades del grupo, 3) selección | Campo de texto libre | Necesita el **catálogo oficial de actividades económicas** con claves (ej. 606 "Comercio al por menor de artículos de mercería y bonetería") |
| c) Actividades económicas | Por cada actividad: **forma en que se realiza** (por cuenta propia / como asalariado / como representante…) y **porcentaje**; la suma debe ser 100 y solo una preponderante | Un porcentaje | Tabla multiactividad con validación de suma y preponderancia |
| d) Relaciones | Socios/accionistas, patrón, representante: RFC y tipo de relación | No existe | Historia de prioridad media |
| e) Preguntas complementarias | Trabajadores asalariados / asimilados / ninguno; periodicidad de ingresos por servicios; ubicación del patrón si es asalariado | Una casilla | Ampliar según D2 |
| Resumen | Encabezado "Has finalizado la captura…", **Régimen con clave** (ej. 621 RIF), tabla de características (clave, característica, descripción, estatus **Nueva/Baja**), tabla de obligaciones (clave 7xx, descripción, **próximo vencimiento**, estatus), **características eliminadas**, leyenda legal; botones Regresar / Reiniciar cuestionario / **Guardar datos del cuestionario** | Tabla simple con fundamento | Agregar claves, vencimientos, estatus y "características eliminadas"; el fundamento legal es un **extra pedagógico** del SSAT que el SAT no muestra |
| Paso 3 · Vista preliminar | Mensaje de confirmación → "Aviso de actualización o modificación de situación fiscal" con datos, firma/huella, leyenda "Declaro bajo protesta de decir verdad…", botones Cancelar / Confirmar | No existe | Nueva pantalla; en Resumen el botón se llama "Guardar datos del cuestionario", no "Confirmar y generar acuse" |
| Envío | Autenticación de nuevo con contraseña o e.firma (D2 paso 8) → mensaje "SU TRÁMITE HA FINALIZADO RF2016…" | No existe | Agregar re-autenticación y folio **RF + 13 dígitos** |
| Acuse | "Acuse de movimientos de actualización de situación fiscal" (2 págs.: lugar y fecha, datos de identificación, tipo de movimiento, cuestionario resumido, actividades con porcentaje y fechas, regímenes con fecha de inicio, obligaciones con descripción y vencimiento, cadena original y sello) **+ nueva Constancia de Situación Fiscal** (cédula de identificación fiscal con QR, datos de identificación, domicilio, actividades, regímenes, obligaciones) | Acuse genérico | Dos documentos PDF, no uno; la CSF es reutilizable por los demás módulos |

**Reglas de negocio nuevas que D1 enuncia textualmente** (van al motor de reglas, módulo `obligaciones`):
1. Responder solo con actividades actuales o próximas; **las características activas no reseleccionadas se dan de baja** (OBL-001).
2. Con más de una actividad, porcentajes por actividad, **suma = 100 %** y **una sola preponderante** (OBL-002, OBL-003).
3. Campos con asterisco obligatorios: la aplicación no permite finalizar (OBL-004).
4. **Sesión expira a ~20 minutos sin actividad** y se pierde la captura (OBL-005: el simulador puede reproducirlo como advertencia pedagógica configurable).
5. Mensajes de ayuda e información por tipo de ingreso (contenido para el panel de Contaduría).

**Decisión propuesta D-2.** Adoptar la estructura oficial de pasos y pantallas del D1 como especificación del aviso de obligaciones (reemplaza la versión simplificada del prototipo). Pedir a Contaduría los **catálogos con clave**: actividades económicas por grupo, regímenes (c_RegimenFiscal: 605, 606, 612, 621, 626…) y obligaciones (claves 7xx con descripción y regla de vencimiento). Sin esos catálogos no se puede replicar el Resumen ni la CSF.

**Decisión propuesta D-3.** La Constancia de Situación Fiscal se convierte en un producto transversal (`packages/pdf`): se genera en la inscripción, se regenera en cada aviso y se consulta desde Mi espacio. Justifica adelantar "Expediente / CSF" de la Fase 3 a la Fase 1 como subproducto, sin ampliar el alcance comprometido.

## 2.3 Autenticación (D1 sección I, D2 paso 3)

Confirma el ADR-0004 (un login por aplicativo) y añade la pantalla **"Acceso con e.firma"**: Certificado (.cer) con Buscar, Clave privada (.key) con Buscar, Contraseña de clave privada, RFC autollenado, botones Cancelar / Enviar. El prototipo solo muestra el botón "e.firma"; se agrega la pantalla.

## 2.4 Lo que no cambia

Módulos 2 (pagos provisionales), 3 (anual) y 4 (citas) no se tocan con estos documentos; siguen pendientes las guías o capturas de "Declaraciones y Pagos", anual y citas. El stack, la arquitectura y el calendario de sprints se mantienen; el trabajo adicional del aviso de obligaciones (≈ 34 puntos) cabe en los sprints 5–6 si se mueve "Suspensión y reanudación" (E1-08) al final del calendario, como ya estaba.

# 3. Cambios al backlog

| Acción | Historia | Puntos | Sprint |
|---|---|---|---|
| Modificar | E0-08 Login SIAT: agregar pantalla "Acceso con e.firma" (.cer/.key/contraseña de clave privada, RFC autollenado) | 8 → 10 | 2 |
| Modificar | E1-02 Formato 3/CFF digital: campos y validaciones exactos de D3/D4; tipos de inscripción 1/2/3; PDF del formato llenado para "firmar y enviar" | 8 → 10 | 3 |
| Modificar | E1-05 Cuestionario: dividir en E1-05a Tipos de ingreso (lista oficial + ayudas) y E1-05b Actividades (grupo → actividad → forma y porcentaje, suma 100, preponderante) | 13 → 8 + 13 | 5 |
| Modificar | E1-07 Resumen y acuse: claves, vencimientos, estatus Nueva/Baja, características eliminadas, botón "Guardar datos del cuestionario" | 8 → 10 | 6 |
| Nueva | E1-09 Catálogos oficiales con clave: actividades económicas por grupo, regímenes y obligaciones con regla de vencimiento (importador CSV; Contaduría entrega) | 8 | 4 |
| Nueva | E1-10 Paso "Datos de ubicación" (condicional) reutilizando los campos de domicilio del Formato 3/CFF | 5 | 6 |
| Nueva | E1-11 Vista preliminar, re-autenticación y folio RF: "Aviso de actualización o modificación de situación fiscal", leyenda bajo protesta, Cancelar/Confirmar, mensaje "SU TRÁMITE HA FINALIZADO RF…" | 8 | 6 |
| Nueva | E1-12 Constancia de Situación Fiscal (CSF) en PDF con cédula de identificación fiscal y QR; generación en inscripción y en cada aviso; consulta desde Mi espacio | 8 | 6 |
| Nueva | E1-13 Relaciones (socios/accionistas, patrón, representante) en el cuestionario | 5 | 16 |
| Nueva | E5-06 Reglas OBL-001…005 y mensajes de ayuda/información por tipo de ingreso en el motor y el panel de contenido | 5 | 5 |

Neto: +34 puntos en E1, +5 en E5. Total comprometido pasa de 396 a ≈ 449 puntos; sigue dentro de la capacidad (20–25 puntos por sprint × 30 sprints) con la holgura prevista para pilotos.

# 4. Qué pedir a Contaduría ahora

1. Catálogos con clave: actividades económicas por grupo, regímenes y obligaciones (con descripción y regla de "próximo vencimiento").
2. Las mismas guías oficiales para los otros módulos: "Declaraciones y Pagos" (provisionales), declaración anual de personas físicas y citas; o capturas en el orden del flujo.
3. Los textos de ayuda e información que aparecen en el cuestionario (D1 págs. 5–6) y los mensajes de error que conocen de la práctica.
4. Un acuse y una CSF reales anonimizados en alta resolución para copiar la maquetación (D2 ya trae ejemplos pequeños).

# 5. Ajustes al prototipo (siguiente iteración en Claude Design)

- Pantalla "Acceso con e.firma".
- Cuestionario en secciones (tipos de ingreso oficial con ayudas → grupo de actividades → actividad → forma y porcentaje → relaciones → preguntas complementarias).
- Resumen con claves, vencimientos, estatus y características eliminadas; botón "Guardar datos del cuestionario".
- Vista preliminar + mensaje de trámite finalizado con folio RF.
- Acuse de movimientos de actualización (2 páginas) y CSF con QR.
- Formato 3/CFF digital con los cuatro bloques del D3.
