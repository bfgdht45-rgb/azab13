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

const COHERE_CONFIG: ProviderConfig = {
  id: 'cohere',
  name: 'Cohere',
  nameAr: 'كوهير',
  baseUrl: 'https://api.cohere.ai',
  apiKey: '',
  models: [],
  preferredModels: [
    'command-a-plus-05-2026',
    'command-a-reasoning-08-2025',
    'command-a-vision-07-2025',
    'command-a-translate-08-2025',
    'command-a-03-2025',
    'c4ai-aya-vision-32b',
    'c4ai-aya-expanse-32b',
    'command-r-plus-08-2024',
    'command-r-08-2024',
    'command-r7b-arabic-02-2025',
    'command-r7b-12-2024',
    'north-mini-code-1-0',
    'tiny-aya-earth',
    'tiny-aya-fire',
    'tiny-aya-global',
    'tiny-aya-water',
  ],
  color: 'bg-gradient-to-br from-purple-600 to-pink-600',
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
  cometapiKey: string;
  mistralKey: string;
  cohereKey: string;
  cerebrasModel: string;
  cometapiModel: string;
  mistralModel: string;
  cohereModel: string;
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
    cometapiKey: localStorage.getItem('mathsolver_cometapi_key') || '',
    mistralKey: localStorage.getItem('mathsolver_mistral_key') || '',
    cohereKey: localStorage.getItem('mathsolver_cohere_key') || '',

    cerebrasModel: localStorage.getItem('mathsolver_cerebras_model') || '',
    cometapiModel: localStorage.getItem('mathsolver_cometapi_model') || '',
    mistralModel: localStorage.getItem('mathsolver_mistral_model') || '',
    cohereModel: localStorage.getItem('mathsolver_cohere_model') || '',
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

async function fetchCohereModels(apiKey: string): Promise<string[]> {
  try {
    // Try v1 models endpoint first
    const response = await fetch('https://api.cohere.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) return COHERE_CONFIG.preferredModels;
    const data = await response.json();
    return data.models?.map((m: any) => m.name) || COHERE_CONFIG.preferredModels;
  } catch {
    return COHERE_CONFIG.preferredModels;
  }
}

function selectBestModel(availableModels: string[], preferredModels: string[]): string {
  for (const model of preferredModels) {
    if (availableModels.includes(model)) return model;
  }
  return availableModels[0] || preferredModels[0] || 'gpt-4o';
}

// =====================================
// Robust JSON Extraction Helper
// =====================================

function extractJSONFromResponse(content: string): any {
  if (!content || typeof content !== 'string') {
    throw new Error('Empty or invalid response content');
  }

  const trimmed = content.trim();

  // 1. Try direct JSON parse first
  try {
    return JSON.parse(trimmed);
  } catch {
    // continue
  }

  // 2. Try markdown code blocks: ```json {...} ```
  const jsonCodeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonCodeBlockMatch) {
    try {
      return JSON.parse(jsonCodeBlockMatch[1].trim());
    } catch {
      // continue
    }
  }

  // 3. Find the first { and last } and try to parse between them
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      const jsonCandidate = trimmed.substring(firstBrace, lastBrace + 1);
      return JSON.parse(jsonCandidate);
    } catch {
      // continue
    }
  }

  // 4. Find the first [ and last ] and try to parse between them
  const firstBracket = trimmed.indexOf('[');
  const lastBracket = trimmed.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    try {
      const jsonCandidate = trimmed.substring(firstBracket, lastBracket + 1);
      return JSON.parse(jsonCandidate);
    } catch {
      // continue
    }
  }

  // 5. Clean common markdown artifacts and retry
  const cleaned = trimmed
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .replace(/^(?:Here is|Here's|This is|Sure,|Okay,|Alright,|Of course|Certainly).*?\{/s, '{')
    .replace(/\}[^}]*$/s, '}')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // continue
  }

  // 6. Try finding JSON with regex for nested objects
  const jsonRegex = /\{[\s\S]*?\}/g;
  const matches = trimmed.match(jsonRegex);
  if (matches) {
    const sortedMatches = matches.sort((a, b) => b.length - a.length);
    for (const match of sortedMatches) {
      try {
        return JSON.parse(match);
      } catch {
        continue;
      }
    }
  }

  throw new Error('Could not parse JSON response. Raw content preview: ' + trimmed.substring(0, 300));
}

// =====================================
// API Object
// =====================================

