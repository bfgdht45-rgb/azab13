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

    // Clean up the equation for KaTeX
    const cleanEq = equation
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\\{/g, '{')
      .replace(/\\\}/g, '}')
      .replace(/\\frac\{/g, '\\frac{')
      .replace(/\\int/g, '\\int')
      .replace(/\\sum/g, '\\sum')
      .replace(/\\sqrt/g, '\\sqrt')
      .replace(/\\pi/g, '\\pi')
      .replace(/\\infty/g, '\\infty')
      .replace(/\\to/g, '\\to')
      .replace(/\\cdot/g, '\\cdot')
      .replace(/\\pm/g, '\\pm')
      .replace(/\\neq/g, '\\neq')
      .replace(/\\leq/g, '\\leq')
      .replace(/\\geq/g, '\\geq')
      .replace(/\\alpha/g, '\\alpha')
      .replace(/\\beta/g, '\\beta')
      .replace(/\\gamma/g, '\\gamma')
      .replace(/\\delta/g, '\\delta')
      .replace(/\\theta/g, '\\theta')
      .replace(/\\lambda/g, '\\lambda')
      .replace(/\\mu/g, '\\mu')
      .replace(/\\sigma/g, '\\sigma')
      .replace(/\\omega/g, '\\omega')
      .replace(/\\Delta/g, '\\Delta')
      .replace(/\\Sigma/g, '\\Sigma')
      .replace(/\\Omega/g, '\\Omega')
      .replace(/\\vec\{/g, '\\vec{')
      .replace(/\\hat\{/g, '\\hat{')
      .replace(/\\bar\{/g, '\\bar{')
      .replace(/\\dot\{/g, '\\dot{')
      .replace(/\\ddot\{/g, '\\ddot{')
      .replace(/\\nabla/g, '\\nabla')
      .replace(/\\partial/g, '\\partial')
      .replace(/\\times/g, '\\times')
      .replace(/\\div/g, '\\div')
      .replace(/\\sin/g, '\\sin')
      .replace(/\\cos/g, '\\cos')
      .replace(/\\tan/g, '\\tan')
      .replace(/\\log/g, '\\log')
      .replace(/\\ln/g, '\\ln')
      .replace(/\\exp/g, '\\exp')
      .replace(/\\lim/g, '\\lim')
      .replace(/\\det/g, '\\det')
      .replace(/\\begin\{pmatrix\}/g, '\\begin{pmatrix}')
      .replace(/\\end\{pmatrix\}/g, '\\end{pmatrix}')
      .replace(/\\begin\{bmatrix\}/g, '\\begin{bmatrix}')
      .replace(/\\end\{bmatrix\}/g, '\\end{bmatrix}')
      .replace(/\\begin\{vmatrix\}/g, '\\begin{vmatrix}')
      .replace(/\\end\{vmatrix\}/g, '\\end{vmatrix}')
      .replace(/\\\\/g, '\\')
      .trim();

    try {
      return <BlockMath math={cleanEq} />;
    } catch {
      // Fallback: display as plain text if KaTeX fails
      return <div className="text-lg font-mono text-gray-700 py-2">{equation}</div>;
    }
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
                  {/* Explanation */}
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {step.explanation}
                  </p>

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

      {/* Verification */}
      {solution.verification && (
        <div className="math-card bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="text-amber-600" size={20} />
            <h4 className="font-semibold text-amber-800">التحقق من صحة الحل</h4>
          </div>
          <p className="text-amber-700 leading-relaxed">
            {solution.verification}
          </p>
        </div>
      )}
    </div>
  );
}
