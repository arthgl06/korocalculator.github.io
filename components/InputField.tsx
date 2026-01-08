import React from 'react';
import { HelpCircle } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  helpText?: string;
  id: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  helpText,
  id
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {helpText && (
          <div className="group relative flex items-center">
            <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 hidden w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg group-hover:block z-10">
              {helpText}
              <div className="absolute right-1 -bottom-1 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
      </div>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-slate-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type="number"
          name={id}
          id={id}
          className={`block w-full rounded-md border-0 py-2.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
            prefix ? 'pl-10' : 'pl-3'
          } ${suffix ? 'pr-12' : 'pr-3'}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => e.target.select()}
        />
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;