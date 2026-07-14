import type { SolverRequest, SolverResponse, OCRResult, ProviderConfig } from '../types';

// =====================================
// ✅ إعدادات المزودين
// =====================================

const CEREBRAS_CONFIG: ProviderConfig = {
  id: 'cerebras',
  name: 'Cerebras',
  nameAr: 'سيريبراس',
  baseUrl: 'https://api.cerebras.ai/v1',
  apiKey: '',
  models: [],
  preferredModels: [
    'gemma-4-31b',
    'gpt-oss-120b',
    'zai-glm-4.7',
    'llama-3.3-70b',
    'llama3.1-8b',
  ],
  color: 'bg-gradient-to-br from-yellow-500 to-orange-600',
  badge: 'مجاني',
};

const MORPHLLM_CONFIG: ProviderConfig = {
  id: 'morphllm',
  name: 'MorphLLM',
  nameAr: 'مورف LLM',
  baseUrl: 'https://api.morphllm.com/v1',
  apiKey: '',
  models: [],
  preferredModels: [
    'morph-v3-fast',
    'morph-v3-large',
    'auto',
    'morph-compactor',
    'morph-warp-grep-v2.1',
    'morph-minimax27-230b',
    'morph-minimax3-428b',
    'morph-glm52-744b',
    'morph-qwen36-27b',
    'morph-dsv4flash',
    'deepseek/deepseek-v4-flash',
    'deepseek/deepseek-v4-flash-20260423',
    'morph-qwen35-397b',
  ],
  color: 'bg-gradient-to-br from-pink-500 to-rose-600',
  badge: 'جديد',
};

const COMETAPI_CONFIG: ProviderConfig = {
  id: 'cometapi',
  name: 'CometAPI',
  nameAr: 'كوميت API',
  baseUrl: 'https://api.cometapi.com/v1',
  apiKey: '',
  models: [],
  preferredModels: [
    'gpt-5.6', 'gpt-5.5-pro', 'gpt-5.5', 'gpt-5.4-pro', 'gpt-5.4',
    'gpt-5.3-chat-latest', 'gpt-5.2-pro', 'gpt-5.2', 'gpt-5.1',
    'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4.1-mini',
    'gpt-4o', 'gpt-4o-mini',
    'o4-mini', 'o3-pro', 'o3', 'o3-mini-high', 'o3-mini',
    'o1-pro', 'o1', 'o1-mini',
    'gemini-3.1-pro-preview', 'gemini-3-pro-preview', 'gemini-3-flash',
    'gemini-3-flash-thinking', 'gemini-2.5-pro', 'gemini-2.5-pro-thinking',
    'gemini-2.5-flash', 'gemini-2.5-flash-lite',
    'claude-sonnet-5', 'claude-sonnet-4-6', 'claude-sonnet-4-5',
    'claude-opus-4-8', 'claude-opus-4-7', 'claude-opus-4-6', 'claude-opus-4-5',
    'deepseek-v4-pro', 'deepseek-v4-flash', 'deepseek-v3.2',
    'deepseek-v3.1', 'deepseek-v3', 'deepseek-chat', 'deepseek-r1',
    'glm-5.2', 'glm-5.1', 'glm-5', 'glm-4.7', 'glm-4.6',
    'qwen3.7-max', 'qwen3.7-plus', 'qwen3.6-plus', 'qwen3.5-plus',
    'qwen3-max', 'qwen3-coder',
    'kimi-k2.7-code', 'kimi-k2.6', 'kimi-k2.5',
    'grok-4.5', 'grok-4.3', 'grok-4',
    'llama-4-maverick', 'llama-4-scout',
    'doubao-seed-2-1-pro', 'doubao-seed-2-1-turbo',
  ],
  color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
  badge: 'جديد',
};

