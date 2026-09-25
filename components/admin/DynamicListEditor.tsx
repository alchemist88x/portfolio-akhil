"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface DynamicListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  helperText?: string;
}

export default function DynamicListEditor({
  label,
  items,
  onChange,
  placeholder = "Add item...",
  helperText,
}: DynamicListEditorProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (!items.includes(trimmed)) {
      onChange([...items, trimmed]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(items.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
          {label} ({items.length})
        </label>
        {helperText && <span className="text-[11px] text-zinc-500 font-mono">{helperText}</span>}
      </div>

      {/* Chip list */}
      <div className="flex flex-wrap gap-2 p-2.5 bg-zinc-950/60 border border-zinc-800 rounded-md min-h-[44px]">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/80 text-xs font-mono text-zinc-200 group hover:border-zinc-500 transition-colors"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-zinc-500 hover:text-red-400 transition-colors focus:outline-none"
              title="Remove"
            >
              <X size={13} />
            </button>
          </span>
        ))}

        {items.length === 0 && (
          <span className="text-xs text-zinc-600 font-mono italic self-center">No items added yet</span>
        )}
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 font-mono"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded text-xs font-mono flex items-center gap-1 transition-colors"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}
