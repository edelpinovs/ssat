const modulos = [
  { nombre: 'Inscripción al RFC y obligaciones', fase: 'Fase 1 · sprints 3–6' },
  { nombre: 'Pagos provisionales', fase: 'Fase 1 · sprints 7–10' },
  { nombre: 'Declaración anual', fase: 'Fase 1 · sprints 11–14' },
  { nombre: 'Citas', fase: 'Fase 1 · sprints 17–18' },
  { nombre: 'Contraseña y e.firma', fase: 'Fase 2 · opcional' },
  { nombre: 'CFDI, buzón y expediente', fase: 'Fase 3 · ampliación' },
];

export function App() {
  return (
    <div className="portal">
      <div className="banda">SIMULADOR ACADÉMICO SSAT · No es el portal del SAT · Todos los datos son ficticios</div>
      <header className="encabezado">
        <span className="logo">SS</span>
        <strong>SSAT</strong>
        <span className="sub">· Simulador del portal tributario</span>
      </header>
      <main className="contenido">
        <h1>
          Bienvenid@ al Portal del <span className="dorado">SSAT</span>
        </h1>
        <p>
          Proyecto en pre-arranque. El prototipo navegable y la especificación de flujos viven en el
          repositorio; el simulador se construye a partir de marzo de 2027.
        </p>
        <ul className="modulos">
          {modulos.map((m) => (
            <li key={m.nombre}>
              <strong>{m.nombre}</strong>
              <span>{m.fase}</span>
            </li>
          ))}
        </ul>
      </main>
      <footer className="pie">Centro Universitario de los Valles · Carrera de Contaduría · SSAT 2027–2028</footer>
    </div>
  );
}