const MISTRAL_CONFIG: ProviderConfig = {
  id: 'mistral',
  name: 'Mistral AI',
  nameAr: 'ميسترال AI',
  baseUrl: 'https://api.mistral.ai/v1',
  apiKey: '',
  models: [],
  preferredModels: [
    'mistral-large-latest',
    'mistral-medium-latest',
    'mistral-small-latest',
    'codestral-latest',
    'pixtral-12b-2409',
    'pixtral-large-2411',
    'ministral-8b-latest',
    'ministral-3b-latest',
    'open-mistral-nemo',
    'open-codestral-mamba',
  ],
  color: 'bg-gradient-to-br from-orange-400 to-amber-500',
  badge: 'جديد',
};

// ✅ نوع الإعدادات المخزنة
interface StoredConfig {
  apiKey: string;
  model: string;
  provider: string;
  baseUrl: string;
  customUrl: string;
  useCustom: boolean;
  cerebrasKey: string;
  morphllmKey: string;
  cometapiKey: string;
  mistralKey: string;
  cerebrasModel: string;
  morphllmModel: string;
  cometapiModel: string;
  mistralModel: string;
}

// =====================================
// Get stored config
// =====================================

function getStoredConfig(): StoredConfig {
  return {
    apiKey: localStorage.getItem('mathsolver_api_key') || '',
    model: localStorage.getItem('mathsolver_model') || 'deepseek-ai/DeepSeek-V4-Pro',
    provider: localStorage.getItem('mathsolver_provider') || 'baseten',
    baseUrl: localStorage.getItem('mathsolver_base_url') || 'https://inference.baseten.co/v1',
    customUrl: localStorage.getItem('mathsolver_custom_url') || '',
    useCustom: localStorage.getItem('mathsolver_use_custom') === 'true',

    cerebrasKey: localStorage.getItem('mathsolver_cerebras_key') || '',
    morphllmKey: localStorage.getItem('mathsolver_nvidia_key') || '',
    cometapiKey: localStorage.getItem('mathsolver_cometapi_key') || '',
    mistralKey: localStorage.getItem('mathsolver_mistral_key') || '',

    cerebrasModel: localStorage.getItem('mathsolver_cerebras_model') || '',
    morphllmModel: localStorage.getItem('mathsolver_nvidia_model') || '',
    cometapiModel: localStorage.getItem('mathsolver_cometapi_model') || '',
    mistralModel: localStorage.getItem('mathsolver_mistral_model') || '',
  };
}

// =====================================
// Fetch Models (مباشرة من غير Proxy)
// =====================================

async function fetchAvailableModels(baseUrl: string, apiKey: string): Promise<string[]> {
  try {
    const response = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data?.map((m: any) => m.id) || [];
  } catch {
    return [];
  }
}

function selectBestModel(availableModels: string[], preferredModels: string[]): string {
  for (const model of preferredModels) {
    if (availableModels.includes(model)) return model;
  }
  return availableModels[0] || preferredModels[0] || 'gpt-4o';
}

// =====================================
// Find any vision-capable provider for OCR (used when main provider doesn't support images)
// =====================================

