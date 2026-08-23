export type SHDirection = 'ltr' | 'rtl';
export interface SHLocalePack {
  code: string;
  direction: SHDirection;
  messages: Record<string, string>;
}
export const enUS: SHLocalePack = {
  code: 'en-US',
  direction: 'ltr',
  messages: {
    'common.loading': 'Loading',
    'common.empty': 'No data',
    'common.retry': 'Retry',
    'policy.denied': 'Access denied',
    'policy.pending': 'Checking access',
  },
};
export const faIR: SHLocalePack = {
  code: 'fa-IR',
  direction: 'rtl',
  messages: {
    'common.loading': 'در حال بارگذاری',
    'common.empty': 'داده‌ای وجود ندارد',
    'common.retry': 'تلاش مجدد',
    'policy.denied': 'دسترسی مجاز نیست',
    'policy.pending': 'در حال بررسی دسترسی',
  },
};
export const ar: SHLocalePack = {
  code: 'ar',
  direction: 'rtl',
  messages: {
    'common.loading': 'جارٍ التحميل',
    'common.empty': 'لا توجد بيانات',
    'common.retry': 'إعادة المحاولة',
    'policy.denied': 'الوصول مرفوض',
    'policy.pending': 'جارٍ التحقق من الوصول',
  },
};
export const builtinLocales = { 'en-US': enUS, 'fa-IR': faIR, ar } as const;
const digitMap: Record<string, string> = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};
export const normalizeSHDigits = (value: string): string =>
  value.replace(/[۰-۹٠-٩]/g, (digit) => digitMap[digit] ?? digit);
export interface SHDateAdapter {
  format(value: Date, options?: Intl.DateTimeFormatOptions): string;
}
export const createIntlDateAdapter = (
  locale: string,
  calendar?: 'gregory' | 'persian',
): SHDateAdapter => ({
  format: (value, options) =>
    new Intl.DateTimeFormat(calendar ? `${locale}-u-ca-${calendar}` : locale, options).format(
      value,
    ),
});
