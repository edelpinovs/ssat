import { describe, expect, it } from 'vitest';
import { pagoProvisionalAEP } from '../src/calculadoras/aep';
import tarifa from '../data/tarifas/2026/isr-mensual.json';

describe('pagoProvisionalAEP', () => {
  it('base cero cuando deducciones superan ingresos', () => {
    const r = pagoProvisionalAEP({ ingresosAcumulados: 100, deduccionesAcumuladas: 200, pagosAnteriores: 0, retenciones: 0, tarifaMensual: tarifa as never, mes: 1 });
    expect(r.base).toBe(0); expect(r.aCargo).toBe(0);
  });
  it('PTU y pérdidas fiscales reducen la base gravable', () => {
    const r = pagoProvisionalAEP({ ingresosAcumulados: 50000, deduccionesAcumuladas: 20000, ptu: 3000, perdidasFiscales: 7000, pagosAnteriores: 0, retenciones: 0, tarifaMensual: tarifa as never, mes: 1 });
    expect(r.base).toBe(20000);
  });
  it('estímulos y retenciones no generan impuesto negativo', () => {
    const r = pagoProvisionalAEP({ ingresosAcumulados: 10000, deduccionesAcumuladas: 0, estimulos: 1e6, pagosAnteriores: 0, retenciones: 5000, tarifaMensual: tarifa as never, mes: 1 });
    expect(r.impuestoDelPeriodo).toBe(0); expect(r.aCargo).toBe(0);
  });
  // TODO: casos de Contaduría en test/casos/*.json
});