async function extractTextWithAnyProvider(base64Image: string, mimeType: string): Promise<{ text: string; usedProvider: string } | null> {
  // Priority: Gemini (free, best for OCR) -> OpenAI -> Baseten -> Mistral -> Cerebras -> CometAPI

  const mainKey = localStorage.getItem('mathsolver_api_key') || '';
  const mainModel = localStorage.getItem('mathsolver_model') || '';
  const mainProvider = localStorage.getItem('mathsolver_provider') || '';

  // Try main provider first if it's vision-capable
  if (mainKey.trim()) {
    // Gemini
    if (mainModel.includes('gemini') || mainProvider === 'gemini') {
      try {
        const text = await callGeminiVision(mainKey, mainModel || 'gemini-2.5-flash', base64Image, mimeType);
        return { text, usedProvider: 'Gemini' };
      } catch { /* ignore, try next */ }
    }
    // OpenAI with vision
    if (mainModel.includes('gpt-4o') || mainModel.includes('gpt-4') || mainProvider === 'openai') {
      try {
        const text = await callOpenAIVision(mainKey, mainModel || 'gpt-4o', base64Image, mimeType);
        return { text, usedProvider: 'OpenAI' };
      } catch { /* ignore, try next */ }
    }
    // Baseten (some models support vision)
    if (mainProvider === 'baseten') {
      try {
        const baseUrl = localStorage.getItem('mathsolver_base_url') || 'https://inference.baseten.co/v1';
        const text = await callBasetenVision(mainKey, mainModel, baseUrl, base64Image, mimeType);
        return { text, usedProvider: 'Baseten' };
      } catch { /* ignore, try next */ }
    }
  }

  // Try additional providers
  const cerebrasKey = localStorage.getItem('mathsolver_cerebras_key') || '';
  const cerebrasModel = localStorage.getItem('mathsolver_cerebras_model') || '';
  if (cerebrasKey.trim()) {
    try {
      const models = await fetchAvailableModels(CEREBRAS_CONFIG.baseUrl, cerebrasKey);
      const model = cerebrasModel || selectBestModel(models, CEREBRAS_CONFIG.preferredModels);
      const text = await callOpenAIVisionCompatible(cerebrasKey, model, CEREBRAS_CONFIG.baseUrl, base64Image, mimeType);
      return { text, usedProvider: 'Cerebras' };
    } catch { /* ignore, try next */ }
  }

  const mistralKey = localStorage.getItem('mathsolver_mistral_key') || '';
  const mistralModel = localStorage.getItem('mathsolver_mistral_model') || '';
  if (mistralKey.trim()) {
    try {
      const models = await fetchAvailableModels(MISTRAL_CONFIG.baseUrl, mistralKey);
      const visionModels = models.filter((m: string) => m.includes('pixtral') || m.includes('vision'));
      const preferredVision = MISTRAL_CONFIG.preferredModels.filter(m => m.includes('pixtral') || m.includes('vision'));
      const model = mistralModel || selectBestModel(visionModels.length > 0 ? visionModels : models, preferredVision);
      const text = await callOpenAIVisionCompatible(mistralKey, model, MISTRAL_CONFIG.baseUrl, base64Image, mimeType);
      return { text, usedProvider: 'Mistral' };
    } catch { /* ignore, try next */ }
  }

  const cometapiKey = localStorage.getItem('mathsolver_cometapi_key') || '';
  const cometapiModel = localStorage.getItem('mathsolver_cometapi_model') || '';
  if (cometapiKey.trim()) {
    try {
      const models = await fetchAvailableModels(COMETAPI_CONFIG.baseUrl, cometapiKey);
      const model = cometapiModel || selectBestModel(models, COMETAPI_CONFIG.preferredModels);
      const text = await callOpenAIVisionCompatible(cometapiKey, model, COMETAPI_CONFIG.baseUrl, base64Image, mimeType);
      return { text, usedProvider: 'CometAPI' };
    } catch { /* ignore, try next */ }
  }

  return null;
}

// =====================================
// API Object
// =====================================

