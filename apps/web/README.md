# apps/web
React 19 + TypeScript + Vite. Rutas por aplicativo simulado:
- `/` portal (tema oscuro/dorado) · `/acceso` login SIAT · `/mi-espacio`
- `/buzon/obligaciones/*` aviso de obligaciones (4 pasos) · `/declaraciones/*` · `/anual/*` · `/citas/*`
- `/profesor/*` · `/contenido/*` · `/admin/*`
Temas en `src/theme/{portal,clasico,siat}.ts`. Componentes en `src/components/` (Banda de simulador, Encabezado, Pasos, FormularioSAT, AvisoAutoridad, Acuse).
