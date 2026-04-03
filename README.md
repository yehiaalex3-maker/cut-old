# MASTER Y — نظام تفريغ مقاسات القطع الخشبية

نظام متكامل لتفريغ مقاسات القطع الخشبية وحساب التكاليف للمشاغل والمصانع.

---

## المتطلبات

- [Node.js](https://nodejs.org/) v18 أو أحدث
- حساب [Supabase](https://supabase.com/) (للـ database والـ authentication)

---

## الإعداد والتشغيل

### 1. تثبيت الاعتماديات

```bash
npm install
```

### 2. إعداد متغيرات البيئة

تأكد من وجود ملف `.env` في جذر المشروع يحتوي على:

```
VITE_SUPABASE_URL=https://asvneudbrlaymaocjebs.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_mJSTn6eP1t-KaZTcsJmphw_vD5WCBbg
```

### 3. تشغيل بيئة التطوير

```bash
npm run dev
```

افتح المتصفح على `http://localhost:5173`

---

## البناء للإنتاج

```bash
npm run build
```

الملفات الناتجة تكون في مجلد `dist/`.

---

## النشر على Vercel

1. ارفع المشروع على GitHub
2. اربطه بـ [Vercel](https://vercel.com/)
3. أضف متغيرات البيئة في **Vercel Dashboard → Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL` (نفس القيمة)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (نفس القيمة)
   - `SUPABASE_SERVICE_ROLE_KEY` (من Supabase → Settings → API → service_role)

---

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---|---|
| React 19 + TypeScript | واجهة المستخدم |
| Vite | أداة البناء |
| Tailwind CSS v4 | التصميم |
| Supabase | قاعدة البيانات والمصادقة |
| React Router v7 | التنقل بين الصفحات |
| XLSX | تصدير ملفات Excel |

---

## هيكل المشروع

```
src/
├── components/     # مكونات مشتركة (Sidebar, Header, ...)
├── pages/          # صفحات التطبيق
├── lib/            # دوال مساعدة (supabase, calculations, ...)
└── types/          # تعريفات TypeScript

api/                # Serverless functions (Vercel API routes)
public/             # ملفات ثابتة (أيقونات، manifest، service worker)
```
