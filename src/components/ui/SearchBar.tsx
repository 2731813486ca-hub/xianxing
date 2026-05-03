"use client";

import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "搜索作品...",
}: SearchBarProps) {
  const [local, setLocal] = useState(value);

  const debouncedOnChange = useCallback(
    debounce((val: string) => onChange(val), 300),
    [onChange]
  );

  useEffect(() => {
    debouncedOnChange(local);
  }, [local, debouncedOnChange]);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className="relative w-full max-w-md">
      <FiSearch
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="input-field w-full rounded-xl border py-3 pl-10 pr-10 text-sm"
      />
      {local && (
        <button
          onClick={() => setLocal("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
          aria-label="清除"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