export const mathSolverAPI = {
  hasApiKeys: (): boolean => {
    const cfg = getStoredConfig();
    return !!(cfg.apiKey || cfg.cerebrasKey || cfg.cometapiKey || cfg.mistralKey || cfg.cohereKey);
  },

  getProviderInfo: () => {
    const cfg = getStoredConfig();
    const modelName = cfg.model.split('/').pop() || cfg.model;

    let activeModel = modelName;
    let activeProvider = cfg.provider;

    if (cfg.provider === 'cerebras' && cfg.cerebrasKey) {
      activeModel = cfg.cerebrasModel || 'Cerebras Auto';
      activeProvider = 'cerebras';
    } else if (cfg.provider === 'cometapi' && cfg.cometapiKey) {
      activeModel = cfg.cometapiModel || 'CometAPI Auto';
      activeProvider = 'cometapi';
    } else if (cfg.provider === 'mistral' && cfg.mistralKey) {
      activeModel = cfg.mistralModel || 'Mistral Auto';
      activeProvider = 'mistral';
    } else if (cfg.provider === 'cohere' && cfg.cohereKey) {
      activeModel = cfg.cohereModel || 'Cohere Auto';
      activeProvider = 'cohere';
    }

    return {
      hasKeys: !!(cfg.apiKey || cfg.cerebrasKey || cfg.cometapiKey || cfg.mistralKey || cfg.cohereKey),
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

  fetchCohereModels: async (): Promise<string[]> => {
    const cfg = getStoredConfig();
    if (!cfg.cohereKey) return COHERE_CONFIG.preferredModels;
    return fetchCohereModels(cfg.cohereKey);
  },

  solve: async (request: SolverRequest): Promise<SolverResponse> => {
    const startTime = Date.now();
    const cfg = getStoredConfig();

    if (!cfg.apiKey && !cfg.cerebrasKey && !cfg.cometapiKey && !cfg.mistralKey && !cfg.cohereKey) {
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
      else if (cfg.provider === 'cohere' && cfg.cohereKey) {
        const models = await fetchCohereModels(cfg.cohereKey);
        const model = cfg.cohereModel || selectBestModel(models, COHERE_CONFIG.preferredModels);
        result = await callCohereV1(cfg.cohereKey, model, prompt);
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

      // Validate result structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response structure from API');
      }

      // Ensure steps array exists
      if (!result.steps || !Array.isArray(result.steps) || result.steps.length === 0) {
        // Try to construct steps from other fields
        if (result.solution || result.answer || result.finalAnswer) {
          result.steps = [{
            stepNumber: 1,
            explanation: request.language === 'ar' ? 'الحل المباشر' : 'Direct solution',
            equation: result.equation || result.solution || '',
            rule: request.language === 'ar' ? 'حل مباشر' : 'Direct solve',
            isImportant: true,
          }];
          result.finalAnswer = result.finalAnswer || result.answer || result.solution || 'لا يوجد إجابة';
        } else {
          throw new Error('API returned empty or invalid solution structure');
        }
      }

      return {
        success: true,
        solution: {
          id: Date.now().toString(),
          problemId: 'temp',
          steps: result.steps.map((step: any, i: number) => ({
            stepNumber: step.stepNumber || i + 1,
            explanation: step.explanation || step.description || (request.language === 'ar' ? 'خطوة الحل' : 'Solution step'),
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

    if (!cfg.apiKey && !cfg.cerebrasKey && !cfg.cometapiKey && !cfg.mistralKey && !cfg.cohereKey) {
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
      else if (cfg.provider === 'cohere' && cfg.cohereKey) {
        try {
          const models = await fetchCohereModels(cfg.cohereKey);
          const visionModels = models.filter((m: string) => 
            m.includes('vision') || m.includes('aya-vision')
          );
          const preferredVision = COHERE_CONFIG.preferredModels.filter(m => 
            m.includes('vision') || m.includes('aya-vision')
          );
          const model = cfg.cohereModel || selectBestModel(visionModels.length > 0 ? visionModels : models, preferredVision);
          extractedText = await callCohereV1Vision(cfg.cohereKey, model, base64Image, mimeType);
        } catch (err: any) {
          if (err.message?.includes('multimodal') || err.message?.includes('403') || err.message?.includes('not supported')) {
            return {
              success: false,
              latex: '',
              confidence: 0,
              rawText: '',
              error: 'Cohere: ميزة قراءة الصور غير متوفرة في النموذج المختار. جرب مزود تاني للصور.',
            };
          }
          throw err;
        }
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

async function callOpenAICompatible(apiKey: string, model: string, baseUrl: string, prompt: string) {
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
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  return extractJSONFromResponse(content);
}

// Cohere v1 API with response_format for forcing JSON output
async function callCohereV1(apiKey: string, model: string, prompt: string) {
  const response = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      message: prompt,
      preamble: 'You are an expert mathematics teacher. You MUST solve problems step by step with detailed explanations. You MUST respond in valid JSON format only. Use PURE LaTeX for equations (NO \\text or \\mbox). Example: \\int x^4 dx = \\frac{x^5}{5}. Do not include any text outside the JSON. No markdown code blocks. Just raw JSON.',
      temperature: 0.2,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cohere API error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  // v1 response: data.text
  const content = data.text || '';
  if (!content) {
    throw new Error('Cohere returned empty response. Raw data: ' + JSON.stringify(data).substring(0, 500));
  }
  return extractJSONFromResponse(content);
}

// Cohere v1 Vision API
async function callCohereV1Vision(apiKey: string, model: string, base64Image: string, mimeType: string): Promise<string> {
  const response = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      message: 'Extract the mathematical equation from this image as pure LaTeX. Return ONLY the LaTeX expression, no explanation.',
      preamble: 'You are an expert OCR system for mathematical equations. Extract ONLY the mathematical expression in PURE LaTeX format. No \\text{} or \\mbox{}.',
      connectors: [{ id: 'document-connector' }],
      documents: [{
        id: 'image',
        data: `data:${mimeType};base64,${base64Image}`,
      }],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cohere Vision API error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  return (data.text || '').trim();
}

async function callOpenAIVisionCompatible(apiKey: string, model: string, baseUrl: string, base64Image: string, mimeType: string): Promise<string> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: 'You are an expert OCR system for mathematical equations. Extract ONLY the mathematical expression in PURE LaTeX format. No \\text{} or \\mbox{}.' },
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
    throw new Error(`Vision API error: ${response.status} - ${errorText}`);
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
            { text: 'You are an expert OCR system for mathematical equations. Look at this image and extract ALL mathematical text. Return ONLY the mathematical expression in PURE LaTeX format. Do NOT use \\text{} or \\mbox{}. Do NOT add any explanation, just the raw LaTeX.' },
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
        { role: 'system', content: 'You are an expert OCR system for mathematical equations. Extract ONLY the mathematical expression in PURE LaTeX format. No \\text{} or \\mbox{}.' },
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
        { role: 'system', content: 'You are an expert OCR system for mathematical equations. Extract ONLY the mathematical expression in PURE LaTeX format. No \\text{} or \\mbox{}.' },
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
        { role: 'system', content: 'You are an expert mathematics teacher. Solve problems step by step with detailed explanations. Always respond in valid JSON format. Use PURE LaTeX for equations (NO \\text or \\mbox). Example: \\int x^4 dx = \\frac{x^5}{5}' },
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
  return extractJSONFromResponse(content);
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
        { role: 'system', content: 'You are an expert mathematics teacher. Solve problems step by step with detailed explanations. Always respond in valid JSON format. Use PURE LaTeX for equations (NO \\text or \\mbox). Example: \\int x^4 dx = \\frac{x^5}{5}' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });
  const data = await response.json();
  return extractJSONFromResponse(data.choices[0].message.content);
}

async function callGeminiDirect(apiKey: string, model: string, prompt: string) {
  const modelName = model.includes('gemini') ? model : 'gemini-2.5-flash';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ 
        role: 'user', 
        parts: [{ text: prompt + '\n\nRespond ONLY in valid JSON format. Use PURE LaTeX for equations (NO \\text or \\mbox). Example: \\int x^4 dx = \\frac{x^5}{5}' }] 
      }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4000 },
    }),
  });
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return extractJSONFromResponse(text);
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

  const isAr = language === 'ar';

  return `Generate a JSON object that solves this ${subjectNames[subject] || 'mathematics'} problem.

Problem: ${problem}

CRITICAL RULES:
- Language: ${isAr ? 'Arabic' : 'English'}
- Detail level: ${detailMap[detailLevel] || 'step-by-step'}
- Use PURE LaTeX for equations (NO \\text{} or \\mbox{} wrappers)
- Example good equation: \\int x^4 dx = \\frac{x^5}{5}
- Example bad equation: \\text{integral of } x^4 \\text{ is } \\frac{x^5}{5}
- Show all mathematical steps clearly
- Include the name of each rule/law used
- Verify the final answer

You MUST return ONLY a valid JSON object with this exact structure:
{
  "steps": [{
    "stepNumber": 1,
    "explanation": "detailed explanation in ${isAr ? 'Arabic' : 'English'}",
    "equation": "PURE LaTeX equation",
    "rule": "name of rule used",
    "isImportant": true
  }],
  "finalAnswer": "final answer in PURE LaTeX",
  "verification": "how to verify this answer"
}`;
}

function generateDemoSolution(problem: string, language: string) {
  const isAr = language === 'ar';
  return {
    steps: [
      { stepNumber: 1, explanation: isAr ? 'نبدأ بتحليل المسألة' : 'Start analyzing', equation: '\\int x^4 dx = \\frac{x^5}{5}', rule: isAr ? 'قاعدة القوة' : 'Power Rule', isImportant: true },
      { stepNumber: 2, explanation: isAr ? 'نكمل الحل' : 'Continue solving', equation: '\\int (-3x^2) dx = -x^3', rule: isAr ? 'قاعدة القوة' : 'Power Rule', isImportant: false },
      { stepNumber: 3, explanation: isAr ? 'النتيجة النهائية' : 'Final result', equation: '\\int 5x dx = \\frac{5x^2}{2}', rule: isAr ? 'قاعدة القوة' : 'Power Rule', isImportant: true },
    ],
    finalAnswer: '\\frac{x^5}{5} - x^3 + \\frac{5x^2}{2} - 7x + C',
    verification: isAr ? 'اشتق الإجابة للتحقق' : 'Differentiate the answer to verify',
  };
}

export default mathSolverAPI;