export const mathSolverAPI = {
  hasApiKeys: (): boolean => {
    const cfg = getStoredConfig();
    return !!(cfg.apiKey || cfg.cerebrasKey || cfg.morphllmKey || cfg.cometapiKey || cfg.mistralKey);
  },

  getProviderInfo: () => {
    const cfg = getStoredConfig();
    const modelName = cfg.model.split('/').pop() || cfg.model;

    let activeModel = modelName;
    let activeProvider = cfg.provider;

    if (cfg.provider === 'cerebras' && cfg.cerebrasKey) {
      activeModel = cfg.cerebrasModel || 'Cerebras Auto';
      activeProvider = 'cerebras';
    } else if (cfg.provider === 'morphllm' && cfg.morphllmKey) {
      activeModel = cfg.morphllmModel || 'MorphLLM Auto';
      activeProvider = 'morphllm';
    } else if (cfg.provider === 'cometapi' && cfg.cometapiKey) {
      activeModel = cfg.cometapiModel || 'CometAPI Auto';
      activeProvider = 'cometapi';
    } else if (cfg.provider === 'mistral' && cfg.mistralKey) {
      activeModel = cfg.mistralModel || 'Mistral Auto';
      activeProvider = 'mistral';
    }

    return {
      hasKeys: !!(cfg.apiKey || cfg.cerebrasKey || cfg.morphllmKey || cfg.cometapiKey || cfg.mistralKey),
      provider: activeProvider,
      model: activeModel,
      baseUrl: cfg.useCustom && cfg.customUrl ? cfg.customUrl : cfg.baseUrl,
    };
  },

  fetchCerebrasModels: async (): Promise<string[]> => {
    const cfg = getStoredConfig();
    if (!cfg.cerebrasKey) return [];
    return fetchAvailableModels(CEREBRAS_CONFIG.baseUrl, cfg.cerebrasKey);
  },

  fetchMorphllmModels: async (): Promise<string[]> => {
    const cfg = getStoredConfig();
    if (!cfg.morphllmKey) return [];
    return fetchAvailableModels(MORPHLLM_CONFIG.baseUrl, cfg.morphllmKey);
  },

  fetchCometapiModels: async (): Promise<string[]> => {
    const cfg = getStoredConfig();
    if (!cfg.cometapiKey) return [];
    return fetchAvailableModels(COMETAPI_CONFIG.baseUrl, cfg.cometapiKey);
  },

  fetchMistralModels: async (): Promise<string[]> => {
    const cfg = getStoredConfig();
    if (!cfg.mistralKey) return [];
    return fetchAvailableModels(MISTRAL_CONFIG.baseUrl, cfg.mistralKey);
  },

  solve: async (request: SolverRequest): Promise<SolverResponse> => {
    const startTime = Date.now();
    const cfg = getStoredConfig();

    if (!cfg.apiKey && !cfg.cerebrasKey && !cfg.morphllmKey && !cfg.cometapiKey && !cfg.mistralKey) {
      return {
        success: false,
        error: 'لم يتم إعداد مفاتيح API. افتح الإعدادات (⚙️) وأضف مفتاح.',
        processingTime: Date.now() - startTime,
      };
    }

    try {
      const prompt = buildPrompt(request.problem, request.subject, request.language, request.detailLevel);
      let result;

      if (cfg.provider === 'cerebras' && cfg.cerebrasKey) {
        const models = await fetchAvailableModels(CEREBRAS_CONFIG.baseUrl, cfg.cerebrasKey);
        const model = cfg.cerebrasModel || selectBestModel(models, CEREBRAS_CONFIG.preferredModels);
        result = await callOpenAICompatible(cfg.cerebrasKey, model, CEREBRAS_CONFIG.baseUrl, prompt);
      }
      else if (cfg.provider === 'morphllm' && cfg.morphllmKey) {
        const models = await fetchAvailableModels(MORPHLLM_CONFIG.baseUrl, cfg.morphllmKey);
        const model = cfg.morphllmModel || selectBestModel(models, MORPHLLM_CONFIG.preferredModels);
        result = await callOpenAICompatible(cfg.morphllmKey, model, prompt);
      }
      else if (cfg.provider === 'cometapi' && cfg.cometapiKey) {
        const models = await fetchAvailableModels(COMETAPI_CONFIG.baseUrl, cfg.cometapiKey);
        const model = cfg.cometapiModel || selectBestModel(models, COMETAPI_CONFIG.preferredModels);
        result = await callOpenAICompatible(cfg.cometapiKey, model, COMETAPI_CONFIG.baseUrl, prompt);
      }
      else if (cfg.provider === 'mistral' && cfg.mistralKey) {
        const models = await fetchAvailableModels(MISTRAL_CONFIG.baseUrl, cfg.mistralKey);
        const model = cfg.mistralModel || selectBestModel(models, MISTRAL_CONFIG.preferredModels);
        result = await callOpenAICompatible(cfg.mistralKey, model, MISTRAL_CONFIG.baseUrl, prompt);
      }
      else if (cfg.provider === 'baseten' || cfg.baseUrl.includes('baseten')) {
        result = await callBasetenDirect(cfg.apiKey, cfg.model, cfg.baseUrl, prompt);
      }
      else if (cfg.provider === 'openai') {
        result = await callOpenAIDirect(cfg.apiKey, cfg.model, prompt);
      }
      else if (cfg.provider === 'gemini') {
        result = await callGeminiDirect(cfg.apiKey, cfg.model, prompt);
      }
      else {
        result = generateDemoSolution(request.problem, request.language);
      }

      return {
        success: true,
        solution: {
          id: Date.now().toString(),
          problemId: 'temp',
          steps: (result.steps || []).map((step: any, i: number) => ({
            stepNumber: step.stepNumber || i + 1,
            explanation: step.explanation || step.description || 'خطوة الحل',
            equation: step.equation || '',
            rule: step.rule || step.law || '',
            isImportant: step.isImportant || false,
          })),
          finalAnswer: result.finalAnswer || result.answer || 'لا يوجد إجابة',
          verification: result.verification || result.check || '',
          language: request.language || 'ar',
          solvedAt: new Date(),
        },
        processingTime: Date.now() - startTime,
      };
    } catch (error: unknown) {
      const err = error as { message?: string };
      return {
        success: false,
        error: err.message || 'فشل في الاتصال بالـ API',
        processingTime: Date.now() - startTime,
      };
    }
  },

  processImage: async (imageFile: File): Promise<OCRResult> => {
    const cfg = getStoredConfig();

    if (!cfg.apiKey && !cfg.cerebrasKey && !cfg.morphllmKey && !cfg.cometapiKey && !cfg.mistralKey) {
      return {
        success: false,
        latex: '',
        confidence: 0,
        rawText: '',
        error: 'لم يتم إعداد مفاتيح API. افتح الإعدادات (⚙️) وأضف مفتاح API أولاُ.',
      };
    }

    try {
      const base64Image = await fileToBase64(imageFile);
      const mimeType = imageFile.type || 'image/jpeg';
      let extractedText = '';
      let confidence = 0.95;

      if (cfg.provider === 'cerebras' && cfg.cerebrasKey) {
        try {
          const models = await fetchAvailableModels(CEREBRAS_CONFIG.baseUrl, cfg.cerebrasKey);
          const model = cfg.cerebrasModel || selectBestModel(models, CEREBRAS_CONFIG.preferredModels);
          extractedText = await callOpenAIVisionCompatible(cfg.cerebrasKey, model, CEREBRAS_CONFIG.baseUrl, base64Image, mimeType);
        } catch (err: any) {
          if (err.message?.includes('multimodal') || err.message?.includes('403')) {
            return {
              success: false,
              latex: '',
              confidence: 0,
              rawText: '',
              error: 'Cerebras: ميزة قراءة الصور (Multimodal) غير مفعلة في حسابك. جرب مزود تاني للصور.',
            };
          }
          throw err;
        }
      }
      else if (cfg.provider === 'morphllm' && cfg.morphllmKey) {
        // MorphLLM doesn't support images directly, so we try ANY available provider for OCR
        const ocrResult = await extractTextWithAnyProvider(base64Image, mimeType);

        if (ocrResult) {
          extractedText = ocrResult.text;
          console.log(`[MorphLLM] OCR done via ${ocrResult.usedProvider}`);
        } else {
          return {
            success: false,
            latex: '',
            confidence: 0,
            rawText: '',
            error: '📷 MorphLLM لا يدعم قراءة الصور مباشرة.\n\nلحل المسائل من الصور باستخدام MorphLLM، أضف مفتاحًا لأي مزود يدعم الصور (Gemini, OpenAI, Mistral Pixtral, إلخ) في قسم "مزودين إضافيين" بالإعدادات (⚙️).\n\nالنص هيتم استخراجه تلقائيًا ويتحلّل بـ MorphLLM.',
          };
        }
      }
      else if (cfg.provider === 'cometapi' && cfg.cometapiKey) {
        const models = await fetchAvailableModels(COMETAPI_CONFIG.baseUrl, cfg.cometapiKey);
        const model = cfg.cometapiModel || selectBestModel(models, COMETAPI_CONFIG.preferredModels);
        extractedText = await callOpenAIVisionCompatible(cfg.cometapiKey, model, COMETAPI_CONFIG.baseUrl, base64Image, mimeType);
      }
      else if (cfg.provider === 'mistral' && cfg.mistralKey) {
        const models = await fetchAvailableModels(MISTRAL_CONFIG.baseUrl, cfg.mistralKey);
        const visionModels = models.filter((m: string) => 
          m.includes('pixtral') || m.includes('vision')
        );
        const preferredVision = MISTRAL_CONFIG.preferredModels.filter(m => 
          m.includes('pixtral') || m.includes('vision')
        );
        const model = cfg.mistralModel || selectBestModel(visionModels.length > 0 ? visionModels : models, preferredVision);
        extractedText = await callOpenAIVisionCompatible(cfg.mistralKey, model, MISTRAL_CONFIG.baseUrl, base64Image, mimeType);
      }
      else if (cfg.provider === 'gemini' || cfg.model.includes('gemini')) {
        extractedText = await callGeminiVision(cfg.apiKey, cfg.model, base64Image, mimeType);
      }
      else if (cfg.provider === 'openai' || cfg.model.includes('gpt-4o') || cfg.model.includes('gpt-4')) {
        extractedText = await callOpenAIVision(cfg.apiKey, cfg.model, base64Image, mimeType);
      }
      else if (cfg.provider === 'baseten' || cfg.baseUrl.includes('baseten')) {
        extractedText = await callBasetenVision(cfg.apiKey, cfg.model, cfg.baseUrl, base64Image, mimeType);
      }
      else {
        return {
          success: false,
          latex: '',
          confidence: 0,
          rawText: '',
          error: 'الموديل المختار لا يدعم التعرف على الصور.',
        };
      }

      const cleanedText = cleanExtractedText(extractedText);
      return {
        success: true,
        latex: cleanedText,
        confidence: confidence,
        rawText: extractedText,
      };
    } catch (error: unknown) {
      const err = error as { message?: string };
      return {
        success: false,
        latex: '',
        confidence: 0,
        rawText: '',
        error: err.message || 'فشل في معالجة الصورة',
      };
    }
  },

  solveFromImage: async (
    imageFile: File,
    subject: string = 'general',
    language: string = 'ar',
    detailLevel: string = 'step-by-step'
  ): Promise<SolverResponse> => {
    const ocrResult = await mathSolverAPI.processImage(imageFile);
    if (!ocrResult.success || !ocrResult.latex) {
      return {
        success: false,
        error: ocrResult.error || 'لم يتم التعرف على أي نص في الصورة. جرب صورة أوضح.',
        processingTime: 0,
      };
    }
    const solveRequest: SolverRequest = {
      problem: ocrResult.latex,
      subject: subject as any,
      language: language as any,
      detailLevel: detailLevel as any,
      includeGraph: false,
    };
    const solveResponse = await mathSolverAPI.solve(solveRequest);
    if (solveResponse.success && solveResponse.solution) {
      (solveResponse.solution as any).extractedText = ocrResult.rawText;
      (solveResponse.solution as any).ocrConfidence = ocrResult.confidence;
    }
    return solveResponse;
  },

  getHistory: async () => [],
  saveProblem: async (_problem: unknown) => null,
  getGraph: async (_equations: string[], _bounds?: unknown) => null,
};

