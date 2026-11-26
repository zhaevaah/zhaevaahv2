/**
 * Auto-formats Date of Birth input as DD / MM / YYYY while user types digits.
 * Automatically handles backspacing over separators and converts ISO YYYY-MM-DD.
 */
export const formatAutoDate = (raw: string, prev: string = ""): string => {
  if (!raw) return "";

  // If input is in ISO format YYYY-MM-DD (e.g. from database)
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return `${isoMatch[3]} / ${isoMatch[2]} / ${isoMatch[1]}`;
  }

  let val = raw;
  if (prev && raw.length < prev.length) {
    if (prev.endsWith(" / ") || prev.endsWith(" /")) {
      const digits = prev.replace(/\D/g, "");
      val = digits.slice(0, -1);
    }
  }

  // Extract only digits up to 8 characters (DDMMYYYY)
  const digits = val.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)} / ${digits.slice(2, 4)} / ${digits.slice(4)}`;
};
