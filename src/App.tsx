import { useState, useCallback, useEffect } from 'react';
import { MathEditor } from './components/MathEditor';
import { ImageUploader } from './components/ImageUploader';
import { SolutionDisplay } from './components/SolutionDisplay';
import { SubjectSelector } from './components/SubjectSelector';
import { DetailLevelSelector } from './components/DetailLevelSelector';
import { SettingsPanel } from './components/SettingsPanel';
import { useMathSolver } from './hooks/useMathSolver';
import { mathSolverAPI } from './services/api';
import type { MathSubject, InputMode } from './types';
import { SUBJECTS, DETAIL_LEVELS } from './utils/constants';
import { Calculator, Type, Image as ImageIcon, Settings, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';

function MainPage() {
  const [inputMode, setInputMode] = useState<InputMode>('editor');
  const [latexInput, setLatexInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<MathSubject>('general');
  const [detailLevel, setDetailLevel] = useState<'brief' | 'detailed' | 'step-by-step'>('step-by-step');
  const [showSettings, setShowSettings] = useState(false);
  const [apiStatus, setApiStatus] = useState({ checked: false, hasKeys: false, model: '' as string, provider: '' as string });
  const { solution, isLoading, error, solve, clear } = useMathSolver();

  useEffect(() => {
    const check = () => {
      const info = mathSolverAPI.getProviderInfo();
      setApiStatus({ checked: true, hasKeys: info.hasKeys, model: info.model, provider: info.provider });
    };
    check();
    const interval = setInterval(check, 2000);
    return () => clearInterval(interval);
  }, [showSettings]);

  const handleSolve = useCallback(async () => {
    const problem = inputMode === 'editor' ? latexInput : textInput;
    if (!problem.trim()) return;
    await solve({
      problem,
      subject: selectedSubject,
      language: 'ar',
      includeGraph: true,
      detailLevel,
    });
  }, [inputMode, latexInput, textInput, selectedSubject, detailLevel, solve]);

  const handleOCRComplete = useCallback((latex: string) => {
    setLatexInput(latex);
    setInputMode('editor');
  }, []);

  const inputModes: { id: InputMode; label: string; icon: typeof Calculator }[] = [
    { id: 'editor', label: 'محرر المعادلات', icon: Calculator },
    { id: 'text', label: 'نص عادي', icon: Type },
    { id: 'image', label: 'رفع صورة', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">حاسب الرياضيات</h1>
              <p className="text-sm text-gray-500">حل المسائل بالذكاء الاصطناعي</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {apiStatus.checked && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                apiStatus.hasKeys 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {apiStatus.hasKeys ? (
                  <>
                    <span>●</span>
                    <span>{apiStatus.model} جاهز</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} />
                    <span>لا يوجد API</span>
                  </>
                )}
              </div>
            )}
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600"
            >
              <Settings size={20} />
              <span className="text-sm font-medium hidden sm:inline">الإعدادات</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!apiStatus.hasKeys && apiStatus.checked && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-amber-800">⚠️ لم يتم إعداد API</p>
                  <p className="text-sm text-amber-700 mt-1">
                    اختر موديل (DeepSeek V4, Kimi K2.6, GPT-OSS, GLM-5, Gemini Flash) وأضف مفتاح API في الإعدادات (⚙️) لحل المسائل الفعلي.
                  </p>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="mt-2 text-sm font-medium text-amber-800 underline hover:no-underline"
                  >
                    فتح الإعدادات ←
                  </button>
                </div>
              </div>
            )}

            <div className="math-card">
              <div className="flex gap-2 mb-6">
                {inputModes.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setInputMode(id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                      inputMode === id
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                {inputMode === 'editor' && (
                  <MathEditor value={latexInput} onChange={setLatexInput} />
                )}
                {inputMode === 'text' && (
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="اكتب المسألة النصية هنا... مثال: احسب مشتقة x^3 + 2x^2 - 5x + 1"
                    className="math-input min-h-[200px] resize-y"
                    dir="rtl"
                  />
                )}
                {inputMode === 'image' && (
                  <ImageUploader onOCRComplete={handleOCRComplete} />
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSolve}
                disabled={isLoading}
                className="w-full mt-6 math-btn-primary py-4 text-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري حل المسألة...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    <span>حل المسألة</span>
                  </>
                )}
              </button>
            </div>

            {solution && (
              <div className="animate-fade-in">
                <SolutionDisplay solution={solution} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <SubjectSelector subjects={SUBJECTS} selected={selectedSubject} onSelect={setSelectedSubject} />
            <DetailLevelSelector levels={DETAIL_LEVELS} selected={detailLevel} onSelect={setDetailLevel} />

            <div className="math-card bg-amber-50 border-amber-200">
              <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <Sparkles size={18} />
                نصائح سريعة
              </h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• استخدم المحرر للمسائل الرياضية المعقدة</li>
                <li>• رفع الصورة يدعم الكتابة اليدوية</li>
                <li>• اختر الفرع المناسب لدقة أفضل</li>
                <li>• الحل بالخطوات يوضح كل قاعدة مستخدمة</li>
              </ul>
            </div>

            <div className="math-card bg-blue-50 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <BookOpen size={18} />
                الفروع المدعومة
              </h3>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <span key={s.id} className="px-2 py-1 bg-white rounded-lg text-xs text-blue-700 border border-blue-100">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="math-card">
              <h3 className="font-bold text-gray-800 mb-3">⚙️ إعدادات سريعة</h3>
              <button 
                onClick={() => setShowSettings(true)}
                className="w-full math-btn-secondary py-3 flex items-center justify-center gap-2"
              >
                <Settings size={18} />
                <span>فتح إعدادات API</span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {apiStatus.hasKeys 
                  ? `✅ متصل بـ ${apiStatus.model}` 
                  : '⚠️ اختر موديل وأضف مفتاح API'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>حاسب الرياضيات © 2026 - يدعم DeepSeek V4, Kimi K2.6, GPT-OSS, GLM-5, Gemini Flash, Cerebras</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return <MainPage />;
}
