// src/App.tsx
import { type Component, createEffect } from "solid-js";
import AppLayout from "./components/AppLayout";
import ConfigurationSettingsModal from "./components/ConfigurationSettingsModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import {
  savedConfigurations, // Signal for saved configurations
  storeInitializedAndDataLoaded, // Signal to know when initial load is done
  CONFIGURATIONS_STORAGE_KEY, // localStorage key for savedConfigurations
  currentLanguage,
  STORAGE_KEY_LANG,
  currentConfigId,
  setCurrentConfigId,
  STORAGE_KEY_CURRENT_CONFIG_ID,
  setCurrentConfigTitle,
  setCurrentOptions,
} from "./store/optionsStore";
import { t } from "./i18n";

const App: Component = () => {
  // --- Effect 1: localStorage 持久化 savedConfigurations ---
  createEffect(() => {
    const configsToSave = savedConfigurations(); // Dependency 1
    const isInitialized = storeInitializedAndDataLoaded(); // Dependency 2

    if (!isInitialized) {
      // console.log("[App.tsx Persist LS Configs] 初始化未完成，跳過儲存。");
      return;
    }

    // isInitialized is true, so any change to configsToSave should be persisted.
    // This also runs once when isInitialized becomes true, saving the freshly loaded (or initial empty) data.
    console.log(
      `[App.tsx Persist LS Configs] 偵測到變化，嘗試儲存 ${configsToSave.length} 個設定到 localStorage。`,
    );
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem(
          CONFIGURATIONS_STORAGE_KEY,
          JSON.stringify(configsToSave),
        );
        console.log(
          `%c[App.tsx Persist LS Configs] 成功將 ${configsToSave.length} 個設定儲存到 localStorage。`,
          "color: blue; font-weight: bold;", // Changed color for distinction
        );
      } catch (error) {
        console.error(
          "[App.tsx Persist LS Configs] 儲存設定到 localStorage 失敗:",
          error,
        );
      }
    } else {
      console.warn(
        "[App.tsx Persist LS Configs] localStorage 不可用，無法儲存設定檔。",
      );
    }
  });

  // --- Effect 2: localStorage 持久化 currentLanguage --- (保持不變)
  createEffect(() => {
    const lang = currentLanguage();
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    }
  });

  // --- Effect 3: localStorage 持久化 currentConfigId --- (保持不變)
  createEffect(() => {
    const id = currentConfigId();
    if (typeof window !== "undefined" && window.localStorage) {
      if (id === null) {
        localStorage.removeItem(STORAGE_KEY_CURRENT_CONFIG_ID);
      } else {
        localStorage.setItem(STORAGE_KEY_CURRENT_CONFIG_ID, id);
      }
    }
  });

  // --- Effect 4: 主題恢復 (Hydration) --- (邏輯保持不變, 依賴的 signals 來源已改變)
  createEffect(() => {
    const isDataLoaded = storeInitializedAndDataLoaded();
    const idToLoad = currentConfigId();
    const configs = savedConfigurations(); // Now sourced from localStorage via initializeConfigurations

    if (!isDataLoaded) return;

    if (idToLoad) {
      const configToSelect = configs.find((c) => c.id === idToLoad);
      if (configToSelect) {
        setCurrentConfigTitle(configToSelect.title);
        setCurrentOptions([...configToSelect.options]);
      } else {
        setCurrentConfigId(null);
        setCurrentConfigTitle(t("home_page_default_title"));
        setCurrentOptions([]);
      }
    } else {
      setCurrentConfigTitle(t("home_page_default_title"));
      setCurrentOptions([]);
    }
  });

  return (
    <>
      <AppLayout />
      <ConfigurationSettingsModal />
      <DeleteConfirmationModal />
    </>
  );
};

export default App;
