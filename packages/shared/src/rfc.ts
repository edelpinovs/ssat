// Validación estructural de RFC de persona física (no verifica existencia; el simulador nunca usa RFC reales)
export const RFC_PF = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;
export function esRfcPersonaFisica(rfc: string): boolean { return RFC_PF.test(rfc.toUpperCase()); }
