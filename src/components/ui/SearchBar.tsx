"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const [expanded, setExpanded] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedOnChange = useCallback(
    debounce((val: string) => onChange(val), 300),
    [onChange]
  );

  useEffect(() => {
    debouncedOnChange(local);
  }, [local, debouncedOnChange]);

  useEffect(() => {
    setLocal(value);
    setHasValue(!!value);
  }, [value]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setLocal("");
    setHasValue(false);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      onClick={() => {
        if (!expanded && !hasValue) {
          setExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        if (!isFocused && !local) setExpanded(false);
      }}
      className={`group relative flex items-center transition-all duration-500 ease-out ${
        expanded || hasValue
          ? "w-full md:w-[280px] lg:w-[340px]"
          : "w-16 cursor-pointer"
      }`}
    >
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          setHasValue(!!e.target.value);
        }}
        onFocus={() => { setExpanded(true); setIsFocused(true); }}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`input-field w-full rounded-xl border py-2.5 pl-9 pr-9 text-sm transition-all duration-500 ${
          expanded || hasValue
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Search icon — always visible */}
      <FiSearch
        size={17}
        className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition-all duration-300 ${
          expanded || hasValue
            ? "text-gold"
            : "text-muted hover:text-foreground cursor-pointer"
        }`}
        onClick={() => {
          setExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
      />

      {/* Clear button */}
      {local && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
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
