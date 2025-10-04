import React, { useEffect, useRef, useState } from "react";

export type SuggestionItem<T = string> = {
    id: string | number;
    label: string;
    data?: T;
};

type GetSuggestionsFn<T> = (query: string) => Promise<Array<SuggestionItem<T>>> | Array<SuggestionItem<T>>;

type Props<T = string> = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    minChars?: number;
    debounceMs?: number;
    getSuggestions: GetSuggestionsFn<T>;
    onSelect?: (item: SuggestionItem<T>) => void;
    renderSuggestion?: (item: SuggestionItem<T>, query: string) => React.ReactNode;
    noResultsMessage?: string;
    className?: string;
    inputClassName?: string;
    leftIcon?: React.ReactNode;
};

export default function AutosuggestInput<T = string>({
    value: controlledValue,
    onChange,
    placeholder = "Start typing...",
    minChars = 1,
    debounceMs = 250,
    getSuggestions,
    onSelect,
    renderSuggestion,
    noResultsMessage = "No results",
    className = "w-full max-w-md",
    inputClassName = "",
    leftIcon,
}: Props<T>) {
    const [inputValue, setInputValue] = useState(controlledValue ?? "");
    const [suggestions, setSuggestions] = useState<Array<SuggestionItem<T>>>([]);
    const [showList, setShowList] = useState(false);
    const [loading, setLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const fetchId = useRef(0);
    const debounceTimer = useRef<number | null>(null);

    useEffect(() => {
        if (controlledValue !== undefined) setInputValue(controlledValue);
    }, [controlledValue]);

    useEffect(() => {
        return () => {
            if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
        };
    }, []);

    useEffect(() => {
        if ((inputValue ?? "").length < minChars) {
            setSuggestions([]);
            setShowList(false);
            setLoading(false);
            return;
        }

        setLoading(true);
        const id = ++fetchId.current;

        if (debounceTimer.current) window.clearTimeout(debounceTimer.current);

        debounceTimer.current = window.setTimeout(async () => {
            try {
                const result = await Promise.resolve(getSuggestions(inputValue));
                if (id === fetchId.current) {
                    setSuggestions(result ?? []);
                    setShowList(true);
                    setHighlightedIndex(result && result.length > 0 ? 0 : -1);
                }
            } catch (err) {
                setSuggestions([]);
                setShowList(false);
                setHighlightedIndex(-1);
            } finally {
                if (id === fetchId.current) setLoading(false);
            }
        }, debounceMs);
    }, [inputValue, getSuggestions, minChars, debounceMs]);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target as Node)) {
                setShowList(false);
                setHighlightedIndex(-1);
            }
        }
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    function handleInputChange(v: string) {
        if (onChange) onChange(v);
        if (controlledValue === undefined) setInputValue(v);
    }

    function handleSelect(item: SuggestionItem<T>) {
        handleInputChange(item.label);
        setShowList(false);
        setHighlightedIndex(-1);
        if (onSelect) onSelect(item);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showList) {
            if (e.key === "ArrowDown") {
                setShowList(true);
                setHighlightedIndex(suggestions.length > 0 ? 0 : -1);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((i) => Math.min(suggestions.length - 1, i + 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((i) => Math.max(0, i - 1));
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    handleSelect(suggestions[highlightedIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setShowList(false);
                setHighlightedIndex(-1);
                break;
            case "Tab":
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    handleSelect(suggestions[highlightedIndex]);
                }
                break;
        }
    }

    function renderDefaultSuggestion(item: SuggestionItem<T>, query: string) {
        const label = item.label;
        const idx = label.toLowerCase().indexOf(query.toLowerCase());

        if (idx === -1) return <span>{label}</span>;

        const before = label.slice(0, idx);
        const match = label.slice(idx, idx + query.length);
        const after = label.slice(idx + query.length);

        return (
            <span>
                {before}
                <span className="font-semibold underline">{match}</span>
                {after}
            </span>
        );
    }

    return (
        <div ref={containerRef} className={className}>
            <div className="relative">
                {leftIcon && (
                    <span className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center justify-center text-gray-500">
                        {leftIcon}
                    </span>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={showList}
                    aria-controls="autosuggest-list"
                    aria-autocomplete="list"
                    aria-activedescendant={
                        highlightedIndex >= 0 && suggestions[highlightedIndex] ? `autosuggest-item-${suggestions[highlightedIndex].id}` : undefined
                    }
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                        if (suggestions.length > 0) setShowList(true);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className={`w-full rounded-md bg-white px-3 py-2 focus:ring-0 focus:outline-none ${leftIcon ? "pl-9" : ""} ${inputClassName}`}
                />

                {loading && <div className="absolute top-2 right-2 text-sm opacity-70">...</div>}

                {showList && (
                    <ul id="autosuggest-list" role="listbox" className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                        {suggestions.length === 0 && !loading ? (
                            <li className="px-3 py-2 text-sm text-gray-500">{noResultsMessage}</li>
                        ) : (
                            suggestions.map((s, idx) => (
                                <li
                                    id={`autosuggest-item-${s.id}`}
                                    role="option"
                                    key={s.id}
                                    aria-selected={idx === highlightedIndex}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onClick={() => handleSelect(s)}
                                    onMouseEnter={() => setHighlightedIndex(idx)}
                                    className={`cursor-pointer px-3 py-2 text-sm select-none ${idx === highlightedIndex ? "bg-gray-100" : ""}`}
                                >
                                    {renderSuggestion ? renderSuggestion(s, inputValue) : renderDefaultSuggestion(s, inputValue)}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
