import { useState, useEffect, useRef } from "react";

export function useDropdown<T extends HTMLElement = HTMLElement>() {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<T | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    /* 🔹 Close dropdown on outside click */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                !triggerRef.current?.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return { open, setOpen, triggerRef, dropdownRef };
}
