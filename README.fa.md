<div dir="rtl" align="center">

# sh-core-ui

### پلتفرم رابط کاربری سازمانی آگاه از سیاست‌های دسترسی

کامپوننت‌های مستقل از فروشنده، رابط مبتنی بر Manifest، گرید سازمانی، پشتیبانی RTL/LTR و Tree Shaking قابل‌اثبات.

[English](README.md) · [فارسی](README.fa.md) · [العربية](README.ar.md)

[![CI](https://github.com/mahdiporkar/sh-core-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/mahdiporkar/sh-core-ui/actions/workflows/ci.yml)
[![Storybook](https://img.shields.io/badge/دموی%20زنده-Storybook-ff4785?logo=storybook&logoColor=white)](https://mahdiporkar.github.io/sh-core-ui/)
[![Webpack 5](https://img.shields.io/badge/Bundler-Webpack%205-8DD6F9?logo=webpack&logoColor=black)](https://webpack.js.org/)

### [مشاهدهٔ دموی تعاملی Storybook ←](https://mahdiporkar.github.io/sh-core-ui/)

</div>

<div dir="rtl">

`sh-core-ui` زیرساختی مستقل از دامنه برای برنامه‌های React سازمانی، داده‌محور و Micro-Frontend است. قراردادهای پایدار `SH*` جزئیات Ant Design و AG Grid Enterprise را پنهان می‌کنند و Effective Manifest ارزیابی‌شده، رفتار رابط را با تصمیم‌های Backend هماهنگ نگه می‌دارد.

> Manifest فقط تجربهٔ کاربری را کنترل می‌کند. Backend یا Go Proxy باید هر عملیات محافظت‌شده را دوباره مجازسنجی کند و ردیف‌ها و فیلدهای غیرمجاز را پیش از ارسال به مرورگر حذف یا مخدوش کند.

## قابلیت‌ها

- APIهای `SH*` متعلق به سازمان و مستقل از vendor.
- `SHGrid<T>` عمومی با adapter ایزولهٔ AG Grid Enterprise.
- APIهای مستقل از vendor برای `SHForm` پیکربندی‌محور، `SHSelect` غیرهمزمان و `SHNotification` مبتنی بر context.
- رفتارهای `hide`، `disable` و `readOnly` مبتنی بر Effective Manifest.
- Design Tokenهای typed در سه سطح primitive، semantic و component.
- زبان‌های فارسی، انگلیسی و عربی با تغییر runtime جهت RTL/LTR.
- TypeScript سخت‌گیرانه و خروجی ESM/CJS/declaration با Webpack 5.
- fixture و بودجهٔ bundle برای اثبات Tree Shaking.
- Storybook تعاملی با کنترل تم، زبان، جهت، تراکم و policy.

## نصب و شروع سریع

```bash
npm install sh-core-ui react react-dom antd ag-grid-community ag-grid-react ag-grid-enterprise
```

```tsx
import { SHButton, SHCoreProvider } from 'sh-core-ui';
import 'sh-core-ui/styles.css';

const effectiveManifest = await loadEffectiveManifest();

root.render(
  <SHCoreProvider manifest={effectiveManifest}>
    <SHButton policy={{ resource: 'your.resource', action: 'your.action' }}>اجرای عملیات</SHButton>
  </SHCoreProvider>,
);
```

Backend یا Authorization Engine هویت، context و سیاست کسب‌وکار را ارزیابی و Effective Manifest را برمی‌گرداند. نام resource و action کاملاً در اختیار کسب‌وکار است و هسته هیچ نقش یا مجوز وابسته به دامنه ندارد.

## Storybook زنده

[کاتالوگ تعاملی](https://mahdiporkar.github.io/sh-core-ui/) شامل variantهای کامپوننت‌ها، accessibility، مرجع Design Token، سناریوهای RTL و تصمیم‌های مجاز، مخفی، غیرفعال، فقط‌خواندنی، مفقود و منقضی است.

```bash
npm ci
npm run storybook       # اجرا روی پورت 6006
npm run build-storybook # ساخت خروجی استاتیک
```

GitHub Actions پس از موفقیت CI شاخهٔ اصلی، Storybook بررسی‌شده را روی GitHub Pages منتشر می‌کند.

## مسیرهای عمومی

| مسیر import             | کاربرد                                      |
| ----------------------- | ------------------------------------------- |
| `sh-core-ui`            | ورودی عمومی بسته                            |
| `sh-core-ui/components` | کامپوننت‌های مستقل `SH*`                    |
| `sh-core-ui/grid`       | گرید عمومی و قراردادهای آن                  |
| `sh-core-ui/policy`     | hookها، guardها و حالت‌های عدم دسترسی       |
| `sh-core-ui/manifest`   | schema، validation، lint، diff و generation |
| `sh-core-ui/tokens`     | توکن‌ها و تم‌های type-safe                  |
| `sh-core-ui/locales`    | زبان‌ها، فرمت‌دهی و نرمال‌سازی ارقام        |

React 18 و 19 پشتیبانی می‌شوند و توسعه به Node.js 20 یا جدیدتر نیاز دارد.

## اعتبارسنجی

```bash
npm ci
npm run check
```

این دستور format، ESLint، TypeScript، Jest، Manifest، buildهای Webpack، Tree Shaking و Storybook استاتیک را بررسی می‌کند.

## مستندات

[معماری](docs/architecture.md) · [کامپوننت‌ها](docs/component-support.md) · [Manifest](docs/manifests.md) · [امنیت](docs/security-boundary.md) · [Grid](docs/grid.md) · [زبان و تم](docs/localization-theming.md) · [Tree Shaking](docs/tree-shaking.md) · [مشارکت](docs/contributing.md)

نسخهٔ توسعه از `0.1.0` آغاز می‌شود. رسیدن به `1.0.0` به تکمیل و تثبیت inventory کامپوننت‌ها و schema مانیفست وابسته است.

</div>
