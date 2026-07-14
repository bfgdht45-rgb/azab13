import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, Check, AlertTriangle, Info, Server, Cpu, Zap } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModelConfig {
  id: string;
  name: string;
  nameAr: string;
  provider: string;
  baseUrl: string;
  description: string;
  color: string;
  badge?: string;
}

interface NewProviderConfig {
  id: string;
  name: string;
  nameAr: string;
  keyStorage: string;
  modelStorage: string;
  baseUrl: string;
  color: string;
  badge?: string;
}

const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'deepseek-ai/DeepSeek-V4-Pro',
    name: 'DeepSeek V4 Pro',
    nameAr: 'ديب سيك V4 برو',
    provider: 'baseten',
    baseUrl: 'https://inference.baseten.co/v1',
    description: 'أقوى موديل للرياضيات والبرمجة',
    color: 'bg-gradient-to-br from-orange-500 to-red-600',
    badge: 'جديد',
  },
  {
    id: 'moonshotai/Kimi-K2.6',
    name: 'Kimi K2.6',
    nameAr: 'كيمي K2.6',
    provider: 'baseten',
    baseUrl: 'https://inference.baseten.co/v1',
    description: 'دقة عالية في الرياضيات والمنطق',
    color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
  },
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT-OSS 120B',
    nameAr: 'جي بي تي 120B',
    provider: 'baseten',
    baseUrl: 'https://inference.baseten.co/v1',
    description: 'نموذج ضخم للرياضيات المعقدة',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
  },
  {
    id: 'zai-org/GLM-5',
    name: 'GLM-5',
    nameAr: 'جي إل إم 5',
    provider: 'baseten',
    baseUrl: 'https://inference.baseten.co/v1',
    description: 'نموذج عام متوازن',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    nameAr: 'جيميني 2.5 فلاش',
    provider: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com',
    description: 'سريع ومجاني تقريباً',
    color: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    badge: 'مجاني',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    nameAr: 'جي بي تي 4o',
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    description: 'مباشر من OpenAI',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
  },
];