// =====================================
// Helper Functions
// =====================================

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/```[a-z]*\n?/g, '')
    .replace(/```/g, '')
    .trim();
}

// =====================================
// API Calls (مباشرة من غير Proxy)
// =====================================

async function callOpenAICompatible(apiKey: string, model: string, prompt: string) {
  const response = await fetch(`${MORPHLLM_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'You are an expert mathematics teacher. Solve problems step by step with detailed explanations. Always respond in valid JSON format. Use PURE LaTeX for equations (NO \text or \mbox). Example: \int x^4 dx = \frac{x^5}{5}' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 4000,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || content.match(/```\s*([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);
    const objMatch = content.match(/\{[\s\S]*\}/);
    if (objMatch) return JSON.parse(objMatch[0]);
    throw new Error('Could not parse JSON response');
  }
}

// ✅ NVIDIA Vision - uses standard OpenAI-compatible image_url format
async function callOpenAIVisionCompatible(apiKey: string, model: string, base64Image: string, mimeType: string): Promise<string> {
  const response = await fetch(`${MORPHLLM_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'You are an expert OCR system for mathematical equations. Extract ONLY the mathematical expression in PURE LaTeX format. No \text{} or \mbox{}.' },
        { role: 'user', content: [
          { type: 'text', text: 'Extract the mathematical equation from this image as pure LaTeX:' },
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}`, detail: 'high' } },
        ]},
      ],
      temperature: 0.1,
      max_tokens: 2000,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA Vision API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function callGeminiVision(apiKey: string, model: string, base64Image: string, mimeType: string): Promise<string> {
  const modelName = model.includes('gemini') ? model : 'gemini-2.5-flash';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: 'You are an expert OCR system for mathematical equations. Look at this image and extract ALL mathematical text. Return ONLY the mathematical expression in PURE LaTeX format. Do NOT use \text{} or \mbox{}. Do NOT add any explanation, just the raw LaTeX.' },
            { inlineData: { mimeType: mimeType, data: base64Image } },
          ],
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2000 },
      }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini Vision API error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.trim();
}

