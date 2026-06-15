import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatCnic,
  formatPakistanPhone,
  maxDateOfBirth,
  minDateOfBirth,
  PASSWORD_RULES,
} from "@/lib/admin/person-form";

export type PersonAccountFormValues = {
  email: string;
  password: string;
  cnic: string;
  dateOfBirth: string;
  phone: string;
};

type PersonAccountFieldsProps = {
  values: PersonAccountFormValues;
  onChange: (patch: Partial<PersonAccountFormValues>) => void;
  requirePassword?: boolean;
  idPrefix: string;
};

export function PersonAccountFields({
  values,
  onChange,
  requirePassword = false,
  idPrefix,
}: PersonAccountFieldsProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-email`}>Portal email</Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          autoComplete="off"
          value={values.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="name@university.edu.pk"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-password`}>
          {requirePassword ? "Password" : "New password (optional)"}
        </Label>
        <Input
          id={`${idPrefix}-password`}
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(e) => onChange({ password: e.target.value })}
          placeholder={requirePassword ? "Set login password" : "Leave blank to keep current"}
        />
        <p className="text-xs text-muted-foreground">{PASSWORD_RULES.hint}</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-phone`}>Phone number</Label>
        <Input
          id={`${idPrefix}-phone`}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => onChange({ phone: formatPakistanPhone(e.target.value) })}
          placeholder="0300-1234567"
          maxLength={12}
        />
        <p className="text-xs text-muted-foreground">Pakistan mobile (03XX-XXXXXXX)</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-cnic`}>CNIC</Label>
          <Input
            id={`${idPrefix}-cnic`}
            inputMode="numeric"
            value={values.cnic}
            onChange={(e) => onChange({ cnic: formatCnic(e.target.value) })}
            placeholder="12345-1234567-1"
            maxLength={15}
          />
          <p className="text-xs text-muted-foreground">Pakistan CNIC format</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-dob`}>Date of birth</Label>
          <Input
            id={`${idPrefix}-dob`}
            type="date"
            value={values.dateOfBirth}
            min={minDateOfBirth()}
            max={maxDateOfBirth()}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">Must be 18+ years old</p>
        </div>
      </div>
    </>
  );
}
