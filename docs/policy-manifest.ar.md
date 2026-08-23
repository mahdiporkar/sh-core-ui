# تطبيق Policy وPermission على المكوّنات باستخدام Manifest

[فارسی](policy-manifest.fa.md) · [English](policy-manifest.md) · [العربية](policy-manifest.ar.md)

## تسلسل المسؤوليات

1. يقيّم Backend أو Authorization Engine الهوية والأدوار والمستأجر والسياق والملكية وقواعد العمل.
2. يعيد **Effective Manifest** مقيّماً للجلسة الحالية.
3. يحقن التطبيق هذا الـManifest في `SHCoreProvider`.
4. يعلن كل مكوّن عن `resource` و`action` المطلوبين عبر الخاصية `policy`.
5. يبحث `useSHPolicy` عن القرار المطابق ويطبّق المكوّن `hide` أو`disable` أو`readOnly`.
6. يعيد Backend التحقق من صلاحية كل طلب API محمي بصورة مستقلة عن الواجهة.

لا تحسب المكوّنات الصلاحيات انطلاقاً من الأدوار؛ بل تستهلك قرارات سبق أن قيّمها Backend موثوق.

## بنية Effective Manifest

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

يصف Definition Manifest الموارد والإجراءات التي يدعمها التطبيق، أما Effective Manifest فيحتوي القرارات النهائية لهوية وسياق محددين. يجب حقن Effective Manifest فقط في Provider.

في payload الإنتاجي أضف مراجع opaque مثل `manifestId` و`issuer` و`audience` و`application`
و`subject`، وكذلك `notBefore` و`context` العام و`defaults` الخاصة بالرفض فقط، وقيم
`cache.refreshAfter` و`cache.staleAt` و`cache.etag`. لا تضمّن tokens أو الأسرار أو قواعد policy
الخام أو البيانات الشخصية غير الضرورية. راجع [بنية Manifest المرجعية](manifests.md).

### القرارات المرتبطة بالسياق

يمكن للقرار تحديد شروط scalar في `when`. يُدمج سياق Manifest مع سياق المكوّن، وتكون لقيم المكوّن
الأولوية. يجب أن تتطابق كل الشروط، ويُختار القرار المطابق الأكثر تحديداً؛ أما القرار بلا شروط فهو
fallback.

```tsx
<SHButton
  policy={{
    resource: 'orders',
    action: 'export',
    context: { channel: 'operations' },
  }}
>
  تصدير
</SHButton>
```

تُعد تركيبات `resource + action + when` المتكررة غير صالحة.

## حقن Manifest

```tsx
<SHCoreProvider manifest={effectiveManifest} manifestLoading={false}>
  <App />
</SHCoreProvider>
```

أثناء جلبه استخدم `manifestLoading={true}`. ويمكن للـpolicy تحديد سلوك الانتظار عبر `pendingBehavior: 'hide'` أو `'disable'`.

## ربط المكوّنات

```tsx
<SHButton policy={{ resource: 'orders', action: 'view' }}>
  عرض الطلبات
</SHButton>

<SHButton policy={{ resource: 'orders', action: 'create' }}>
  إنشاء طلب
</SHButton>

<SHInput
  label="عنوان الطلب"
  policy={{ resource: 'orders', action: 'edit' }}
/>

<SHButton
  tone="danger"
  policy={{ resource: 'orders', action: 'delete' }}
>
  حذف الطلب
</SHButton>
```

تتم المطابقة باستخدام الزوج الدقيق `resource + action`.

| حالة القرار        | النتيجة في الواجهة                                    |
| ------------------ | ----------------------------------------------------- |
| `allowed: true`    | سلوك طبيعي                                            |
| مرفوض + `hide`     | لا يتم عرض المكوّن                                    |
| مرفوض + `disable`  | يظهر المكوّن لكنه معطّل                               |
| مرفوض + `readOnly` | حقول الإدخال للقراءة فقط والإجراءات غير قابلة للتنفيذ |
| Manifest مفقود     | Fail-closed؛ معطّل                                    |
| قرار مفقود         | Fail-closed؛ معطّل                                    |
| Manifest منتهي     | Fail-closed؛ معطّل                                    |
| قيد التحميل        | يستخدم `pendingBehavior` وإلا يكون معطّلاً            |

بالنسبة إلى الأزرار يعني `readOnly` منع تنفيذ الإجراء، ولذلك يتصرف مثل disabled. أما حقول البيانات فتعرض القيمة وتمنع تعديلها.

## حماية جزء من JSX

```tsx
<SHCan policy={{ resource: 'reports', action: 'view' }} fallback={<p>التقارير غير متاحة.</p>}>
  <Reports />
</SHCan>
```

## حماية Route

```tsx
<SHRouteGuard
  policy={{ resource: 'reports', action: 'view' }}
  loadingFallback={<PageSkeleton />}
  fallback={<SHAccessDenied />}
>
  <ReportsPage />
</SHRouteGuard>
```

## فحص Policy مباشرة

يمكن للمكوّن المخصص قراءة تفاصيل القرار عبر hook:

```tsx
const policy = useSHPolicy({ resource: 'orders', action: 'approve' });

if (!policy.allowed) {
  return <SHAccessDenied reasonCode={policy.reasonCode} />;
}
```

تحتوي النتيجة `allowed` و`status` و`behavior` و`reasonCode` الاختياري والقرار المطابق.

## التحديث ومعالجة الفشل

- تحقق من payload وتاريخ الانتهاء قبل الاستخدام.
- حدّثه عند تسجيل الدخول والخروج، أو تغير tenant/context، أو أحداث الصلاحيات، أو `cache.refreshAfter`.
- اعتبر Manifest المفقود أو غير الصالح أو المنتهي مرفوضاً.
- لا تستخدم Manifest بعد انتهاء الجلسة أو صلاحيته.

## الحد الأمني

تحسن Policy المبنية على Manifest تجربة المستخدم فقط وليست آلية فرض أمني. يمكن للمستخدم تعديل حالة المتصفح أو استدعاء API مباشرة. يجب على Backend أو Gateway إعادة تفويض كل عملية وإزالة الحقول والصفوف غير المصرح بها قبل serialization.
