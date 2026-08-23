# اعمال Policy و Permission روی کامپوننت‌ها با Manifest

[فارسی](policy-manifest.fa.md) · [English](policy-manifest.md) · [العربية](policy-manifest.ar.md)

## جریان مسئولیت‌ها

1. Backend یا Authorization Engine هویت، نقش‌ها، tenant، context درخواست، مالکیت و قوانین کسب‌وکار را ارزیابی می‌کند.
2. نتیجه را به‌صورت **Effective Manifest** مخصوص session فعلی برمی‌گرداند.
3. برنامه Manifest را به `SHCoreProvider` تزریق می‌کند.
4. هر کامپوننت با prop به نام `policy` اعلام می‌کند به کدام `resource` و `action` نیاز دارد.
5. `useSHPolicy` تصمیم دقیق متناظر را پیدا می‌کند و کامپوننت رفتار `hide`، `disable` یا `readOnly` را اعمال می‌کند.
6. Backend هر درخواست محافظت‌شدهٔ API را مستقل از UI دوباره مجوزسنجی می‌کند.

کامپوننت‌ها نباید permission را از روی role محاسبه کنند؛ آن‌ها فقط تصمیم ارزیابی‌شده توسط Backend قابل اعتماد را مصرف می‌کنند.

## ساختار Effective Manifest

```ts
const effectiveManifest = {
  schemaVersion: '1.0',
  version: '2026-08-24.1',
  issuedAt: '2026-08-24T08:00:00.000Z',
  expiresAt: '2026-08-24T08:15:00.000Z',
  decisions: [
    { resource: 'orders', action: 'view', allowed: true },
    {
      resource: 'orders',
      action: 'create',
      allowed: false,
      ui: { deniedBehavior: 'disable', reasonCode: 'APPROVAL_REQUIRED' },
    },
    {
      resource: 'orders',
      action: 'edit',
      allowed: false,
      ui: { deniedBehavior: 'readOnly' },
    },
    {
      resource: 'orders',
      action: 'delete',
      allowed: false,
      ui: { deniedBehavior: 'hide' },
    },
  ],
};
```

Definition Manifest امکانات برنامه را تعریف می‌کند، اما Effective Manifest شامل تصمیم‌های نهایی برای یک کاربر و context مشخص است. فقط Effective Manifest باید به Provider داده شود.

برای payload عملیاتی، شناسه‌های opaque شامل `manifestId`، `issuer`، `audience`، `application` و
`subject`، همچنین `notBefore`، `context` عمومی، `defaults` صرفاً برای حالت denied و مقادیر
`cache.refreshAfter`، `cache.staleAt` و `cache.etag` را نیز ارسال کنید. token، secret، قوانین خام
policy و اطلاعات شخصی غیرضروری نباید داخل Manifest باشند. ساختار مرجع در
[مستند معماری Manifest](manifests.md) آمده است.

### تصمیم‌های وابسته به Context

هر تصمیم می‌تواند شرط‌های scalar در `when` داشته باشد. context عمومی Manifest با context کامپوننت
ترکیب می‌شود و مقدار کامپوننت اولویت دارد. همهٔ شرط‌ها باید منطبق باشند و خاص‌ترین تصمیم منطبق انتخاب
می‌شود؛ تصمیم بدون شرط fallback است.

```tsx
<SHButton
  policy={{
    resource: 'orders',
    action: 'export',
    context: { channel: 'operations' },
  }}
>
  خروجی
</SHButton>
```

ترکیب‌های تکراری `resource + action + when` نامعتبرند.

## تزریق Manifest

```tsx
<SHCoreProvider manifest={effectiveManifest} manifestLoading={false}>
  <App />
</SHCoreProvider>
```

هنگام دریافت Manifest مقدار `manifestLoading` را `true` قرار دهید. هر policy می‌تواند با `pendingBehavior: 'hide'` یا `'disable'` رفتار زمان انتظار را مشخص کند.

## اتصال کامپوننت‌ها

```tsx
<SHButton policy={{ resource: 'orders', action: 'view' }}>
  مشاهده سفارش‌ها
</SHButton>

<SHButton policy={{ resource: 'orders', action: 'create' }}>
  ایجاد سفارش
</SHButton>

<SHInput
  label="عنوان سفارش"
  policy={{ resource: 'orders', action: 'edit' }}
/>

<SHButton
  tone="danger"
  policy={{ resource: 'orders', action: 'delete' }}
>
  حذف سفارش
</SHButton>
```

تطبیق با زوج دقیق `resource + action` انجام می‌شود.

| وضعیت تصمیم        | نتیجه در UI                                    |
| ------------------ | ---------------------------------------------- |
| `allowed: true`    | رفتار عادی                                     |
| ردشده + `hide`     | کامپوننت render نمی‌شود                        |
| ردشده + `disable`  | کامپوننت دیده می‌شود ولی غیرفعال است           |
| ردشده + `readOnly` | ورودی فقط خواندنی و action غیرقابل اجرا می‌شود |
| Manifest ناموجود   | Fail-closed؛ غیرفعال                           |
| تصمیم ناموجود      | Fail-closed؛ غیرفعال                           |
| Manifest منقضی     | Fail-closed؛ غیرفعال                           |
| در حال دریافت      | `pendingBehavior` و در حالت پیش‌فرض غیرفعال    |

برای دکمه، `readOnly` به معنی جلوگیری از اجرای action و در عمل معادل disabled است. برای Input مقدار دیده می‌شود ولی قابل ویرایش نیست.

## کنترل یک بخش JSX

```tsx
<SHCan
  policy={{ resource: 'reports', action: 'view' }}
  fallback={<p>دسترسی به گزارش‌ها امکان‌پذیر نیست.</p>}
>
  <Reports />
</SHCan>
```

## محافظت از Route

```tsx
<SHRouteGuard
  policy={{ resource: 'reports', action: 'view' }}
  loadingFallback={<PageSkeleton />}
  fallback={<SHAccessDenied />}
>
  <ReportsPage />
</SHRouteGuard>
```

## بررسی مستقیم Policy

برای کامپوننت سفارشی می‌توان جزئیات تصمیم را با hook دریافت کرد:

```tsx
const policy = useSHPolicy({ resource: 'orders', action: 'approve' });

if (!policy.allowed) {
  return <SHAccessDenied reasonCode={policy.reasonCode} />;
}
```

خروجی شامل `allowed`، `status`، `behavior`، `reasonCode` اختیاری و تصمیم منطبق است.

## Refresh و مدیریت خطا

- payload و تاریخ انقضا را پیش از استفاده اعتبارسنجی کنید.
- هنگام login، logout، تغییر tenant/context، رخداد مجوز یا `cache.refreshAfter` آن را refresh کنید.
- Manifest ناموجود، نامعتبر یا منقضی را denied در نظر بگیرید.
- Manifest را بعد از پایان session یا انقضای آن استفاده نکنید.

## مرز امنیت

Policy مبتنی بر Manifest فقط تجربهٔ کاربری را کنترل می‌کند و مرز امنیت نیست. کاربر می‌تواند وضعیت مرورگر را تغییر دهد یا API را مستقیم فراخوانی کند. Backend یا Gateway باید هر عملیات را مجدداً مجوزسنجی کند و فیلدها و ردیف‌های غیرمجاز را پیش از serialization حذف کند.
