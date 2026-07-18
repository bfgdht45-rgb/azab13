import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, Check, AlertTriangle, Info, Server, Cpu, Zap, Globe, Shield, Link } from 'lucide-react';

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
  proxyStorage: string;
  baseUrl: string;
  color: string;
  badge?: string;
  needsProxy?: boolean;
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
    id: 'cerebras',
    name: 'Cerebras',
    nameAr: 'سيريبراس',
    keyStorage: 'mathsolver_cerebras_key',
    modelStorage: 'mathsolver_cerebras_model',
    proxyStorage: 'mathsolver_cerebras_proxy',
    baseUrl: 'https://api.cerebras.ai/v1',
    color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    badge: 'مجاني',
  },
  {
    id: 'cometapi',
    name: 'CometAPI',
    nameAr: 'كوميت API',
    keyStorage: 'mathsolver_cometapi_key',
    modelStorage: 'mathsolver_cometapi_model',
    proxyStorage: 'mathsolver_cometapi_proxy',
    baseUrl: 'https://api.cometapi.com/v1',
    color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    badge: 'جديد',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    nameAr: 'ميسترال AI',
    keyStorage: 'mathsolver_mistral_key',
    modelStorage: 'mathsolver_mistral_model',
    proxyStorage: 'mathsolver_mistral_proxy',
    baseUrl: 'https://api.mistral.ai/v1',
    color: 'bg-gradient-to-br from-orange-400 to-amber-500',
    badge: 'جديد',
  },
  {
    id: 'cohere',
    name: 'Cohere',
    nameAr: 'كوهير',
    keyStorage: 'mathsolver_cohere_key',
    modelStorage: 'mathsolver_cohere_model',
    proxyStorage: 'mathsolver_cohere_proxy',
    baseUrl: 'https://api.cohere.ai/compatibility/v1',
    color: 'bg-gradient-to-br from-purple-600 to-pink-600',
    badge: 'جديد',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    nameAr: 'أوبن راوتر',
    keyStorage: 'mathsolver_openrouter_key',
    modelStorage: 'mathsolver_openrouter_model',
    proxyStorage: 'mathsolver_openrouter_proxy',
    baseUrl: 'https://openrouter.ai/api/v1',
    color: 'bg-gradient-to-br from-slate-500 to-gray-700',
    badge: 'مجاني',
  },
  {
    id: 'groq',
    name: 'Groq',
    nameAr: 'جروك',
    keyStorage: 'mathsolver_groq_key',
    modelStorage: 'mathsolver_groq_model',
    proxyStorage: 'mathsolver_groq_proxy',
    baseUrl: 'https://api.groq.com/openai/v1',
    color: 'bg-gradient-to-br from-red-500 to-pink-600',
    badge: 'سريع ⚡',
    needsProxy: true,
  },
  {
    id: 'tokengo',
    name: 'TokenGo',
    nameAr: 'توكين جو',
    keyStorage: 'mathsolver_tokengo_key',
    modelStorage: 'mathsolver_tokengo_model',
    proxyStorage: 'mathsolver_tokengo_proxy',
    baseUrl: 'https://api.tokengo.com/v1',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    badge: 'جديد',
    needsProxy: true,
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

  // New provider keys & proxies
  const [cerebrasKey, setCerebrasKey] = useState('');
  const [cerebrasProxy, setCerebrasProxy] = useState('');
  const [cometapiKey, setCometapiKey] = useState('');
  const [cometapiProxy, setCometapiProxy] = useState('');
  const [mistralKey, setMistralKey] = useState('');
  const [mistralProxy, setMistralProxy] = useState('');
  const [cohereKey, setCohereKey] = useState('');
  const [cohereProxy, setCohereProxy] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [openrouterProxy, setOpenrouterProxy] = useState('');
  const [showCerebrasKey, setShowCerebrasKey] = useState(false);
  const [showCometapiKey, setShowCometapiKey] = useState(false);
  const [showMistralKey, setShowMistralKey] = useState(false);
  const [showCohereKey, setShowCohereKey] = useState(false);
  const [showOpenrouterKey, setShowOpenrouterKey] = useState(false);

  // Groq key, model & proxy states
  const [groqKey, setGroqKey] = useState('');
  const [groqModel, setGroqModel] = useState('');
  const [groqProxy, setGroqProxy] = useState('');
  const [showGroqKey, setShowGroqKey] = useState(false);

  // OpenRouter model state
  const [openrouterModel, setOpenrouterModel] = useState('');

  // TokenGo key, model & proxy states
  const [tokengoKey, setTokengoKey] = useState('');
  const [tokengoModel, setTokengoModel] = useState('');
  const [tokengoProxy, setTokengoProxy] = useState('');
  const [showTokengoKey, setShowTokengoKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('mathsolver_api_key') || '';
    const savedModel = localStorage.getItem('mathsolver_model') || 'deepseek-ai/DeepSeek-V4-Pro';
    const savedCustomUrl = localStorage.getItem('mathsolver_custom_url') || '';
    const savedUseCustom = localStorage.getItem('mathsolver_use_custom') === 'true';

    setApiKey(savedKey);
    setSelectedModel(savedModel);
    setCustomBaseUrl(savedCustomUrl);
    setUseCustomUrl(savedUseCustom);

    setCerebrasKey(localStorage.getItem('mathsolver_cerebras_key') || '');
    setCerebrasProxy(localStorage.getItem('mathsolver_cerebras_proxy') || '');
    setCometapiKey(localStorage.getItem('mathsolver_cometapi_key') || '');
    setCometapiProxy(localStorage.getItem('mathsolver_cometapi_proxy') || '');
    setMistralKey(localStorage.getItem('mathsolver_mistral_key') || '');
    setMistralProxy(localStorage.getItem('mathsolver_mistral_proxy') || '');
    setCohereKey(localStorage.getItem('mathsolver_cohere_key') || '');
    setCohereProxy(localStorage.getItem('mathsolver_cohere_proxy') || '');
    setOpenrouterKey(localStorage.getItem('mathsolver_openrouter_key') || '');
    setOpenrouterProxy(localStorage.getItem('mathsolver_openrouter_proxy') || '');

    setGroqKey(localStorage.getItem('mathsolver_groq_key') || '');
    setGroqModel(localStorage.getItem('mathsolver_groq_model') || '');
    setGroqProxy(localStorage.getItem('mathsolver_groq_proxy') || '');

    setOpenrouterModel(localStorage.getItem('mathsolver_openrouter_model') || '');

    setTokengoKey(localStorage.getItem('mathsolver_tokengo_key') || '');
    setTokengoModel(localStorage.getItem('mathsolver_tokengo_model') || '');
    setTokengoProxy(localStorage.getItem('mathsolver_tokengo_proxy') || '');

    const info = getActiveConfig();
    setActiveConfig(info);
  }, []);

  const getActiveConfig = () => {
    const savedKey = localStorage.getItem('mathsolver_api_key') || '';
    const savedModel = localStorage.getItem('mathsolver_model') || '';
    const hasCerebras = !!(localStorage.getItem('mathsolver_cerebras_key') || '').trim();
    const hasCometapi = !!(localStorage.getItem('mathsolver_cometapi_key') || '').trim();
    const hasMistral = !!(localStorage.getItem('mathsolver_mistral_key') || '').trim();
    const hasCohere = !!(localStorage.getItem('mathsolver_cohere_key') || '').trim();
    const hasOpenrouter = !!(localStorage.getItem('mathsolver_openrouter_key') || '').trim();
    const hasGroq = !!(localStorage.getItem('mathsolver_groq_key') || '').trim();
    const hasTokengo = !!(localStorage.getItem('mathsolver_tokengo_key') || '').trim();
    return { 
      model: savedModel, 
      hasKey: !!savedKey.trim() || hasCerebras || hasCometapi || hasMistral || hasCohere || hasOpenrouter || hasGroq || hasTokengo
    };
  };

  const handleSave = () => {
    localStorage.setItem('mathsolver_api_key', apiKey);
    localStorage.setItem('mathsolver_model', selectedModel);
    localStorage.setItem('mathsolver_custom_url', customBaseUrl);
    localStorage.setItem('mathsolver_use_custom', useCustomUrl.toString());

    localStorage.setItem('mathsolver_cerebras_key', cerebrasKey);
    localStorage.setItem('mathsolver_cerebras_proxy', cerebrasProxy);
    localStorage.setItem('mathsolver_cometapi_key', cometapiKey);
    localStorage.setItem('mathsolver_cometapi_proxy', cometapiProxy);
    localStorage.setItem('mathsolver_mistral_key', mistralKey);
    localStorage.setItem('mathsolver_mistral_proxy', mistralProxy);
    localStorage.setItem('mathsolver_cohere_key', cohereKey);
    localStorage.setItem('mathsolver_cohere_proxy', cohereProxy);
    localStorage.setItem('mathsolver_openrouter_key', openrouterKey);
    localStorage.setItem('mathsolver_openrouter_proxy', openrouterProxy);

    localStorage.setItem('mathsolver_groq_key', groqKey);
    localStorage.setItem('mathsolver_groq_model', groqModel);
    localStorage.setItem('mathsolver_groq_proxy', groqProxy);

    localStorage.setItem('mathsolver_openrouter_model', openrouterModel);

    localStorage.setItem('mathsolver_tokengo_key', tokengoKey);
    localStorage.setItem('mathsolver_tokengo_model', tokengoModel);
    localStorage.setItem('mathsolver_tokengo_proxy', tokengoProxy);

    const model = AVAILABLE_MODELS.find(m => m.id === selectedModel);
    if (model) {
      localStorage.setItem('mathsolver_provider', model.provider);
      localStorage.setItem('mathsolver_base_url', useCustomUrl && customBaseUrl ? customBaseUrl : model.baseUrl);
    }

    // Priority: first non-empty key sets the provider
    if (cerebrasKey.trim() && !cometapiKey.trim() && !mistralKey.trim() && !cohereKey.trim() && !groqKey.trim() && !tokengoKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'cerebras');
    } else if (cometapiKey.trim() && !cerebrasKey.trim() && !mistralKey.trim() && !cohereKey.trim() && !groqKey.trim() && !tokengoKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'cometapi');
    } else if (mistralKey.trim() && !cerebrasKey.trim() && !cometapiKey.trim() && !cohereKey.trim() && !groqKey.trim() && !tokengoKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'mistral');
    } else if (cohereKey.trim() && !cerebrasKey.trim() && !cometapiKey.trim() && !mistralKey.trim() && !openrouterKey.trim() && !groqKey.trim() && !tokengoKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'cohere');
    } else if (openrouterKey.trim() && !cerebrasKey.trim() && !cometapiKey.trim() && !mistralKey.trim() && !cohereKey.trim() && !groqKey.trim() && !tokengoKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'openrouter');
    } else if (groqKey.trim() && !cerebrasKey.trim() && !cometapiKey.trim() && !mistralKey.trim() && !cohereKey.trim() && !openrouterKey.trim() && !tokengoKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'groq');
    } else if (tokengoKey.trim() && !cerebrasKey.trim() && !cometapiKey.trim() && !mistralKey.trim() && !cohereKey.trim() && !openrouterKey.trim() && !groqKey.trim()) {
      localStorage.setItem('mathsolver_provider', 'tokengo');
    }

    setActiveConfig({ 
      model: selectedModel, 
      hasKey: !!apiKey.trim() || !!cerebrasKey.trim() || !!cometapiKey.trim() || !!mistralKey.trim() || !!cohereKey.trim() || !!openrouterKey.trim() || !!groqKey.trim() || !!tokengoKey.trim()
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
      case 'cerebras': return 'Cerebras';
      case 'cometapi': return 'CometAPI';
      case 'mistral': return 'Mistral AI';
      case 'cohere': return 'Cohere';
      case 'groq': return 'Groq';
      case 'tokengo': return 'TokenGo';
      default: return provider;
    }
  };

  const getProviderLink = (provider: string) => {
    switch(provider) {
      case 'baseten': return 'https://www.baseten.co/';
      case 'openai': return 'https://platform.openai.com/api-keys';
      case 'gemini': return 'https://aistudio.google.com/app/apikey';
      case 'cerebras': return 'https://cloud.cerebras.ai/';
      case 'cometapi': return 'https://cometapi.com/';
      case 'mistral': return 'https://console.mistral.ai/api-keys/';
      case 'cohere': return 'https://dashboard.cohere.com/api-keys';
      case 'groq': return 'https://console.groq.com/keys';
      case 'tokengo': return 'https://azab13.vercel.app/';
      default: return '#';
    }
  };

  const getProviderInitials = (id: string) => {
    switch(id) {
      case 'cerebras': return 'Ce';
      case 'cometapi': return 'Co';
      case 'mistral': return 'Ms';
      case 'cohere': return 'Ch';
      case 'openrouter': return 'OR';
      case 'groq': return 'Gq';
      case 'tokengo': return 'TG';
      default: return id.substring(0, 2).toUpperCase();
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
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Zap size={18} />
              مزود مخصص (Custom Provider)
            </h3>

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
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">رابط الـ API</label>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="https://router.bynara.id/v1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all font-mono text-sm"
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    مثال: <code className="bg-gray-200 px-1 rounded">https://router.bynara.id/v1</code> — لأي مزود OpenAI-compatible
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">اسم الموديل</label>
                  <input
                    type="text"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    placeholder="mistral-medium-3-5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all font-mono text-sm"
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    مثال: <code className="bg-gray-200 px-1 rounded">mistral-medium-3-5</code> أو <code className="bg-gray-200 px-1 rounded">agnes-2.0-flash</code>
                  </p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    💡 <strong>ByNara:</strong> ادخل الرابط <code>https://router.bynara.id/v1</code> والموديل <code>mistral-medium-3-5</code> أو <code>agnes-2.0-flash</code>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key size={18} className="text-gray-600" />
              <h3 className="font-bold text-gray-800">مفتاح API</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {useCustomUrl ? 'Custom' : getProviderLabel(selectedModelConfig?.provider || 'baseten')}
              </span>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  useCustomUrl ? 'sk-xxx... (مفتاح المزود المخصص)' :
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

            {selectedModelConfig && !useCustomUrl && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
                <p><strong>المزود:</strong> {getProviderLabel(selectedModelConfig.provider)}</p>
                <p><strong>الرابط:</strong> <code className="bg-gray-200 px-1 rounded">{selectedModelConfig.baseUrl}</code></p>
                <p><strong>الموديل:</strong> <code className="bg-gray-200 px-1 rounded">{selectedModelConfig.id}</code></p>
              </div>
            )}

            {!useCustomUrl && (
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
            )}
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Zap size={18} />
              مزودين إضافيين
            </h3>

            {NEW_PROVIDERS.map((provider) => {
              const keyValue = 
                provider.id === 'cerebras' ? cerebrasKey : 
                provider.id === 'cometapi' ? cometapiKey :
                provider.id === 'cohere' ? cohereKey :
                provider.id === 'openrouter' ? openrouterKey :
                provider.id === 'groq' ? groqKey :
                provider.id === 'tokengo' ? tokengoKey :
                mistralKey;
              const setKeyValue = 
                provider.id === 'cerebras' ? setCerebrasKey : 
                provider.id === 'cometapi' ? setCometapiKey :
                provider.id === 'cohere' ? setCohereKey :
                provider.id === 'openrouter' ? setOpenrouterKey :
                provider.id === 'groq' ? setGroqKey :
                provider.id === 'tokengo' ? setTokengoKey :
                setMistralKey;
              const showKeyValue = 
                provider.id === 'cerebras' ? showCerebrasKey : 
                provider.id === 'cometapi' ? showCometapiKey :
                provider.id === 'cohere' ? showCohereKey :
                provider.id === 'openrouter' ? showOpenrouterKey :
                provider.id === 'groq' ? showGroqKey :
                provider.id === 'tokengo' ? showTokengoKey :
                showMistralKey;
              const setShowKeyValue = 
                provider.id === 'cerebras' ? setShowCerebrasKey : 
                provider.id === 'cometapi' ? setShowCometapiKey :
                provider.id === 'cohere' ? setShowCohereKey :
                provider.id === 'openrouter' ? setShowOpenrouterKey :
                provider.id === 'groq' ? setShowGroqKey :
                provider.id === 'tokengo' ? setShowTokengoKey :
                setShowMistralKey;
              const hasKey = !!keyValue.trim();

              // Proxy value & setter
              const proxyValue =
                provider.id === 'cerebras' ? cerebrasProxy :
                provider.id === 'cometapi' ? cometapiProxy :
                provider.id === 'cohere' ? cohereProxy :
                provider.id === 'openrouter' ? openrouterProxy :
                provider.id === 'groq' ? groqProxy :
                provider.id === 'tokengo' ? tokengoProxy :
                mistralProxy;
              const setProxyValue =
                provider.id === 'cerebras' ? setCerebrasProxy :
                provider.id === 'cometapi' ? setCometapiProxy :
                provider.id === 'cohere' ? setCohereProxy :
                provider.id === 'openrouter' ? setOpenrouterProxy :
                provider.id === 'groq' ? setGroqProxy :
                provider.id === 'tokengo' ? setTokengoProxy :
                setMistralProxy;

              return (
                <div key={provider.id} className={`p-4 rounded-xl border-2 transition-all ${hasKey ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${provider.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {getProviderInitials(provider.id)}
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

                  {/* ✅ NEW: CORS Proxy field for each provider */}
                  {provider.needsProxy && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Link size={14} className="text-amber-600" />
                        <span className="text-sm font-semibold text-amber-800">CORS Proxy (للكمبيوتر)</span>
                      </div>
                      <input
                        type="text"
                        value={proxyValue}
                        onChange={(e) => setProxyValue(e.target.value)}
                        placeholder={`رابط Proxy لـ ${provider.nameAr}...`}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all font-mono text-sm"
                        dir="ltr"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        مثال: <code className="bg-gray-200 px-1 rounded">https://your-proxy.workers.dev</code>
                      </p>
                    </div>
                  )}

                  {provider.id === 'openrouter' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={openrouterModel}
                        onChange={(e) => setOpenrouterModel(e.target.value)}
                        placeholder="اسم الموديل (مثال: deepseek/deepseek-chat)"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all font-mono text-sm"
                        dir="ltr"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        اتركه فارغاً لاستخدام الموديل الافتراضي
                      </p>
                    </div>
                  )}

                  {provider.id === 'groq' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={groqModel}
                        onChange={(e) => setGroqModel(e.target.value)}
                        placeholder="اسم الموديل (مثال: meta-llama/llama-4-scout-17b-16e-instruct)"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all font-mono text-sm"
                        dir="ltr"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        اتركه فارغاً لاستخدام الموديل الافتراضي (llama-4-scout)
                      </p>
                    </div>
                  )}

                  {provider.id === 'tokengo' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={tokengoModel}
                        onChange={(e) => setTokengoModel(e.target.value)}
                        placeholder="اسم الموديل (مثال: deepseek/deepseek-v4-pro)"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all font-mono text-sm"
                        dir="ltr"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        اتركه فارغاً لاستخدام الموديل الافتراضي (deepseek-v4-pro)
                      </p>
                    </div>
                  )}

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
              <p>المفاتيح تُحفظ في متصفحك فقط (LocalStorage) ولا تُرفع على أي خادم. يتم إرسالها مباشرة للـ API.</p>
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
