import { useRef, useEffect, useState, useCallback } from 'react';
import 'mathlive';
import type { MathfieldElement } from 'mathlive';
import { SYMBOL_CATEGORIES } from '../utils/symbols';
import { SymbolPalette } from './SymbolPalette';
import { Keyboard, Eraser, Copy } from 'lucide-react';

interface MathEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MathEditor({ value, onChange, placeholder }: MathEditorProps) {
  const mathFieldRef = useRef<MathfieldElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [activeCategory, setActiveCategory] = useState('basic');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (containerRef.current && !mathFieldRef.current) {
      const mf = new MathfieldElement();
      mf.value = value;
      mf.setOptions({
        virtualKeyboardMode: 'manual',
        smartFence: true,
        smartSuperscript: true,
        removeExtraneousParentheses: true,
        locale: 'ar',
        readOnly: false,
        style: {
          fontSize: '1.2rem',
          padding: '12px 16px',
        },
      });

      mf.addEventListener('input', () => {
        onChange(mf.value);
      });

      containerRef.current.appendChild(mf);
      mathFieldRef.current = mf;
    }

    return () => {
      if (mathFieldRef.current) {
        mathFieldRef.current.remove();
        mathFieldRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mathFieldRef.current && mathFieldRef.current.value !== value) {
      mathFieldRef.current.value = value;
    }
  }, [value]);

  const insertSymbol = useCallback((latex: string) => {
    if (mathFieldRef.current) {
      // ✅ الإصلاح: استبدل \\ بـ \ عشان mathlive يفهمها
      mathFieldRef.current.executeCommand(['insert', latex.replace(/\\\\/g, '\\')]);
      mathFieldRef.current.focus();
    }
  }, []);

  const clear = useCallback(() => {
    if (mathFieldRef.current) {
      mathFieldRef.current.value = '';
      onChange('');
    }
  }, [onChange]);

  const copyToClipboard = useCallback(() => {
    if (mathFieldRef.current) {
      navigator.clipboard.writeText(mathFieldRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button
          onClick={() => setShowPalette(!showPalette)}
          className={`math-btn-secondary flex items-center gap-2 ${
            showPalette ? 'bg-primary-100 text-primary-700' : ''
          }`}
        >
          <Keyboard size={18} />
          <span>لوحة الرموز</span>
        </button>

        <button onClick={clear} className="math-btn-secondary flex items-center gap-2">
          <Eraser size={18} />
          <span>مسح</span>
        </button>

        <button onClick={copyToClipboard} className="math-btn-secondary flex items-center gap-2">
          <Copy size={18} />
          <span>{copied ? 'تم النسخ!' : 'نسخ LaTeX'}</span>
        </button>

        <div className="flex items-center gap-1 mr-auto">
          <span className="text-sm text-gray-500">LaTeX:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono truncate max-w-[200px]">
            {value || '...'}
          </code>
        </div>
      </div>

      <div ref={containerRef} className="min-h-[80px] w-full" dir="ltr" />

      {showPalette && (
        <SymbolPalette
          categories={SYMBOL_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onSymbolSelect={insertSymbol}
        />
      )}
    </div>
  );
}
