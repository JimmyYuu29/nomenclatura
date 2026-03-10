import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AliasClienteFieldProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  disabled?: boolean;
}

export function AliasClienteField({
  value,
  onChange,
  suggestions,
  disabled = false,
}: AliasClienteFieldProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim()) {
      const upper = value.toUpperCase();
      setFilteredSuggestions(
        suggestions.filter(s => s.includes(upper)).slice(0, 8)
      );
    } else {
      setFilteredSuggestions(suggestions.slice(0, 8));
    }
  }, [value, suggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <Label htmlFor="aliasCliente">Alias del Cliente</Label>
      <Input
        ref={inputRef}
        id="aliasCliente"
        placeholder="Ej: FMZ00, CLI01"
        value={value}
        disabled={disabled}
        onChange={e => {
          const val = e.target.value.toUpperCase().replace(/[\s\-]/g, '');
          onChange(val);
        }}
        onFocus={() => setShowSuggestions(true)}
        autoComplete="off"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          {filteredSuggestions.map(s => (
            <button
              key={s}
              type="button"
              className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
              onClick={() => {
                onChange(s);
                setShowSuggestions(false);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
