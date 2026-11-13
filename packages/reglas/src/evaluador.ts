// Evaluador de reglas declarativas (esqueleto E5-01)
export type Severidad = 'error' | 'advertencia' | 'info';
export interface Regla { codigo: string; modulo: string; condicion: unknown; severidad: Severidad; mensaje: string; fundamento: string; sugerencia?: string; vigenciaDesde: string; vigenciaHasta?: string }
export interface Aviso { codigo: string; severidad: Severidad; mensaje: string; fundamento: string; sugerencia?: string }

export class Evaluador {
  constructor(private readonly reglas: Regla[]) {}
  evaluar(contexto: Record<string, number>, fecha = new Date()): Aviso[] {
    return this.reglas
      .filter((r) => new Date(r.vigenciaDesde) <= fecha && (!r.vigenciaHasta || new Date(r.vigenciaHasta) >= fecha))
      .filter((r) => this.cumple(r.condicion, contexto))
      .map(({ codigo, severidad, mensaje, fundamento, sugerencia }) => ({ codigo, severidad, mensaje, fundamento, sugerencia }));
  }
  private cumple(_cond: unknown, _ctx: Record<string, number>): boolean {
    // TODO E5-01: implementar operadores seguros (>, <, ==, !=aprox, all, any) sin eval
    return false;
  }
}
