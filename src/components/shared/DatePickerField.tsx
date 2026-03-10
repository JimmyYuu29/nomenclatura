import { useState, useMemo } from 'react';
import { format, setMonth, setYear, getYear, getMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DatePickerFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function DatePickerField({
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  className,
  disabled = false,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [navDate, setNavDate] = useState<Date>(value ?? new Date());

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const arr: number[] = [];
    for (let y = currentYear - 30; y <= currentYear + 5; y++) arr.push(y);
    return arr;
  }, []);

  const handleMonthChange = (monthStr: string) => {
    setNavDate(prev => setMonth(prev, parseInt(monthStr)));
  };

  const handleYearChange = (yearStr: string) => {
    setNavDate(prev => setYear(prev, parseInt(yearStr)));
  };

  const handlePrevMonth = () => {
    setNavDate(prev => {
      const m = getMonth(prev);
      const y = getYear(prev);
      return m === 0 ? setMonth(setYear(prev, y - 1), 11) : setMonth(prev, m - 1);
    });
  };

  const handleNextMonth = () => {
    setNavDate(prev => {
      const m = getMonth(prev);
      const y = getYear(prev);
      return m === 11 ? setMonth(setYear(prev, y + 1), 0) : setMonth(prev, m + 1);
    });
  };

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setNavDate(value ?? new Date()); }}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'dd/MM/yyyy', { locale: es }) : placeholder}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2 space-y-2">
          {/* Year/Month navigation header */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={String(getMonth(navDate))} onValueChange={(v) => { if (v) handleMonthChange(v); }}>
              <SelectTrigger className="h-7 flex-1 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS_ES.map((m, i) => (
                  <SelectItem key={i} value={String(i)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(getYear(navDate))} onValueChange={(v) => { if (v) handleYearChange(v); }}>
              <SelectTrigger className="h-7 w-[80px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="single"
            month={navDate}
            onMonthChange={setNavDate}
            selected={value ?? undefined}
            onSelect={(date) => {
              onChange(date ?? null);
              setOpen(false);
            }}
            locale={es}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
