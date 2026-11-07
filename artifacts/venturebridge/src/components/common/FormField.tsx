export interface FieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
  hint?: string;
}

export function Field({
  label,
  name,
  placeholder,
  required = true,
  type = 'text',
  defaultValue,
  hint,
}: FieldProps) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      {required && <span className="ml-1 text-[#b75f59]">*</span>}
      <input
        name={name}
        type={type}
        required={required}
        min={type === 'number' ? 1 : undefined}
        step={type === 'number' ? 0.5 : undefined}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#76a0c6] focus:ring-3 focus:ring-[#eaf2fa]"
      />
      {hint && <span className="mt-1 block text-[10px] font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

export function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[11px] font-medium text-slate-400">{label}</span>
      <span className="mt-0.5 block text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[.06em] text-slate-400">{label}</h3>
      <p className="mt-1.5 text-xs leading-5 text-slate-700">{text}</p>
    </div>
  );
}
