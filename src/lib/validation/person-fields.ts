import { z } from "zod";

/** Strip dashes/spaces and return 13-digit CNIC or null. */
export function normalizeCnic(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  return digits.length === 13 ? digits : null;
}

/** Display as XXXXX-XXXXXXX-X */
export function formatCnic(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

/** Pakistan CNIC: 13 digits, province code 1–7, valid check digit. */
export function isValidPakistanCnic(value: string): boolean {
  const digits = normalizeCnic(value);
  if (!digits) return false;

  const province = Number(digits[0]);
  if (province < 1 || province > 7) return false;

  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let product = Number(digits[i]) * weights[i];
    if (product > 9) product -= 9;
    sum += product;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === Number(digits[12]);
}

export const PASSWORD_RULES = {
  minLength: 8,
  hint: "At least 8 characters with uppercase, lowercase, a number, and a symbol.",
} as const;

export function isStrongPassword(value: string): boolean {
  if (value.length < PASSWORD_RULES.minLength) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/[a-z]/.test(value)) return false;
  if (!/[0-9]/.test(value)) return false;
  if (!/[^A-Za-z0-9]/.test(value)) return false;
  return true;
}

export function getPasswordErrors(value: string): string[] {
  const errors: string[] = [];
  if (value.length < PASSWORD_RULES.minLength) {
    errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters.`);
  }
  if (!/[A-Z]/.test(value)) errors.push("Include at least one uppercase letter.");
  if (!/[a-z]/.test(value)) errors.push("Include at least one lowercase letter.");
  if (!/[0-9]/.test(value)) errors.push("Include at least one number.");
  if (!/[^A-Za-z0-9]/.test(value)) errors.push("Include at least one symbol (e.g. ! @ #).");
  return errors;
}

/** Latest allowed DOB = exactly 18 years before today. */
export function maxDateOfBirth(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().slice(0, 10);
}

export function minDateOfBirth(): string {
  return "1940-01-01";
}

export function isAdultDateOfBirth(value: string): boolean {
  const dob = new Date(`${value}T12:00:00`);
  if (Number.isNaN(dob.getTime())) return false;

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  if (dob > today) return false;

  const minAge = new Date(today);
  minAge.setFullYear(minAge.getFullYear() - 18);
  return dob <= minAge;
}

export function getDateOfBirthError(value: string): string | null {
  if (!value) return "Date of birth is required.";
  const dob = new Date(`${value}T12:00:00`);
  if (Number.isNaN(dob.getTime())) return "Enter a valid date of birth.";

  const today = new Date();
  today.setHours(12, 0, 0, 0);
  if (dob > today) return "Date of birth cannot be in the future.";

  if (!isAdultDateOfBirth(value)) {
    return "Person must be at least 18 years old.";
  }
  return null;
}

export const cnicSchema = z
  .string()
  .min(1, "CNIC is required.")
  .refine(isValidPakistanCnic, "Enter a valid Pakistan CNIC (XXXXX-XXXXXXX-X).");

export const passwordSchema = z
  .string()
  .min(PASSWORD_RULES.minLength, `Password must be at least ${PASSWORD_RULES.minLength} characters.`)
  .refine(isStrongPassword, PASSWORD_RULES.hint);

export const dateOfBirthSchema = z
  .string()
  .min(1, "Date of birth is required.")
  .refine(isAdultDateOfBirth, "Person must be at least 18 years old (cannot use today's date).");

export const portalEmailSchema = z.string().email("Enter a valid email address.");

/** Normalize to 11-digit Pakistan mobile: 03XXXXXXXXX */
export function normalizePakistanPhone(value: string): string | null {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("92") && digits.length === 12) {
    digits = `0${digits.slice(2)}`;
  } else if (digits.length === 10 && digits.startsWith("3")) {
    digits = `0${digits}`;
  }

  if (digits.length !== 11 || !/^03[0-9]{9}$/.test(digits)) {
    return null;
  }

  return digits;
}

/** Display as 03XX-XXXXXXX */
export function formatPakistanPhone(value: string): string {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("92")) {
    digits = digits.slice(2);
  }
  if (digits.length > 0 && digits[0] === "3" && !digits.startsWith("03")) {
    digits = `0${digits}`;
  }

  digits = digits.slice(0, 11);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export function isValidPakistanPhone(value: string): boolean {
  return normalizePakistanPhone(value) !== null;
}

export function getPhoneError(value: string): string | null {
  if (!value.trim()) return "Phone number is required.";
  if (!isValidPakistanPhone(value)) {
    return "Enter a valid Pakistan mobile number (e.g. 0300-1234567).";
  }
  return null;
}

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required.")
  .refine(isValidPakistanPhone, "Enter a valid Pakistan mobile number (e.g. 0300-1234567).");
