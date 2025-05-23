import { Input } from "@heroui/react";

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="flex flex-col gap-2 mb-2">
      <label className="min-w-40 text-sm font-medium">{label}</label>
      <div className="flex gap-2 items-end flex-1">
        <input
          className="w-12 h-8 rounded cursor-pointer"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Input
          label='Hex'
          labelPlacement='outside'
          type="text"
          value={value}
          variant='bordered'
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}