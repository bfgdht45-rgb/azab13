// Application Constants

export const API_BASE_URL = '/api';

export const SUBJECTS = [
  { id: 'general', name: 'عام', nameEn: 'General', icon: '🔢', color: 'bg-gray-500' },
  { id: 'algebra', name: 'جبر', nameEn: 'Algebra', icon: '➕', color: 'bg-blue-500' },
  { id: 'calculus', name: 'تفاضل وتكامل', nameEn: 'Calculus', icon: '∫', color: 'bg-green-500' },
  { id: 'geometry', name: 'هندسة فراغية', nameEn: 'Geometry', icon: '📐', color: 'bg-purple-500' },
  { id: 'linear-algebra', name: 'جبر خطي', nameEn: 'Linear Algebra', icon: '🔲', color: 'bg-indigo-500' },
  { id: 'differential-equations', name: 'معادلات تفاضلية', nameEn: 'Differential Equations', icon: '∂', color: 'bg-teal-500' },
  { id: 'statistics', name: 'إحصاء واحتمالات', nameEn: 'Statistics', icon: '📊', color: 'bg-orange-500' },
  { id: 'statics', name: 'استاتيكا', nameEn: 'Statics', icon: '⚖️', color: 'bg-red-500' },
  { id: 'dynamics', name: 'ديناميكا', nameEn: 'Dynamics', icon: '⚡', color: 'bg-yellow-500' },
  { id: 'trigonometry', name: 'مثلثات', nameEn: 'Trigonometry', icon: '∠', color: 'bg-cyan-500' },
  { id: 'complex-analysis', name: 'تحليل مركب', nameEn: 'Complex Analysis', icon: 'ℂ', color: 'bg-pink-500' },
  { id: 'discrete-math', name: 'رياضيات منفصلة', nameEn: 'Discrete Math', icon: '🔢', color: 'bg-emerald-500' },
  { id: 'number-theory', name: 'نظرية الأعداد', nameEn: 'Number Theory', icon: '🔢', color: 'bg-violet-500' },
] as const;

export const DETAIL_LEVELS = [
  { id: 'brief', name: 'مختصر', nameEn: 'Brief', description: 'الإجابة النهائية فقط' },
  { id: 'detailed', name: 'مفصل', nameEn: 'Detailed', description: 'الحل مع شرح مختصر' },
  { id: 'step-by-step', name: 'خطوة بخطوة', nameEn: 'Step-by-Step', description: 'شرح تفصيلي لكل خطوة' },
] as const;

export const MATH_SOLVER_PROMPT = `
أنت معلم رياضيات متخصص وخبير. مهمتك حل المسألة الرياضية التالية بالتفصيل الكامل.

📌 المسألة: {{PROBLEM}}

🔹 الفرع: {{SUBJECT}}
🔹 مستوى التفصيل: {{DETAIL_LEVEL}}
🔹 اللغة: {{LANGUAGE}}

🔹 قواعد مهمة جداً:
1. اكتب الحل باللغة العربية الفصحى الواضحة
2. اشرح كل خطوة بشكل مفصل ومفهوم
3. اكتب المعادلات الرياضية بصيغة LaTeX PURE (بدون \text أو \mbox)
4. استخدم فقط رموز LaTeX الرياضية مثل: \frac, \int, \sum, \sqrt, \pi, \infty
5. لا تستخدم \text{} أو \mbox{} داخل المعادلات
6. اذكر القوانين والقواعد المستخدمة في كل خطوة
7. تحقق من صحة الحل النهائي
8. اكتب الإجابة النهائية بوضوح في النهاية

📐 صيغة الإخراج المطلوبة (JSON):
{
  "steps": [
    {
      "stepNumber": 1,
      "explanation": "شرح الخطوة بالعربية",
      "equation": "المعادلة بصيغة LaTeX نقية مثل: \\int x^4 dx = \\frac{x^5}{5}",
      "rule": "القانون المستخدم"
    }
  ],
  "finalAnswer": "الإجابة النهائية بصيغة LaTeX نقية",
  "verification": "طريقة التحقق من صحة الحل"
}
`;

export const MATH_SOLVER_PROMPT_EN = `
You are an expert mathematics teacher. Solve the following problem with complete detail.

📌 Problem: {{PROBLEM}}

🔹 Subject: {{SUBJECT}}
🔹 Detail Level: {{DETAIL_LEVEL}}

🔹 Important Rules:
1. Write the solution in clear English
2. Explain each step in detail
3. Write equations in PURE LaTeX format (NO \text or \mbox)
4. Use only mathematical LaTeX symbols: \frac, \int, \sum, \sqrt, \pi, \infty
5. Do NOT use \text{} or \mbox{} inside equations
6. State the rules and laws used in each step
7. Verify the final answer

📐 Output format (JSON):
{
  "steps": [
    {
      "stepNumber": 1,
      "explanation": "Step explanation in English",
      "equation": "Pure LaTeX equation like: \\int x^4 dx = \\frac{x^5}{5}",
      "rule": "Rule or law used"
    }
  ],
  "finalAnswer": "Final answer in pure LaTeX",
  "verification": "Method to verify the solution"
}
`;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const APP_NAME = 'حاسب الرياضيات';
export const APP_NAME_EN = 'Math Solver AI';
export const APP_VERSION = '1.0.0';
