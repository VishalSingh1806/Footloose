import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
  /** Accept either string[] or {value,label}[] */
  options: Option[] | string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  /** Extra class names applied to the outer wrapper div */
  className?: string;
}

function CustomDropdown({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder = 'Select',
  required = false,
  error = '',
  disabled = false,
  className = '',
}: CustomDropdownProps) {
  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-[#1D3557] mb-2"
        >
          {label}
          {required && <span className="text-[#DC2626] ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error && errorId ? errorId : undefined}
          className={`
            w-full h-[52px] px-4 pr-10
            rounded-[10px] border-2
            bg-white text-base
            appearance-none cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#9B59B6]/20
            disabled:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-60
            ${
              error
                ? 'border-[#DC2626] text-[#1D3557] focus:border-[#DC2626]'
                : value
                ? 'border-[#9B59B6] text-[#1D3557] focus:border-[#9B59B6]'
                : 'border-[#E5E7EB] text-[#ADB5BD] hover:border-[#9CA3AF] focus:border-[#9B59B6]'
            }
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className={`
            absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5
            pointer-events-none transition-colors
            ${value && !disabled ? 'text-[#9B59B6]' : 'text-[#6C757D]'}
          `}
        />
      </div>

      {error && (
        <p id={errorId} className="mt-2 text-[13px] text-[#DC2626]">
          {error}
        </p>
      )}
    </div>
  );
}

export default CustomDropdown;
