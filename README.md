# الإسلام حياة - موقع إسلامي شامل

موقع إسلامي شامل يجمع القرآن الكريم والأحاديث النبوية والأذكار والأدعية والمزيد.

## المميزات

- 📖 **القرآن الكريم**: تصفح القرآن الكريم كاملاً مع تفسير الآيات
- 📚 **الحديث الشريف**: مجموعة من الأحاديث النبوية الصحيحة
- 🤲 **الأذكار والأدعية**: أذكار الصباح والمساء والأدعية المأثورة
- 🕌 **اتجاه القبلة**: تحديد اتجاه القبلة وأوقات الصلاة
- 📅 **التقويم الهجري**: التقويم الهجري مع المناسبات الإسلامية
- 👨‍🏫 **موسوعة العلماء**: معلومات عن العلماء والدعاة
- 🎵 **المكتبة الصوتية والمرئية**: تلاوات وخطب ومحاضرات
- 🧪 **الاختبارات التفاعلية**: اختبارات لتقييم المعرفة الإسلامية
- 🔍 **البحث الذكي**: بحث متقدم في المحتوى الإسلامي

## التقنيات المستخدمة

- **React 18** - مكتبة JavaScript لبناء واجهات المستخدم
- **Vite** - أداة بناء سريعة ومطور خادم
- **Tailwind CSS** - إطار عمل CSS للتصميم السريع
- **Framer Motion** - مكتبة الرسوم المتحركة لـ React
- **React Router** - التنقل بين الصفحات
- **Lucide React** - مجموعة أيقونات جميلة

## متطلبات التشغيل

- Node.js (الإصدار 16 أو أحدث)
- npm أو yarn أو pnpm

## التثبيت والتشغيل

1. **استنساخ المستودع**:
   ```bash
   git clone <repository-url>
   cd islamic-website
   ```

2. **تثبيت التبعيات**:
   ```bash
   npm install --legacy-peer-deps
   # أو
   yarn install
   # أو
   pnpm install
   ```

3. **تشغيل الخادم المحلي**:
   ```bash
   npm run dev
   # أو
   yarn dev
   # أو
   pnpm dev
   ```

4. **فتح المتصفح** والانتقال إلى `http://localhost:5173`

## البناء للإنتاج

```bash
npm run build
# أو
yarn build
# أو
pnpm build
```

سيتم إنشاء ملفات الإنتاج في مجلد `dist/`.

## النشر

### النشر على Netlify

1. قم ببناء المشروع:
   ```bash
   npm run build
   ```

2. ارفع محتويات مجلد `dist/` إلى Netlify

### النشر على Vercel

1. قم بربط المستودع مع Vercel
2. سيتم البناء والنشر تلقائياً

### النشر على GitHub Pages

1. قم بتثبيت `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. أضف السكريبت التالي إلى `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. قم بالبناء والنشر:
   ```bash
   npm run build
   npm run deploy
   ```

## هيكل المشروع

```
src/
├── components/          # المكونات القابلة لإعادة الاستخدام
│   ├── auth/           # مكونات المصادقة
│   ├── dashboard/      # لوحة التحكم
│   ├── hadith/         # مكونات الحديث
│   ├── media/          # المكتبة الصوتية والمرئية
│   ├── qibla/          # اتجاه القبلة وأوقات الصلاة
│   ├── quran/          # مكونات القرآن الكريم
│   ├── scholars/       # موسوعة العلماء
│   ├── search/         # البحث الذكي
│   ├── shared/         # المكونات المشتركة
│   ├── tests/          # الاختبارات التفاعلية
│   └── ui/             # مكونات واجهة المستخدم الأساسية
├── hooks/              # React Hooks مخصصة
├── lib/                # المكتبات والأدوات المساعدة
├── App.jsx             # المكون الرئيسي
├── App.css             # الأنماط الرئيسية
├── main.jsx            # نقطة دخول التطبيق
└── index.css           # الأنماط العامة
```

## المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. قم بعمل Fork للمستودع
2. أنشئ فرع جديد للميزة الخاصة بك
3. قم بعمل commit للتغييرات
4. ادفع إلى الفرع
5. افتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

إذا كان لديك أي أسئلة أو مشاكل، يرجى فتح issue في المستودع.

## الشكر والتقدير

- [API القرآن الكريم](http://api.alquran.cloud/) لتوفير بيانات القرآن الكريم
- [موقع الدرر السنية](https://dorar.net/) للأحاديث النبوية
- [حصن المسلم](https://hisnmuslim.com/) للأذكار والأدعية

---

**جعله الله في ميزان حسناتنا وحسناتكم** 🤲

