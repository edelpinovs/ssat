// Calculadora ISR · Actividades empresariales y profesionales · pago provisional (LISR art. 106) — esqueleto E2-03
export type Tramo = [number, number | null, number, number];
export interface Tarifa { ejercicio: number; tipo: string; tramos: Tramo[] }

export function tarifaAcumulada(mensual: Tarifa, meses: number): Tramo[] {
  return mensual.tramos.map(([li, ls, cf, pct]) => [li * meses, ls === null ? null : ls * meses, cf * meses, pct]);
}

export function isrSegunTarifa(base: number, tramos: Tramo[]): number {
  const t = tramos.find(([li, ls]) => base >= li && (ls === null || base <= ls)) ?? tramos[0];
  return t[2] + (base - t[0]) * t[3] / 100;
}

export interface EntradaAEP { ingresosAcumulados: number; deduccionesAcumuladas: number; pagosAnteriores: number; retenciones: number; tarifaMensual: Tarifa; mes: number }
export function pagoProvisionalAEP(e: EntradaAEP) {
  const base = Math.max(0, e.ingresosAcumulados - e.deduccionesAcumuladas);
  const isr = base > 0 ? isrSegunTarifa(base, tarifaAcumulada(e.tarifaMensual, e.mes)) : 0;
  const aCargo = Math.max(0, isr - e.pagosAnteriores - e.retenciones);
  return { base, isr, aCargo };
}
