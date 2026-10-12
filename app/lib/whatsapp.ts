import { isTodo } from "~/content/todo";

/**
 * A wa.me chat link for a South African number written as dialled locally ("073 000 0000"),
 * with an optional pre-filled message. Null while the number is a TODO or isn't 10 digits, so
 * nothing ever links to the wrong person.
 */
export function whatsappHref(number: string, message?: string): string | null {
  if (isTodo(number)) return null;
  const digits = number.replace(/\D/g, "");
  if (!/^0\d{9}$/.test(digits)) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/27${digits.slice(1)}${text}`;
}
