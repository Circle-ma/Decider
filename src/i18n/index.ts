// src/i18n/index.ts
import { createMemo, createRoot } from "solid-js"; // <-- 引入 createRoot 和 onCleanup
import { currentLanguage } from "../store/optionsStore";
import { zhTranslations, type TranslationKeys } from "../locales/zh";
import { enTranslations } from "../locales/en";

const dictionaries: Record<string, Record<TranslationKeys, string>> = {
  zh: zhTranslations,
  en: enTranslations,
};

const FALLBACK_LANGUAGE: "zh" | "en" = "zh";

// 使用 createRoot 包裹 createMemo 以管理其生命週期並消除警告
const currentDictionary = createRoot(() => {
  // onCleanup(dispose); // 如果 i18n 模塊本身可能被卸載，則需要 onCleanup。對於全局 store 通常不需要。
  return createMemo(() => {
    const lang = currentLanguage();
    // console.log(`[i18n] Dictionary updated for language: ${lang}`); // 可選調試日誌
    return dictionaries[lang] || dictionaries[FALLBACK_LANGUAGE];
  });
});

export const t = (
  key: TranslationKeys,
  ...args: (string | number)[]
): string => {
  const dictionary = currentDictionary(); // 這裡調用的是 memoized signal
  let translation = dictionary[key];

  if (translation === undefined) {
    if (import.meta.env.DEV) {
      console.warn(
        `[i18n] Missing translation for key: "${key}" in language "${currentLanguage()}"`,
      );
    }
    translation = String(key);
  }

  if (args.length > 0) {
    args.forEach((arg, index) => {
      const placeholder = new RegExp(`\\{${index}\\}`, "g");
      translation = translation!.replace(placeholder, String(arg));
    });
  }
  return translation!;
};
