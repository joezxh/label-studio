import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import styles from "./LanguageSwitcher.module.css";
import { SUPPORTED_LANGUAGES, useLanguage, type LanguageCode } from "../../i18n";

interface LanguageSwitcherProps {
  className?: string;
}

const GlobeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === language) ?? SUPPORTED_LANGUAGES[0];

  const choose = (code: LanguageCode) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div className={clsx(styles.languageSwitcher, className)} ref={rootRef}>
      <button
        type="button"
        className={clsx(styles.trigger)}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={current.label}
      >
        <span className={clsx(styles.icon)}>
          <GlobeIcon />
        </span>
        <span className={clsx(styles.label)}>{current.short}</span>
      </button>

      {open && (
        <ul className={clsx(styles.menu)} role="menu">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <li key={lang.code} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={lang.code === language}
                className={clsx(styles.item, {
                  [styles.itemActive]: lang.code === language,
                })}
                onClick={() => choose(lang.code)}
              >
                <span>{lang.label}</span>
                {lang.code === language && <span className={clsx(styles.check)}>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
