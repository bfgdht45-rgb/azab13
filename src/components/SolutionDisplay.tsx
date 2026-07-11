import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import type { MathSolution } from '../types';
import { CheckCircle, AlertCircle, Lightbulb, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface SolutionDisplayProps {
  solution: MathSolution;
}

export function SolutionDisplay({ solution }: SolutionDisplayProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set(
    solution.steps.map(s => s.stepNumber)
  ));

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNumber)) next.delete(stepNumber);
      else next.add(stepNumber);
      return next;
    });
  };

  const expandAll = () => setExpandedSteps(new Set(solution.steps.map(s => s.stepNumber)));
  const collapseAll = () => setExpandedSteps(new Set());

  // Helper to render equation with KaTeX
  const renderEquation = (equation: string) => {
    if (!equation || equation.trim() === '') return null;

    const cleanEq = equation
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\\{/g, '{')
      .replace(/\\\}/g, '}')
      .trim();

    try {
      return <BlockMath math={cleanEq} />;
    } catch {
      return <div className="text-lg font-mono text-gray-700 py-2">{equation}</div>;
    }
  };

  // ✅ دالة جديدة: تحويل نص فيه LaTeX لـ React elements
  const renderMixedText = (text: string) => {
    if (!text) return null;

    // نمط: $$...$$ (display math)
    // نمط: $...$ (inline math)
    // نمط: \(...\) (inline math)
    // نمط: \[...\] (display math)
    const parts: React.ReactNode[] = [];
    let remaining = text;

    // Regex للمعادلات
    const patterns = [
      { regex: /\$\$([\s\S]*?)\$\$/g, type: 'block' as const },
      { regex: /\$([^\$]+?)\$/g, type: 'inline' as const },
      { regex: /\\\[([\s\S]*?)\\\]/g, type: 'block' as const },
      { regex: /\\\(([\s\S]*?)\\\)/g, type: 'inline' as const },
    ];

    let hasMatch = false;
    let key = 0;

    while (remaining.length > 0) {
      let earliestMatch: { index: number; end: number; text: string; type: 'inline' | 'block' } | null = null;

      for (const pattern of patterns) {
        pattern.regex.lastIndex = 0;
        const match = pattern.regex.exec(remaining);
        if (match && (earliestMatch === null || match.index < earliestMatch.index)) {
          earliestMatch = {
            index: match.index,
            end: match.index + match[0].length,
            text: match[1].trim(),
            type: pattern.type,
          };
        }
      }

      if (earliestMatch) {
        // النص قبل المعادلة
        if (earliestMatch.index > 0) {
          const beforeText = remaining.substring(0, earliestMatch.index).trim();
          if (beforeText) {
            parts.push(<span key={`text-${key++}`}>{beforeText}</span>);
          }
        }

        // المعادلة
        const cleanLatex = earliestMatch.text
          .replace(/\\text\{([^}]+)\}/g, '$1')
          .trim();

        try {
          if (earliestMatch.type === 'block') {
            parts.push(
              <div key={`block-${key++}`} className="my-3 bg-white rounded-lg p-3" dir="ltr">
                <BlockMath math={cleanLatex} />
              </div>
            );
          } else {
            parts.push(
              <span key={`inline-${key++}`} className="mx-1" dir="ltr">
                <InlineMath math={cleanLatex} />
              </span>
            );
          }
        } catch {
          parts.push(<code key={`err-${key++}`} className="text-red-500">{earliestMatch.text}</code>);
        }

        remaining = remaining.substring(earliestMatch.end);
        hasMatch = true;
      } else {
        // مفيش معادلات تانية
        if (remaining.trim()) {
          parts.push(<span key={`text-${key++}`}>{remaining}</span>);
        }
        break;
      }
    }

    return <>{parts}</>;
  };

  return (
    <div className="w-full space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-primary-600" size={28} />
          حل المسألة
        </h2>
        <div className="flex gap-2">
          <button onClick={expandAll} className="math-btn-secondary text-sm">
            توسيع الكل
          </button>
          <button onClick={collapseAll} className="math-btn-secondary text-sm">
            طي الكل
          </button>
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence>
        {solution.steps.map((step, index) => (
          <motion.div
            key={step.stepNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="step-card"
          >
            {/* Step Header */}
            <button
              onClick={() => toggleStep(step.stepNumber)}
              className="w-full flex items-center gap-3 text-right"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step.isImportant ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'
              }`}>
                {step.stepNumber}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {step.rule ? `باستخدام ${step.rule}` : `الخطوة ${step.stepNumber}`}
                </h3>
              </div>
              {step.isImportant && <Lightbulb size={18} className="text-amber-500" />}
              {expandedSteps.has(step.stepNumber) ? 
                <ChevronUp size={18} className="text-gray-400" /> : 
                <ChevronDown size={18} className="text-gray-400" />
              }
            </button>

            {/* Step Content */}
            <AnimatePresence>
              {expandedSteps.has(step.stepNumber) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pr-11 space-y-3 overflow-hidden"
                >
                  {/* Explanation - نستخدم renderMixedText لو فيه LaTeX */}
                  <div className="text-gray-700 leading-relaxed text-lg">
                    {renderMixedText(step.explanation)}
                  </div>

                  {/* Equation with KaTeX */}
                  {step.equation && (
                    <div className="bg-gray-50 rounded-xl p-4 my-3" dir="ltr">
                      {renderEquation(step.equation)}
                    </div>
                  )}

                  {/* Rule badge */}
                  {step.rule && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      <BookOpen size={14} />
                      {step.rule}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Final Answer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="math-card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
      >
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="text-green-600" size={24} />
          <h3 className="text-xl font-bold text-green-800">الإجابة النهائية</h3>
        </div>
        <div className="bg-white rounded-xl p-6 text-center" dir="ltr">
          {renderEquation(solution.finalAnswer)}
        </div>
      </motion.div>

      {/* Verification - ✅ المصلح */}
      {solution.verification && (
        <div className="math-card bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-amber-600" size={20} />
            <h4 className="font-semibold text-amber-800">التحقق من صحة الحل</h4>
          </div>
          <div className="text-amber-700 leading-relaxed">
            {renderMixedText(solution.verification)}
          </div>
        </div>
      )}
    </div>
  );
}
