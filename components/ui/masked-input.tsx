/**
 * Masked Input Component
 *
 * Reusable input component with built-in masking for common formats.
 * Uses @react-input/mask library for reliable masking functionality compatible with React 19.
 * Supports DEA, Tax ID, SSN, NPI, Phone, ZIP, and custom mask patterns.
 */

"use client";

import * as React from "react";
import { useMask, format } from "@react-input/mask";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type MaskType = "dea" | "taxId" | "ssn" | "npi" | "phone" | "zip" | "custom";

interface MaskedInputProps extends Omit<InputProps, "onChange"> {
  /** The type of mask to apply */
  maskType?: MaskType;
  /** Custom mask pattern (e.g., '___-__-____') */
  customMask?: string;
  /** Callback when the value changes */
  onChange?: (value: string) => void;
  /** The current value */
  value?: string;
  /** Show only last N digits for sensitive data (e.g., showLastDigits={3}) */
  showLastDigits?: number;
}

/**
 * Get mask pattern based on type
 * Uses @react-input/mask notation:
 * - _: any character (defined by replacement prop)
 */
function getMaskPattern(maskType: MaskType): string {
  switch (maskType) {
    case "dea":
      return "aa-_______"; // Format: XX-1234567 (2 letters + 7 digits)
    case "taxId":
      return "__-_______"; // Format: 12-3456789 (2 digits, dash, 7 digits)
    case "ssn":
      return "___-__-____"; // Format: 123-45-6789 (9 digits)
    case "npi":
      return "__________"; // Format: 1234567890 (10 digits)
    case "phone":
      return "(___) ___-____"; // Format: (555) 123-4567
    case "zip":
      return "_____-____"; // Format: 12345-6789
    default:
      return "";
  }
}

/**
 * Get replacement pattern for mask type
 * Uses regex to validate input characters
 */
function getReplacement(maskType: MaskType): Record<string, RegExp> {
  switch (maskType) {
    case "dea":
      return { a: /[A-Za-z]/, _: /\d/ };
    case "taxId":
    case "ssn":
    case "npi":
    case "phone":
    case "zip":
      return { _: /\d/ };
    default:
      return { _: /./ };
  }
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    { maskType, customMask, onChange, value = "", className, variant, size, showLastDigits, ...props },
    ref,
  ) => {
    const [isRevealed, setIsRevealed] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    
    const mask = customMask || (maskType ? getMaskPattern(maskType) : "");
    const replacement = maskType ? getReplacement(maskType) : { _: /./ };

    const maskRef = useMask({
      mask,
      replacement,
      showMask: false,
      separate: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    React.useImperativeHandle(ref, () => maskRef.current as HTMLInputElement);

    const getEncryptedDisplay = (val: string, lastDigits: number): string => {
      if (!val) return "";
      const cleanValue = val.replace(/[^0-9]/g, "");
      if (cleanValue.length <= lastDigits) return val;
      
      const lastChars = cleanValue.slice(-lastDigits);
      const maskedLength = cleanValue.length - lastDigits;
      const maskedPart = "X".repeat(maskedLength);
      const unmaskedValue = maskedPart + lastChars;
      
      if (maskType === "taxId") {
        return format(unmaskedValue, {
          mask: "__-_______",
          replacement: { _: /[X0-9]/ },
        });
      }
      
      if (maskType === "npi") {
        return unmaskedValue;
      }
      
      return format(unmaskedValue, {
        mask,
        replacement: { _: /[X0-9]/ },
      });
    };

    const handleToggleReveal = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsRevealed(true);

      timeoutRef.current = setTimeout(() => {
        setIsRevealed(false);
        timeoutRef.current = null;
      }, 4000);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const shouldEncrypt = showLastDigits !== undefined && !isRevealed;
    const displayValue = shouldEncrypt && value ? getEncryptedDisplay(value, showLastDigits) : value;
    const showEyeIcon = showLastDigits !== undefined;

    if (!mask) {
      return (
        <div className="relative">
          <Input
            ref={ref}
            value={displayValue}
            onChange={handleChange}
            className={cn(showEyeIcon && "pr-10", className)}
            variant={variant}
            size={size}
            {...props}
          />
          {showEyeIcon && (
            <Button
              onClick={handleToggleReveal}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon 
                icon={isRevealed ? ViewOffSlashIcon : ViewIcon} 
                className="h-4 w-4"
              />
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        <Input
          ref={maskRef}
          value={displayValue}
          onChange={handleChange}
          className={cn(showEyeIcon && "pr-10", className)}
          variant={variant}
          size={size}
          {...props}
        />
        {showEyeIcon && (
          <Button
           variant="ghost"
            onClick={handleToggleReveal}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon 
              icon={isRevealed ? ViewOffSlashIcon : ViewIcon} 
              className="h-4 w-4 cursor-pointer"
            />
          </Button>
        )}
      </div>
    );
  },
);

MaskedInput.displayName = "MaskedInput";
