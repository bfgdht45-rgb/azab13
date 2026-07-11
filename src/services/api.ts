import type { SolverRequest, SolverResponse, OCRResult } from '../types';

// Get stored config
function getStoredConfig() {
  return {
    apiKey: localStorage.getItem('mathsolver_api_key') || '',
    model: localStorage.getItem('mathsolver_model') || 'deepseek-ai/DeepSeek-V4-Pro',
    provider: localStorage.getItem('mathsolver_provider') || 'baseten',
    baseUrl: localStorage.getItem('mathsolver_base_url') || 'https://inference.baseten.co/v1',
    customUrl: localStorage.getItem('mathsolver_custom_url') || '',
    useCustom: localStorage.getItem('mathsolver_use_custom') === 'true',
  };
}

export const mathSolverAPI = {
  hasApiKeys: (): boolean => {
    return !!(getStoredConfig().apiKey);
  },

  getProviderInfo: () => {
    const cfg = getStoredConfig();
    const modelName = cfg.model.split('/').pop() || cfg.model;
    return {
      hasKeys: !!cfg.apiKey,
      provider: cfg.provider,
      model: modelName,
      baseUrl: cfg.useCustom && cfg.customUrl ? cfg.customUrl : cfg.baseUrl,
    };
  },

  solve: async (request: SolverRequest): Promise<SolverResponse> => {
    const startTime = Date.now();
    const cfg = getStoredConfig();

    if (!cfg.apiKey) {
      return {
        success: false,
        error: 'لم يتم إعداد مفاتيح API. افتح الإعدادات (⚙️) وأضف مفتاح Baseten API أو Gemini API.',
        processingTime: Date.now() - startTime,
      };
    }

    try {
      const prompt = buildPrompt(request.problem, request.subject, request.language, request.detailLevel);
      let result;

      if (cfg.provider === 'baseten' || cfg.baseUrl.includes('baseten')) {
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

  // ✅ دالة OCR المصلحة - بتستخدم AI لفهم الصورة
  processImage: async (imageFile: File): Promise<OCRResult> => {
    const cfg = getStoredConfig();

    if (!cfg.apiKey) {
      return {
        success: false,
        latex: '',
        confidence: 0,
        rawText: '',
        error: 'لم يتم إعداد مفاتيح API. افتح الإعدادات (⚙️) وأضف مفتاح API أولاً.',
      };
    }

    try {
      // تحويل الصورة لـ base64
      const base64Image = await fileToBase64(imageFile);
      const mimeType = imageFile.type || 'image/jpeg';

      let extractedText = '';
      let confidence = 0.95;

      // ✅ استخدام Gemini للتعرف على الصور (أفضل دعم للصور)
      if (cfg.provider === 'gemini' || cfg.model.includes('gemini')) {
        extractedText = await callGeminiVision(cfg.apiKey, cfg.model, base64Image, mimeType);
      }
      // ✅ استخدام OpenAI GPT-4o Vision
      else if (cfg.provider === 'openai' || cfg.model.includes('gpt-4o') || cfg.model.includes('gpt-4')) {
        extractedText = await callOpenAIVision(cfg.apiKey, cfg.model, base64Image, mimeType);
      }
      // ✅ استخدام Baseten مع DeepSeek (لو الموديل يدعم vision)
      else if (cfg.provider === 'baseten' || cfg.baseUrl.includes('baseten')) {
        extractedText = await callBasetenVision(cfg.apiKey, cfg.model, cfg.baseUrl, base64Image, mimeType);
      }
      else {
        // ❌ لو مفيش موديل يدعم الصور، نرجع خطأ واضح
        return {
          success: false,
          latex: '',
          confidence: 0,
          rawText: '',
          error: 'الموديل المختار لا يدعم التعرف على الصور. اختر Gemini Flash أو GPT-4o.',
        };
      }

      // تنظيف النص المستخرج
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

  // ✅ دالة جديدة: حل مسألة من صورة مباشرة (OCR + Solve)
  solveFromImage: async (
    imageFile: File,
    subject: string = 'general',
    language: string = 'ar',
    detailLevel: string = 'step-by-step'
  ): Promise<SolverResponse> => {
    // الخطوة 1: استخراج النص من الصورة
    const ocrResult = await mathSolverAPI.processImage(imageFile);

    if (!ocrResult.success || !ocrResult.latex) {
      return {
        success: false,
        error: ocrResult.error || 'لم يتم التعرف على أي نص في الصورة. جرب صورة أوضح.',
        processingTime: 0,
      };
    }

    // ✅ الخطوة 2: حل المسألة المستخرجة
    const solveRequest: SolverRequest = {
      problem: ocrResult.latex,
      subject: subject as any,
      language: language as any,
      detailLevel: detailLevel as any,
      includeGraph: false,
    };

    const solveResponse = await mathSolverAPI.solve(solveRequest);

    // إضافة معلومات OCR للنتيجة
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

// ===== دوال مساعدة =====

// تحويل ملف لـ base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // إزالة prefix data:image/jpeg;base64,
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// تنظيف النص المستخرج
function cleanExtractedText(text: string): string {
  return text
    .replace(/```[a-z]*\n?/g, '') // إزالة markdown code blocks
    .replace(/```/g, '')
    .trim();
}

// ===== دوال Vision API =====

// ✅ Gemini Vision API
async function callGeminiVision(apiKey: string, model: string, base64Image: string, mimeType: string): Promise<string> {
  const modelName = model.includes('gemini') ? model : 'gemini-2.5-flash';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are an expert OCR system for mathematical equations. 
Look at this image and extract ALL mathematical text.
Return ONLY the mathematical expression in PURE LaTeX format.
Do NOT use \text{} or \mbox{}.
Do NOT add any explanation, just the raw LaTeX.
Examples of good output:
- \int_{0}^{\pi} \sin(x) dx
- x^2 + 3x - 5 = 0
- \frac{d}{dx}(x^3 + 2x) = 3x^2 + 2
- \sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}`
              },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2000,
        },
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

// ✅ OpenAI Vision API (GPT-4o)
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
        {
          role: 'system',
          content: 'You are an expert OCR system for mathematical equations. Extract ONLY the mathematical expression in PURE LaTeX format. No \text{} or \mbox{}. No explanations.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the mathematical equation from this image as pure LaTeX:',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
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

// ✅ Baseten Vision (للموديلات اللي تدعم صور)
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
        {
          role: 'system',
          content: 'You are an expert OCR system for mathematical equations. Extract ONLY the mathematical expression in PURE LaTeX format. No \text{} or \mbox{}.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the mathematical equation from this image as pure LaTeX:',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'high',
              },
            },
          ],
        },
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

// ===== دوال النص API (الموجودة) =====

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
