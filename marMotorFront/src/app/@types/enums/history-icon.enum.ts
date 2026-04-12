export enum HistoryIcon {
  MANTENIMIENTO = 'fa-wrench',
  ITV = 'fa-clipboard-check',
  ACEITE = 'fa-oil-can',
  RUEDAS = 'fa-circle-dot',
  MOTOR = 'fa-gears',
  FRENOS = 'fa-stop-circle',
  SEGURIDAD = 'fa-shield-halved',
}

export const HistoryIconLabel = new Map<string, string>([
  [HistoryIcon.MANTENIMIENTO, 'Mantenimiento'],
  [HistoryIcon.ITV, 'Revisión ITV'],
  [HistoryIcon.ACEITE, 'Cambio de Aceite'],
  [HistoryIcon.RUEDAS, 'Neumáticos'],
  [HistoryIcon.MOTOR, 'Motor/Caja de cambios'],
  [HistoryIcon.FRENOS, 'Sistema de Frenado'],
  [HistoryIcon.SEGURIDAD, 'Seguridad y Frenos'],
]);