const NEW_PROVIDERS: NewProviderConfig[] = [
  {
    id: 'groq',
    name: 'Groq',
    nameAr: 'جروك',
    keyStorage: 'mathsolver_groq_key',
    modelStorage: 'mathsolver_groq_model',
    baseUrl: 'https://api.groq.com/openai/v1',
    color: 'bg-gradient-to-br from-red-500 to-pink-600',
    badge: 'سريع',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    nameAr: 'إنفيديا',
    keyStorage: 'mathsolver_nvidia_key',
    modelStorage: 'mathsolver_nvidia_model',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    color: 'bg-gradient-to-br from-green-500 to-lime-600',
    badge: 'جديد',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    nameAr: 'ميسترال AI',
    keyStorage: 'mathsolver_mistral_key',
    modelStorage: 'mathsolver_mistral_model',
    baseUrl: 'https://api.mistral.ai/v1',
    color: 'bg-gradient-to-br from-orange-400 to-amber-500',
    badge: 'جديد',
  },
];

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('deepseek-ai/DeepSeek-V4-Pro');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeConfig, setActiveConfig] = useState<{model: string; hasKey: boolean}>({model: '', hasKey: false});

  // New provider keys
  const [groqKey, setGroqKey] = useState('');
  const [nvidiaKey, setNvidiaKey] = useState('');
  const [mistralKey, setMistralKey] = useState('');
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showNvidiaKey, setShowNvidiaKey] = useState(false);
  const [showMistralKey, setShowMistralKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('mathsolver_api_key') || '';
    const savedModel = localStorage.getItem('mathsolver_model') || 'deepseek-ai/DeepSeek-V4-Pro';
    const savedCustomUrl = localStorage.getItem('mathsolver_custom_url') || '';
    const savedUseCustom = localStorage.getItem('mathsolver_use_custom') === 'true';

    setApiKey(savedKey);
    setSelectedModel(savedModel);
    setCustomBaseUrl(savedCustomUrl);
    setUseCustomUrl(savedUseCustom);

    setGroqKey(localStorage.getItem('mathsolver_groq_key') || '');
    setNvidiaKey(localStorage.getItem('mathsolver_nvidia_key') || '');
    setMistralKey(localStorage.getItem('mathsolver_mistral_key') || '');

    const info = getActiveConfig();
    setActiveConfig(info);
  }, []);

  const getActiveConfig = () => {
    const savedKey = localStorage.getItem('mathsolver_api_key') || '';
    const savedModel = localStorage.getItem('mathsolver_model') || '';
    const hasGroq = !!(localStorage.getItem('mathsolver_groq_key') || '').trim();
    const hasNvidia = !!(localStorage.getItem('mathsolver_nvidia_key') || '').trim();
    const hasMistral = !!(localStorage.getItem('mathsolver_mistral_key') || '').trim();
    return { 
      model: savedModel, 
      hasKey: !!savedKey.trim() || hasGroq || hasNvidia || hasMistral 
    };
  };

  const handleSave = () => {
    localStorage.setItem('mathsolver_api_key', apiKey);
    localStorage.setItem('mathsolver_model', selectedModel);
    localStorage.setItem('mathsolver_custom_url', customBaseUrl);
    localStorage.setItem('mathsolver_use_custom', useCustomUrl.toString());

    localStorage.setItem('mathsolver_groq_key', groqKey);
    localStorage.setItem('mathsolver_nvidia_key', nvidiaKey);
    localStorage.setItem('mathsolver_mistral_key', mistralKey);

    const model = AVAILABLE_MODELS.find(m => m.id === selectedModel);
    if (model) {
      localStorage.setItem('mathsolver_provider', model.provider);
      localStorage.setItem('mathsolver_base_url', useCustomUrl && customBaseUrl ? customBaseUrl : model.baseUrl);
    }

    if (groqKey.trim() && !nvidiaKey.trim() && !mistralKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'groq');
    } else if (nvidiaKey.trim() && !groqKey.trim() && !mistralKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'nvidia');
    } else if (mistralKey.trim() && !groqKey.trim() && !nvidiaKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'mistral');
    }

    setActiveConfig({ 
      model: selectedModel, 
      hasKey: !!apiKey.trim() || !!groqKey.trim() || !!nvidiaKey.trim() || !!mistralKey.trim() 
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const selectedModelConfig = AVAILABLE_MODELS.find(m => m.id === selectedModel);

  const getProviderLabel = (provider: string) => {
    switch(provider) {
      case 'baseten': return 'Baseten Inference';
      case 'openai': return 'OpenAI';
      case 'gemini': return 'Google AI Studio';
      case 'groq': return 'Groq';
      case 'nvidia': return 'NVIDIA';
      case 'mistral': return 'Mistral AI';
      default: return provider;
    }
  };

  const getProviderLink = (provider: string) => {
    switch(provider) {
      case 'baseten': return 'https://www.baseten.co/';
      case 'openai': return 'https://platform.openai.com/api-keys';
      case 'gemini': return 'https://aistudio.google.com/app/apikey';
      case 'groq': return 'https://console.groq.com/keys';
      case 'nvidia': return 'https://build.nvidia.com/explore/discover';
      case 'mistral': return 'https://console.mistral.ai/api-keys/';
      default: return '#';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Server className="text-primary-600" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">إعدادات الذكاء الاصطناعي</h2>
              <p className="text-sm text-gray-500">اختر الموديل وأدخل مفتاح API</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {activeConfig.hasKey ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <Check className="text-green-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-green-800">✅ API جاهز للاستخدام</p>
                <p className="text-sm text-green-600">
                  الموديل النشط: {AVAILABLE_MODELS.find(m => m.id === activeConfig.model)?.nameAr || activeConfig.model}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-amber-800">⚠️ لم يتم إعداد API</p>
                <p className="text-sm text-amber-600">اختر موديل وأدخل مفتاح API للحل الفعلي</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Cpu size={18} />
              اختر الموديل
            </h3>
            <div className="grid gap-3">
              {AVAILABLE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setUseCustomUrl(false);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-right ${
                    selectedModel === model.id && !useCustomUrl
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl ${model.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
                    {model.provider === 'baseten' ? 'B' : model.provider === 'openai' ? 'O' : 'G'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{model.nameAr}</span>
                      {model.badge && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{model.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{model.description}</div>
                  </div>
                  {selectedModel === model.id && !useCustomUrl && (
                    <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomUrl}
                onChange={(e) => setUseCustomUrl(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="font-medium text-gray-700">استخدام رابط مخصص (Custom Base URL)</span>
            </label>

            {useCustomUrl && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="https://inference.baseten.co/v1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all font-mono text-sm"
                  dir="ltr"
                />
                <p className="text-xs text-gray-500">للاستخدام مع أي مزود OpenAI-compatible</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key size={18} className="text-gray-600" />
              <h3 className="font-bold text-gray-800">مفتاح API</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {getProviderLabel(selectedModelConfig?.provider || 'baseten')}
              </span>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  selectedModelConfig?.provider === 'baseten' ? 'baseten-api-key-xxx' : 
                  selectedModelConfig?.provider === 'openai' ? 'sk-xxxxxxxxxxxxxxxx' : 
                  'AIzaSyxxxxxxxxxxxxxxxx'
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all font-mono text-sm"
                dir="ltr"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {selectedModelConfig && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
                <p><strong>المزود:</strong> {getProviderLabel(selectedModelConfig.provider)}</p>
                <p><strong>الرابط:</strong> <code className="bg-gray-200 px-1 rounded">{useCustomUrl && customBaseUrl ? customBaseUrl : selectedModelConfig.baseUrl}</code></p>
                <p><strong>الموديل:</strong> <code className="bg-gray-200 px-1 rounded">{selectedModelConfig.id}</code></p>
              </div>
            )}

            <p className="text-xs text-gray-500">
              احصل على المفتاح من:{" "}
              <a 
                href={getProviderLink(selectedModelConfig?.provider || 'baseten')} 
                target="_blank" 
                className="text-primary-600 hover:underline font-medium" 
                rel="noreferrer"
              >
                {getProviderLink(selectedModelConfig?.provider || 'baseten').replace('https://', '')}
              </a>
            </p>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Zap size={18} />
              مزودين إضافيين
            </h3>

            {NEW_PROVIDERS.map((provider) => {
              const keyValue = 
                provider.id === 'groq' ? groqKey : 
                provider.id === 'nvidia' ? nvidiaKey : 
                mistralKey;
              const setKeyValue = 
                provider.id === 'groq' ? setGroqKey : 
                provider.id === 'nvidia' ? setNvidiaKey : 
                setMistralKey;
              const showKeyValue = 
                provider.id === 'groq' ? showGroqKey : 
                provider.id === 'nvidia' ? showNvidiaKey : 
                showMistralKey;
              const setShowKeyValue = 
                provider.id === 'groq' ? setShowGroqKey : 
                provider.id === 'nvidia' ? setShowNvidiaKey : 
                setShowMistralKey;
              const hasKey = !!keyValue.trim();

              return (
                <div key={provider.id} className={`p-4 rounded-xl border-2 transition-all ${hasKey ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${provider.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {provider.id === 'groq' ? 'Gq' : provider.id === 'nvidia' ? 'Nv' : 'Ms'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{provider.nameAr}</span>
                        {provider.badge && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            {provider.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{provider.name}</div>
                    </div>
                    {hasKey ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        ✅ جاهز
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                        ❌ أضف المفتاح
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type={showKeyValue ? 'text' : 'password'}
                      value={keyValue}
                      onChange={(e) => setKeyValue(e.target.value)}
                      placeholder={`مفتاح ${provider.nameAr}...`}
                      className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all font-mono text-sm"
                      dir="ltr"
                    />
                    <button
                      onClick={() => setShowKeyValue(!showKeyValue)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      {showKeyValue ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    احصل على المفتاح من:{" "}
                    <a 
                      href={getProviderLink(provider.id)} 
                      target="_blank" 
                      className="text-primary-600 hover:underline font-medium" 
                      rel="noreferrer"
                    >
                      {getProviderLink(provider.id).replace('https://', '')}
                    </a>
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">🔒 الخصوصية والأمان</p>
              <p>المفاتيح تُحفظ في متصفحك فقط (LocalStorage) ولا تُرفع على أي خادم. يتم إرسالها مباشرة للـ API من Backend.</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 math-btn-primary py-3 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check size={18} />
                <span>تم الحفظ!</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>حفظ الإعدادات</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="math-btn-secondary py-3 px-6"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
