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

  processImage: async (_imageFile: File): Promise<OCRResult> => {
    return {
      success: true,
      latex: 'x^2 + 3x - 5 = 0',
      confidence: 0.95,
      rawText: 'x^2 + 3x - 5 = 0',
      // note: 'OCR demo mode. Type the equation manually for now.',
    };
  },

  getHistory: async () => [],
  saveProblem: async (_problem: unknown) => null,
  getGraph: async (_equations: string[], _bounds?: unknown) => null,
};

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
        { role: 'system', content: 'You are an expert mathematics teacher. Solve problems step by step with detailed explanations. Always respond in valid JSON format. Use PURE LaTeX for equations (NO \\text or \\mbox). Example: \\int x^4 dx = \\frac{x^5}{5}' },
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
        parts: [{ text: prompt + '\n\nRespond ONLY in valid JSON format. Use PURE LaTeX for equations (NO \\text or \\mbox). Example: \\int x^4 dx = \\frac{x^5}{5}' }] 
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
- Use PURE LaTeX for equations (NO \\text{} or \\mbox{} wrappers)
- Example good equation: \\int x^4 dx = \\frac{x^5}{5}
- Example bad equation: \\text{integral of } x^4 \\text{ is } \\frac{x^5}{5}
- Show all mathematical steps clearly
- Include the name of each rule/law used
- Verify the final answer

Respond in this JSON format:
{
  "steps": [{
    "stepNumber": 1,
    "explanation": "detailed explanation in ${language === 'ar' ? 'Arabic' : 'English'}",
    "equation": "PURE LaTeX equation like: \\int x^4 dx = \\frac{x^5}{5}",
    "rule": "name of rule used",
    "isImportant": true/false
  }],
  "finalAnswer": "final answer in PURE LaTeX like: \\frac{x^5}{5} - x^3 + \\frac{5x^2}{2} - 7x + C",
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