async function callOpenAIVision(apiKey: string, model: string, base64Image: string, mimeType: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert OCR system for mathematical equations. Extract ONLY the mathematical expression in PURE LaTeX format. No \text{} or \mbox{}.' },
        { role: 'user', content: [
          { type: 'text', text: 'Extract the mathematical equation from this image as pure LaTeX:' },
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
        ]},
      ],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI Vision API error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function callBasetenVision(apiKey: string, model: string, baseUrl: string, base64Image: string, mimeType: string): Promise<string> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'You are an expert OCR system for mathematical equations. Extract ONLY the mathematical expression in PURE LaTeX format. No \text{} or \mbox{}.' },
        { role: 'user', content: [
          { type: 'text', text: 'Extract the mathematical equation from this image as pure LaTeX:' },
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}`, detail: 'high' } },
        ]},
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Baseten Vision API error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function callBasetenDirect(apiKey: string, model: string, baseUrl: string, prompt: string) {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'You are an expert mathematics teacher. Solve problems step by step with detailed explanations. Always respond in valid JSON format. Use PURE LaTeX for equations (NO \text or \mbox). Example: \int x^4 dx = \frac{x^5}{5}' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Baseten API error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/) || content.match(/```\s*([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);
    const objMatch = content.match(/\{[\s\S]*\}/);
    if (objMatch) return JSON.parse(objMatch[0]);
    throw new Error('Could not parse JSON response');
  }
}

