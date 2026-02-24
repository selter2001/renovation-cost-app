/**
 * Formatuj grosze do czytelnego formatu PLN.
 * Uzywa Intl.NumberFormat z waluta PLN.
 */
export function formatPLN(grosze: number, locale: string = 'pl-PL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(grosze / 100)
}

/**
 * Parsuj string z inputa do groszy (integer).
 * Akceptuje format z kropka lub przecinkiem jako separatorem dziesietnym.
 * Zwraca 0 dla nieprawidlowych wartosci.
 */
export function parseInputToGrosze(input: string): number {
  const normalized = input.replace(',', '.')
  const value = parseFloat(normalized)
  if (isNaN(value)) return 0
  return Math.round(value * 100)
}
