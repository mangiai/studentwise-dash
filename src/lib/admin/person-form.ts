import {
  formatCnic,
  formatPakistanPhone,
  getDateOfBirthError,
  getPasswordErrors,
  getPhoneError,
  isValidPakistanCnic,
  maxDateOfBirth,
  minDateOfBirth,
  PASSWORD_RULES,
} from "@/lib/validation/person-fields";

export { formatCnic, formatPakistanPhone, maxDateOfBirth, minDateOfBirth, PASSWORD_RULES };

export type PersonAccountFields = {
  email: string;
  password: string;
  cnic: string;
  dateOfBirth: string;
  phone: string;
};

export function validatePersonAccountFields(
  fields: PersonAccountFields,
  options: { requirePassword: boolean },
): string | null {
  if (!fields.email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    return "Enter a valid email address.";
  }

  if (!fields.cnic.trim()) return "CNIC is required.";
  if (!isValidPakistanCnic(fields.cnic)) {
    return "Enter a valid Pakistan CNIC (XXXXX-XXXXXXX-X).";
  }

  const dobError = getDateOfBirthError(fields.dateOfBirth);
  if (dobError) return dobError;

  const phoneError = getPhoneError(fields.phone);
  if (phoneError) return phoneError;

  if (options.requirePassword) {
    if (!fields.password) return "Password is required.";
    const passwordErrors = getPasswordErrors(fields.password);
    if (passwordErrors.length > 0) return passwordErrors[0];
  } else if (fields.password) {
    const passwordErrors = getPasswordErrors(fields.password);
    if (passwordErrors.length > 0) return passwordErrors[0];
  }

  return null;
}