async function callOpenAIDirect(apiKey: string, model: string, prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert mathematics teacher. Solve problems step by step with detailed explanations. Always respond in valid JSON format. Use PURE LaTeX for equations (NO \text or \mbox). Example: \int x^4 dx = \frac{x^5}{5}' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function callGeminiDirect(apiKey: string, model: string, prompt: string) {
  const modelName = model.includes('gemini') ? model : 'gemini-2.5-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ 
        role: 'user', 
        parts: [{ text: prompt + '\n\nRespond ONLY in valid JSON format. Use PURE LaTeX for equations (NO \text or \mbox). Example: \int x^4 dx = \frac{x^5}{5}' }] 
      }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4000 },
    }),
  });
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/```\s*([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1]);
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) return JSON.parse(objMatch[0]);
    throw new Error('Could not parse Gemini response');
  }
}

function buildPrompt(problem: string, subject: string, language: string, detailLevel: string) {
  const detailMap: Record<string, string> = {
    'brief': 'Give only the final answer with minimal steps',
    'detailed': 'Solve with clear explanation',
    'step-by-step': 'Solve with extremely detailed step-by-step explanation, showing every rule and law used',
  };
  const subjectNames: Record<string, string> = {
    'algebra': 'Algebra', 'calculus': 'Calculus', 'geometry': 'Geometry',
    'linear-algebra': 'Linear Algebra', 'differential-equations': 'Differential Equations',
    'statistics': 'Statistics', 'statics': 'Engineering Statics', 'dynamics': 'Engineering Dynamics',
    'trigonometry': 'Trigonometry', 'complex-analysis': 'Complex Analysis',
    'discrete-math': 'Discrete Math', 'number-theory': 'Number Theory', 'general': 'General Mathematics',
  };
  return `Solve this ${subjectNames[subject] || 'mathematics'} problem:

