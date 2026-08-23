<div dir="rtl" align="center">

# sh-core-ui

### منصة واجهات مؤسسية واعية بسياسات الوصول

مكوّنات مستقلة عن المورّد، وواجهة مبنية على Manifest، وشبكة مؤسسية، ودعم RTL/LTR، وTree Shaking قابل للتحقق.

[English](README.md) · [فارسی](README.fa.md) · [العربية](README.ar.md)

[![CI](https://github.com/mahdiporkar/sh-core-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/mahdiporkar/sh-core-ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/العرض%20المباشر-Storybook-ff4785?logo=storybook&logoColor=white)](https://mahdiporkar.github.io/sh-core-ui/)
[![Webpack 5](https://img.shields.io/badge/Bundler-Webpack%205-8DD6F9?logo=webpack&logoColor=black)](https://webpack.js.org/)

### [افتح العرض التفاعلي المباشر ←](https://mahdiporkar.github.io/sh-core-ui/)

</div>

<div dir="rtl">

`sh-core-ui` أساس محايد للمجال لتطبيقات React المؤسسية كثيفة البيانات ولواجهات Micro-Frontend. تخفي عقود `SH*` المستقرة تفاصيل Ant Design وAG Grid Enterprise، بينما تجعل Effective Manifest المقيّمة الواجهة متوافقة مع قرارات Backend.

> تتحكم Manifest في تجربة المستخدم فقط. يجب على Backend أو Go Proxy إعادة التحقق من كل عملية محمية وحذف الصفوف والحقول غير المصرح بها قبل إرسال البيانات إلى المتصفح.

## الإمكانات

- عقود `SH*` مملوكة للمؤسسة ومستقلة عن المورّد.
- `SHGrid<T>` عامة عبر adapter معزول لـ AG Grid Enterprise.
- واجهات مستقلة عن المورّد لـ `SHForm` القابل للتهيئة و`SHSelect` غير المتزامن و`SHNotification` المعتمد على السياق.
- سلوكيات `hide` و`disable` و`readOnly` عبر Effective Manifest.
- Design Tokens مكتوبة الأنواع على ثلاثة مستويات.
- الإنجليزية والفارسية والعربية مع تبديل RTL/LTR أثناء التشغيل.
- TypeScript صارم ومخرجات ESM/CJS/declaration عبر Webpack 5.
- Consumer fixtures وميزانيات للحزم للتحقق من Tree Shaking.
- Storybook تفاعلي للسمة واللغة والاتجاه والكثافة وحالة policy.

## التثبيت والبدء

```bash
npm install sh-core-ui react react-dom antd ag-grid-community ag-grid-react ag-grid-enterprise
```

```tsx
import { SHButton, SHCoreProvider } from 'sh-core-ui';
import 'sh-core-ui/styles.css';

const effectiveManifest = await loadEffectiveManifest();

root.render(
  <SHCoreProvider manifest={effectiveManifest}>
    <SHButton policy={{ resource: 'your.resource', action: 'your.action' }}>تنفيذ الإجراء</SHButton>
  </SHCoreProvider>,
);
```

يقيّم Backend أو Authorization Engine الهوية والسياق وسياسة العمل ثم يعيد Effective Manifest. أسماء الموارد والإجراءات مملوكة بالكامل لكل نشاط ولا تحتوي النواة على أدوار خاصة بمجال معين.

## Storybook المباشر

يعرض [الكتالوج التفاعلي](https://mahdiporkar.github.io/sh-core-ui/) حالات المكوّنات وإمكانية الوصول وDesign Tokens وسيناريوهات RTL والقرارات المسموحة والمخفية والمعطلة وللقراءة فقط والمفقودة والمنتهية.

```bash
npm ci
npm run storybook       # تشغيل محلي على المنفذ 6006
npm run build-storybook # إنشاء النسخة الثابتة
```

تنشر GitHub Actions النسخة التي اجتازت CI إلى GitHub Pages.

## مسارات الحزمة

| مسار الاستيراد          | الغرض                               |
| ----------------------- | ----------------------------------- |
| `sh-core-ui`            | المدخل العام                        |
| `sh-core-ui/components` | مكوّنات `SH*` المحايدة              |
| `sh-core-ui/grid`       | الشبكة العامة وعقودها               |
| `sh-core-ui/policy`     | hooks والحراس وحالات الرفض          |
| `sh-core-ui/manifest`   | schema والتحقق وlint وdiff والتوليد |
| `sh-core-ui/tokens`     | الرموز والسمات مكتوبة الأنواع       |
| `sh-core-ui/locales`    | اللغات والتنسيق وتوحيد الأرقام      |

يدعم المشروع React 18 و19، ويتطلب Node.js 20 أو أحدث للتطوير.

## التحقق

```bash
npm ci
npm run check
```

يشمل ذلك التنسيق وESLint وTypeScript الصارم وJest وManifest وبناء Webpack وTree Shaking وStorybook الثابت.

## الوثائق

[البنية](docs/architecture.md) · [المكوّنات](docs/component-support.md) · [Policy والصلاحيات](docs/policy-manifest.ar.md) · [Manifest](docs/manifests.md) · [الأمان](docs/security-boundary.md) · [Grid](docs/grid.md) · [اللغة والسمات](docs/localization-theming.md) · [Tree Shaking](docs/tree-shaking.md) · [المساهمة](docs/contributing.md)

يبدأ المشروع بالإصدار `0.1.0`. يتطلب الوصول إلى `1.0.0` إكمال وتثبيت قائمة المكوّنات وschema الخاصة بالـ Manifest.

</div>
