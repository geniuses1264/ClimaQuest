// SearchBar.jsx


import React, { useState, useRef, useEffect, useCallback } from "react";
import { fetchSearchData } from "../services/api";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    // close when clicking outside
    function onDoc(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetchSearchData(q);
        // normalize results: many APIs return array of {name, region, country}
        const list = Array.isArray(res) ? res : res?.locations ?? [];
        setResults(list || []);
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Search error", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [q]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!open || results.length === 0) {
        if (e.key === "Enter") {
          e.preventDefault();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const sel = activeIndex >= 0 ? results[activeIndex] : results[0];
        if (sel) {
          selectResult(sel);
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
      }
    },
    [open, results, activeIndex]
  );

  const selectResult = (item) => {
    const name = item?.name || item?.title || item?.label || "";
    const region = item?.region ? `, ${item.region}` : "";
    const country = item?.country ? `, ${item.country}` : "";
    const query = `${name}${region}${country}`.trim();
    setQ("");
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
    if (onSelect) onSelect(query);
  };

  return (
    <div ref={containerRef} className="relative max-w-3xl">
      <div className="flex items-center gap-2 bg-white/6 dark:bg-[#071722]/60 backdrop-blur rounded-md p-2 border border-white/10">
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="search" className="sr-only">Search location</label>
          <input
            id="search"
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (results.length>0) setOpen(true); }}
            placeholder="Search city or country..."
            className="w-full bg-transparent outline-none text-white placeholder:text-sky-200/60 px-2 py-2"
            aria-autocomplete="list"
            aria-controls="search-listbox"
            aria-expanded={open}
            role="combobox"
          />
        </div>

        <button
          onClick={() => {
            if (q && results.length > 0) {
              selectResult(results[0]);
            } else if (q && !results.length) {
              // try manual selection - pass raw query
              if (onSelect) onSelect(q);
              setQ("");
            } else {
              inputRef.current?.focus();
            }
          }}
          className="p-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white"
          aria-label="Search"
        >
          {loading ? <div className="h-4 w-4 rounded-full animate-pulse bg-white/80" /> : <FaSearch />}
        </button>
      </div>

      {/* Suggestions */}
      {open && results.length > 0 && (
        <ul
          id="search-listbox"
          role="listbox"
          className="absolute z-40 mt-2 w-full max-h-60 overflow-auto bg-white/6 dark:bg-[#071722]/60 backdrop-blur rounded-md border border-white/10 shadow-lg"
        >
          {results.map((r, i) => {
            const label = `${r.name}${r.region ? `, ${r.region}` : ""}${r.country ? `, ${r.country}` : ""}`;
            return (
              <li
                key={i}
                role="option"
                aria-selected={activeIndex === i}
                onMouseDown={(e) => { e.preventDefault(); selectResult(r); }}
                className={`px-3 py-2 cursor-pointer text-white hover:bg-white/8 ${activeIndex === i ? "bg-white/8" : ""}`}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