${problem}

CRITICAL RULES:
- Language: ${language === 'ar' ? 'Arabic' : 'English'}
- Detail level: ${detailMap[detailLevel] || 'step-by-step'}
- Use PURE LaTeX for equations (NO \text{} or \mbox{} wrappers)
- Example good equation: \int x^4 dx = \frac{x^5}{5}
- Example bad equation: \text{integral of } x^4 \text{ is } \frac{x^5}{5}
- Show all mathematical steps clearly
- Include the name of each rule/law used
- Verify the final answer

Respond in this JSON format:
{
  "steps": [{
    "stepNumber": 1,
    "explanation": "detailed explanation in ${language === 'ar' ? 'Arabic' : 'English'}",
    "equation": "PURE LaTeX equation like: \int x^4 dx = \frac{x^5}{5}",
    "rule": "name of rule used",
    "isImportant": true/false
  }],
  "finalAnswer": "final answer in PURE LaTeX like: \frac{x^5}{5} - x^3 + \frac{5x^2}{2} - 7x + C",
  "verification": "how to verify this answer"
}`;
}

function generateDemoSolution(problem: string, language: string) {
  const isAr = language === 'ar';
  return {
    steps: [
      { stepNumber: 1, explanation: isAr ? 'نبدأ بتحليل المسألة' : 'Start analyzing', equation: '\int x^4 dx = \frac{x^5}{5}', rule: isAr ? 'قاعدة القوة' : 'Power Rule', isImportant: true },
      { stepNumber: 2, explanation: isAr ? 'نكمل الحل' : 'Continue solving', equation: '\int (-3x^2) dx = -x^3', rule: isAr ? 'قاعدة القوة' : 'Power Rule', isImportant: false },
      { stepNumber: 3, explanation: isAr ? 'النتيجة النهائية' : 'Final result', equation: '\int 5x dx = \frac{5x^2}{2}', rule: isAr ? 'قاعدة القوة' : 'Power Rule', isImportant: true },
    ],
    finalAnswer: '\frac{x^5}{5} - x^3 + \frac{5x^2}{2} - 7x + C',
    verification: isAr ? 'اشتق الإجابة للتحقق' : 'Differentiate the answer to verify',
  };
}

export default mathSolverAPI;
