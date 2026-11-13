import { describe, expect, it } from 'vitest';
import { pagoProvisionalAEP } from '../src/calculadoras/aep';
import tarifa from '../data/tarifas/2026/isr-mensual.json';

describe('pagoProvisionalAEP', () => {
  it('base cero cuando deducciones superan ingresos', () => {
    const r = pagoProvisionalAEP({ ingresosAcumulados: 100, deduccionesAcumuladas: 200, pagosAnteriores: 0, retenciones: 0, tarifaMensual: tarifa as never, mes: 1 });
    expect(r.base).toBe(0); expect(r.aCargo).toBe(0);
  });
  // TODO: casos de Contaduría en test/casos/*.json
});
