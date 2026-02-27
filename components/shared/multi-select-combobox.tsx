'use client';

import * as React from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectComboboxProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Multi-select combobox with chips display
 * 
 * Features:
 * - Multiple selection with chips
 * - Search/filter functionality
 * - Keyboard navigation
 * - Built-in chip removal
 */
export function MultiSelectCombobox({
  options,
  value = [],
  onChange,
  placeholder = 'Select items...',
  emptyMessage = 'No items found',
  disabled = false,
  className,
  size,
  error = false,
}: Readonly<MultiSelectComboboxProps>) {
  const anchor = useComboboxAnchor();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setAnchorEl(anchor.current);
  }, [anchor]);

  // Find selected items based on value array
  const selectedItems = React.useMemo(() => {
    return value
      .map((val) => options.find((opt) => opt.value === val))
      .filter((item): item is MultiSelectOption => item !== undefined);
  }, [options, value]);

  const handleValueChange = (newSelectedItems: MultiSelectOption[] | MultiSelectOption | null) => {
    let itemsArray: MultiSelectOption[];
    if (Array.isArray(newSelectedItems)) {
      itemsArray = newSelectedItems;
    } else if (newSelectedItems) {
      itemsArray = [newSelectedItems];
    } else {
      itemsArray = [];
    }
    const newValues = itemsArray.map((item) => item.value);
    onChange(newValues);
  };

  return (
    <div className={cn(className)}>

      <Combobox<MultiSelectOption, true>
        items={options}
        value={selectedItems}
        onValueChange={handleValueChange}
        itemToStringValue={(item) => item?.label ?? ''}
        multiple={true}
        disabled={disabled}
      >
        <ComboboxChips ref={anchor} aria-invalid={error} size={size === 'md' ? 'default' : size}>
          {selectedItems.map((item) => (
            <ComboboxChip key={item.value}>
              {item.label}
            </ComboboxChip>
          ))}
          <ComboboxChipsInput
            placeholder={selectedItems.length === 0 ? placeholder : undefined}
            disabled={disabled}
            // size prop not needed for input, handled by ComboboxChips context
          />
        </ComboboxChips>

      <ComboboxContent anchor={anchorEl}>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item: MultiSelectOption) => (
            <ComboboxItem key={item.value} value={item}>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm">{item.label}</span>
                {item.description && (
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                )}
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    </div>
  );
}
