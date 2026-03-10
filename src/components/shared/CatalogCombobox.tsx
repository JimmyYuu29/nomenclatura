import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

export interface ComboboxItem {
  value: string;
  label: string;
  description?: string;
  group?: string;
  disabled?: boolean;
}

interface CatalogComboboxProps {
  items: ComboboxItem[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  grouped?: boolean;
  className?: string;
  disabled?: boolean;
  renderItem?: (item: ComboboxItem, isSelected: boolean) => React.ReactNode;
}

export function CatalogCombobox({
  items,
  value,
  onSelect,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No se encontraron resultados.',
  grouped = false,
  className,
  disabled = false,
  renderItem,
}: CatalogComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedItem = items.find(i => i.value === value);
  const displayText = selectedItem
    ? `${selectedItem.value} - ${selectedItem.label}`
    : placeholder;

  // Group items by their group property
  const groupedItems = grouped
    ? items.reduce<Record<string, ComboboxItem[]>>((acc, item) => {
        const group = item.group || 'Otros';
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      }, {})
    : { '': items };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              !value && 'text-muted-foreground',
              className
            )}
          >
            <span className="truncate">{displayText}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-[var(--anchor-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {Object.entries(groupedItems).map(([group, groupItems]) => (
              <CommandGroup key={group} heading={group || undefined}>
                {groupItems.map(item => {
                  const isSelected = item.value === value;
                  return (
                    <CommandItem
                      key={item.value}
                      value={`${item.value} ${item.label} ${item.description || ''}`}
                      data-checked={isSelected}
                      onSelect={() => {
                        onSelect(item.value);
                        setOpen(false);
                      }}
                      disabled={item.disabled}
                    >
                      {renderItem ? (
                        renderItem(item, isSelected)
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-medium">{item.value}</span>
                          {item.description && (
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          )}
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
