import { useState } from 'react';
import type { SymbolCategory } from '../types';
import { Search, X } from 'lucide-react';

interface SymbolPaletteProps {
  categories: SymbolCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onSymbolSelect: (latex: string) => void;
}

export function SymbolPalette({
  categories,
  activeCategory,
  onCategoryChange,
  onSymbolSelect,
}: SymbolPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  const activeSymbols = categories.find(c => c.id === activeCategory)?.symbols || [];

  const filteredSymbols = searchQuery
    ? categories.flatMap(c => c.symbols).filter(s =>
        s.descriptionAr.includes(searchQuery) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.latex.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeSymbols;

  return (
    <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-gray-100">
        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن رمز..."
            className="math-input pr-10"
            dir="rtl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onCategoryChange(cat.id);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id && !searchQuery
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.nameAr}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-h-[300px] overflow-y-auto">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {filteredSymbols.map((symbol, idx) => (
            <button
              key={`${symbol.latex}-${idx}`}
              onClick={() => onSymbolSelect(symbol.latex)}
              onMouseEnter={() => setHoveredSymbol(symbol.latex)}
              onMouseLeave={() => setHoveredSymbol(null)}
              className="symbol-btn relative"
              title={`${symbol.descriptionAr} - ${symbol.latex}`}
            >
              <span className="text-lg" dangerouslySetInnerHTML={{
                __html: renderSymbolPreview(symbol.latex)
              }} />
              {hoveredSymbol === symbol.latex && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50">
                  <div className="font-medium">{symbol.descriptionAr}</div>
                  <div className="text-gray-300 font-mono">{symbol.latex}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderSymbolPreview(latex: string): string {
  const previews: Record<string, string> = {
    '\\frac{}{}': 'a/b',
    '\\sqrt{}': '√',
    '\\sqrt[]{}': 'ⁿ√',
    '^{}': 'xⁿ',
    '_{}': 'xₙ',
    '\\pi': 'π',
    '\\infty': '∞',
    '\\pm': '±',
    '\\cdot': '⋅',
    '\\div': '÷',
    '\\neq': '≠',
    '\\approx': '≈',
    '\\equiv': '≡',
    '\\propto': '∝',
    '\\%': '%',
    '\\frac{d}{dx}': 'd/dx',
    '\\frac{dy}{dx}': 'dy/dx',
    '\\frac{d^2}{dx^2}': 'd²/dx²',
    '\\int': '∫',
    '\\int_{}^{}': '∫ₐᵇ',
    '\\oint': '∮',
    '\\iint': '∬',
    '\\iiint': '∭',
    '\\lim_{x \\to }': 'lim',
    '\\sum_{}^{}': 'Σ',
    '\\prod_{}^{}': 'Π',
    '\\partial': '∂',
    '\\nabla': '∇',
    '\\Delta': 'Δ',
    '\\delta': 'δ',
    '\\sum_{i=1}^{n}': 'Σᵢⁿ',
    '\\prod_{i=1}^{n}': 'Πᵢⁿ',
    '\\binom{}{}': '(n k)',
    '\\log_{}': 'log',
    '\\ln': 'ln',
    '\\exp': 'exp',
    '\\sin': 'sin',
    '\\cos': 'cos',
    '\\tan': 'tan',
    '\\cot': 'cot',
    '\\sec': 'sec',
    '\\csc': 'csc',
    '\\arcsin': 'arcsin',
    '\\arccos': 'arccos',
    '\\arctan': 'arctan',
    '\\sinh': 'sinh',
    '\\cosh': 'cosh',
    '\\tanh': 'tanh',
    '\\forall': '∀',
    '\\exists': '∃',
    '\\in': '∈',
    '\\notin': '∉',
    '\\subset': '⊂',
    '\\supset': '⊃',
    '\\cup': '∪',
    '\\cap': '∩',
    '\\emptyset': '∅',
    '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}': 'M',
    '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}': '[M]',
    '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}': '|M|',
    '\\det': 'det',
    '\\tr': 'tr',
    '\\rank': 'rank',
    '\\dim': 'dim',
    '\\ker': 'ker',
    '\\operatorname{adj}': 'adj',
    '\\operatorname{cof}': 'cof',
    '\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}': 'I₃',
    '\\lambda': 'λ',
    '\\alpha': 'α',
    '\\beta': 'β',
    '\\gamma': 'γ',
    '\\Gamma': 'Γ',
    '\\zeta': 'ζ',
    '\\eta': 'η',
    '\\theta': 'θ',
    '\\Theta': 'Θ',
    '\\iota': 'ι',
    '\\kappa': 'κ',
    '\\Lambda': 'Λ',
    '\\mu': 'μ',
    '\\nu': 'ν',
    '\\xi': 'ξ',
    '\\Xi': 'Ξ',
    '\\Pi': 'Π',
    '\\rho': 'ρ',
    '\\sigma': 'σ',
    '\\Sigma': 'Σ',
    '\\tau': 'τ',
    '\\phi': 'φ',
    '\\Phi': 'Φ',
    '\\chi': 'χ',
    '\\psi': 'ψ',
    '\\Psi': 'Ψ',
    '\\omega': 'ω',
    '\\Omega': 'Ω',
    '\\vec{}': 'v⃗',
    '\\hat{}': 'î',
    '\\times': '×',
    '\\angle': '∠',
    '\\perp': '⊥',
    '\\parallel': '∥',
    '\\cong': '≅',
    '\\sim': '∼',
    '\\triangle': '△',
    '\\square': '□',
    '\\circ': '°',
    '\\overrightarrow{}': 'AB→',
    '\\overline{}': 'AB̄',
    '\\nabla \\cdot': '∇⋅',
    '\\nabla \\times': '∇×',
    '\\nabla^2': '∇²',
    '\\sum \\vec{F} = 0': 'ΣF=0',
    '\\vec{F} = m\\vec{a}': 'F=ma',
    '\\vec{\\tau} = \\vec{r} \\times \\vec{F}': 'τ=r×F',
    '\\vec{L} = \\vec{r} \\times \\vec{p}': 'L=r×p',
    '\\frac{1}{2}mv^2': '½mv²',
    'mgh': 'mgh',
    '\\vec{p} = m\\vec{v}': 'p=mv',
    'I': 'I',
    '\\epsilon': 'ε',
    'E = \\frac{\\sigma}{\\epsilon}': 'E=σ/ε',
    '\\Re': 'Re',
    '\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}': '∇⋅E',
    '\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}': '∇×E',
    '\\leq': '≤',
    '\\geq': '≥',
    '\\ll': '≪',
    '\\gg': '≫',
    '\\prec': '≺',
    '\\succ': '≻',
    '\\preceq': '≼',
    '\\succeq': '≽',
    '\\simeq': '≃',
    '\\rightarrow': '→',
    '\\leftarrow': '←',
    '\\Rightarrow': '⇒',
    '\\Leftarrow': '⇐',
    '\\Leftrightarrow': '⇔',
    '\\leftrightarrow': '↔',
    '\\mapsto': '↦',
    '\\to': '→',
    '\\gets': '←',
    '\\uparrow': '↑',
    '\\downarrow': '↓',
    '\\Uparrow': '⇑',
    '\\Downarrow': '⇓',
    '\\nearrow': '↗',
    '\\searrow': '↘',
    '\\wedge': '∧',
    '\\vee': '∨',
    '\\neg': '¬',
    '\\top': '⊤',
    '\\bot': '⊥',
    '\\bar{}': 'x̄',
    '\\tilde{}': 'x̃',
    '\\dot{}': 'ẋ',
    '\\ddot{}': 'ẍ',
    '\\widehat{}': 'ABĈ',
    '\\widetilde{}': 'ABC̃',
    '\\overbrace{}^{}': '⏞',
    '\\underbrace{}_{}': '⏟',
    '\\overset{}{}': '↑',
    '\\underset{}{}': '↓',
    '\\boxed{}': '□',
    '\\cancel{}': '✕',
    '\\bcancel{}': '✕'
  };
  return previews[latex] || latex.replace(/\\/g, '').replace(/{}/g, '').replace(/\begin{.*?}/g, '').replace(/\end{.*?}/g, '').substring(0, 3);
}
