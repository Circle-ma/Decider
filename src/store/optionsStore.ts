// src/store/optionsStore.ts
import { createSignal } from "solid-js";
// Removed: import { Store } from "@tauri-apps/plugin-store";

export interface Configuration {
  id: string;
  title: string;
  options: string[];
}

// Key for localStorage where savedConfigurations will be stored
export const CONFIGURATIONS_STORAGE_KEY =
  "decision_helper_saved_configurations_v1"; // Changed from CONFIGURATIONS_STORE_KEY
// Removed: const STORE_FILENAME

export const STORAGE_KEY_LANG = "decision_helper_lang_v1";
export const STORAGE_KEY_CURRENT_CONFIG_ID =
  "decision_helper_current_config_id_v1";
export const STORAGE_KEY_THEME = "decision_helper_theme_v1";

console.log(
  "[Store Init] optionsStore.ts 模塊開始執行 (using localStorage for configurations).",
);

// Removed: configurationsStorePromise

// --- 全域 Signals ---
export const [isDrawerOpen, setIsDrawerOpen] = createSignal<boolean>(false);
export const [isSettingsModalOpen, setIsSettingsModalOpen] =
  createSignal<boolean>(false);

const getInitialCurrentConfigId = (): string | null => {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem(STORAGE_KEY_CURRENT_CONFIG_ID);
  }
  return null;
};
export const [currentConfigId, setCurrentConfigId] = createSignal<
  string | null
>(getInitialCurrentConfigId());

export const [currentConfigTitle, setCurrentConfigTitle] =
  createSignal<string>("");
export const [currentOptions, setCurrentOptions] = createSignal<string[]>([]);
export const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
  createSignal<boolean>(false);
export const [configToDelete, setConfigToDelete] =
  createSignal<Configuration | null>(null);

export const [savedConfigurations, setSavedConfigurations] = createSignal<
  Configuration[]
>([]);
export const [storeInitializedAndDataLoaded, setStoreInitializedAndDataLoaded] =
  createSignal<boolean>(false); // Still useful to gate hydration and initial save

const getInitialLanguage = (): "zh" | "en" => {
  if (typeof window !== "undefined" && window.localStorage) {
    const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
    if (savedLang === "en" || savedLang === "zh") return savedLang;
  }
  return "en";
};
export const [currentLanguage, setCurrentLanguage] = createSignal<"zh" | "en">(
  getInitialLanguage(),
);

// --- 新增：初始主題狀態 ---
const getInitialTheme = (): string => {
  if (typeof window !== "undefined" && window.localStorage) {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    // 這裡可以添加驗證，確保 savedTheme 是您已定義的有效主題之一
    // 例如: if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return savedTheme || "light"; // 默認為 'light' 主題
  }
  return "light"; // 默認主題
};
export const [currentTheme, setCurrentTheme] =
  createSignal<string>(getInitialTheme());
// --- 結束新增 ---

// --- Initialize Configurations from localStorage ---
function initializeConfigurations() {
  console.log("[LocalStorage Load] initializeConfigurations 函數開始執行。");
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const storedDataString = localStorage.getItem(CONFIGURATIONS_STORAGE_KEY);
      if (storedDataString) {
        const storedData = JSON.parse(storedDataString) as Configuration[];
        if (Array.isArray(storedData)) {
          setSavedConfigurations(storedData);
          console.log(
            `[LocalStorage Load] 已從 localStorage 成功加載 ${storedData.length} 個設定檔。`,
          );
        } else {
          setSavedConfigurations([]);
          console.warn(
            "[LocalStorage Load] localStorage 中找到的設定檔格式不符，已使用空列表初始化。",
          );
        }
      } else {
        setSavedConfigurations([]);
        console.log(
          "[LocalStorage Load] localStorage 中未找到設定檔，已使用空列表初始化。",
        );
      }
    } catch (error) {
      console.error(
        "[LocalStorage Load] 從 localStorage 加載設定檔時出錯:",
        error,
      );
      setSavedConfigurations([]); // 出錯時確保有初始值
    }
  } else {
    console.warn(
      "[LocalStorage Load] localStorage 不可用。設定檔將僅在記憶體中運行。",
    );
    setSavedConfigurations([]); // localStorage 不可用時也確保有初始值
  }
  setStoreInitializedAndDataLoaded(true); // Signal that initial data loading attempt is complete
  console.log(
    "[LocalStorage Load] initializeConfigurations 函數執行完畢。storeInitializedAndDataLoaded 已設為 true。",
  );
}

initializeConfigurations(); // Execute initialization
