# حاسب الرياضيات | Math Solver AI

تطبيق ويب لحل المسائل الرياضية بالذكاء الاصطناعي - يدعم جميع فروع الرياضيات باللغة العربية.

## 🚀 النشر (بنقرة واحدة!)

### على Netlify
1. ارفع المشروع على GitHub
2. اذهب لـ [app.netlify.com/start](https://app.netlify.com/start)
3. اربط Repository
4. اضغط **Deploy site** ✅

### على Vercel
1. ارفع المشروع على GitHub
2. اذهب لـ [vercel.com/new](https://vercel.com/new)
3. اربط Repository
4. اضغط **Deploy** ✅

## 🔑 بعد النشر

1. افتح التطبيق
2. اضغط **⚙️ الإعدادات** (فوق يمين)
3. اختر موديل وأدخل مفتاح API:
   - **Baseten**: [baseten.co](https://www.baseten.co/) (DeepSeek, Kimi, GPT-OSS, GLM)
   - **Google**: [aistudio.google.com](https://aistudio.google.com/app/apikey) (Gemini Flash - مجاني!)
   - **OpenAI**: [platform.openai.com](https://platform.openai.com/api-keys) (GPT-4o)
4. اضغط **حفظ** وجرب! 🎉

## 🏠 التشغيل المحلي

```bash
npm install
npm install mathlive react-katex katex
npm run dev
```

## 🤖 الموديلات المدعومة

| الموديل | المزود |
|---------|--------|
| DeepSeek V4 Pro | Baseten |
| Kimi K2.6 | Baseten |
| GPT-OSS 120B | Baseten |
| GLM-5 | Baseten |
| Gemini 2.5 Flash | Google (مجاني!) |
| GPT-4o | OpenAI |
