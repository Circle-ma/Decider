// src/components/AppLayout.tsx
import { type Component, For, Show } from "solid-js";
import {
  isDrawerOpen,
  setIsDrawerOpen,
  setIsSettingsModalOpen,
  savedConfigurations,
  setCurrentConfigId,
  setCurrentConfigTitle,
  setCurrentOptions,
  type Configuration,
  setIsDeleteConfirmOpen,
  setConfigToDelete,
  currentLanguage,
  setCurrentLanguage,
  currentTheme, // <-- 新增導入
  setCurrentTheme,
} from "../store/optionsStore";
import { t } from "../i18n";
import HomePage from "../pages/HomePage";
import HamburgerIcon from "./icons/HamburgerIcon";
import SettingsIcon from "./icons/SettingsIcon";
import PlusIcon from "./icons/PlusIcon";
import TrashIcon from "./icons/TrashIcon";
import SearchIcon from "./icons/SearchIcon";
import SunIcon from "./icons/SunIcon"; // <-- 新增導入
import MoonIcon from "./icons/MoonIcon"; // <-- 新增導入

const AppLayout: Component = () => {
  const drawerId = "app-main-drawer";

  const handleAddNewConfiguration = () => {
    setCurrentConfigId(null);
    setCurrentConfigTitle(t("home_page_default_title"));
    setCurrentOptions([]);
    setIsSettingsModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleLoadConfiguration = (configToLoad: Configuration) => {
    if (configToLoad) {
      setCurrentConfigId(configToLoad.id);
      setCurrentConfigTitle(configToLoad.title);
      setCurrentOptions([...configToLoad.options]);
      setIsDrawerOpen(false);
    }
  };

  const requestDeleteConfiguration = (
    config: Configuration,
    event: MouseEvent,
  ) => {
    event.stopPropagation();
    setConfigToDelete(config);
    setIsDeleteConfirmOpen(true);
  };

  const switchLanguage = (lang: "zh" | "en") => {
    setCurrentLanguage(lang);
  };

  const toggleTheme = () => {
    setCurrentTheme(currentTheme() === "light" ? "dark" : "light");
  };

  return (
    <div class="drawer">
      <input
        id={drawerId}
        type="checkbox"
        class="drawer-toggle"
        checked={isDrawerOpen()}
        onChange={(e) =>
          setIsDrawerOpen((e.currentTarget as HTMLInputElement).checked)
        }
      />
      <div class="drawer-content flex flex-col h-screen">
        {/* 簡化的頂部操作區域: 透明背景，抽屜打開時按鈕隱藏 */}
        <div class="w-full flex justify-between items-center p-2 sticky top-0 z-10">
          {" "}
          {/* z-10 使其在滾動內容之上，但會被抽屜(z-50)覆蓋 */}
          <label
            for={drawerId}
            aria-label={t("drawer_open_sidebar_aria")}
            class="btn btn-square btn-ghost"
            // 當抽屜打開時，漢堡按鈕變為不可見
            // Tailwind 'invisible' class sets 'visibility: hidden;'
            classList={{ invisible: isDrawerOpen() }}
          >
            <HamburgerIcon />
          </label>
          <button
            class="btn btn-square btn-ghost"
            aria-label={t("config_modal_settings_aria_label")}
            // 當抽屜打開時，設定按鈕也變為不可見，以保持一致性
            classList={{ invisible: isDrawerOpen() }}
            onClick={() => {
              setIsSettingsModalOpen(true);
            }}
          >
            <SettingsIcon />
          </button>
        </div>

        {/* 頁面內容 */}
        <main class="flex-grow p-4 overflow-y-auto">
          <HomePage />
        </main>
      </div>

      {/* 抽屜側邊欄 (DaisyUI 預設 z-index 較高，會覆蓋 z-10 的頂部欄) */}
      <div class="drawer-side">
        {" "}
        {/* 預設 z-index 應為 50 */}
        <label
          for={drawerId}
          aria-label={t("drawer_close_sidebar_aria")}
          class="drawer-overlay" // 預設 z-index 應為 40
        ></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* ... 原來的抽屜菜單項 ... */}
          <li class="menu-title">
            <span>{t("drawer_menu_title_configs")}</span>
          </li>
          <li>
            <button
              class="flex items-center py-2 px-3 hover:bg-base-300/60 rounded-lg w-full text-left"
              onClick={handleAddNewConfiguration}
            >
              <PlusIcon class="h-5 w-5 mr-2 shrink-0" />
              {t("drawer_add_new_config")}
            </button>
          </li>
          {/* ... (省略其他菜單項，保持和您之前的版本一致) ... */}
          <div class="divider my-2 before:h-[0.5px] after:h-[0.5px]"></div>
          <li class="menu-title mt-1">
            <span>{t("drawer_menu_title_saved_configs")}</span>
          </li>
          <Show
            when={savedConfigurations().length > 0}
            fallback={
              <li class="px-3 py-2 text-sm opacity-60">
                {t("drawer_no_saved_configs")}
              </li>
            }
          >
            <For each={savedConfigurations()}>
              {(config) => (
                <li>
                  <div class="flex items-center justify-between w-full group hover:bg-base-300/60 rounded-lg">
                    <button
                      class="flex-grow block truncate py-2 pl-3 pr-1 text-left"
                      title={config.title}
                      onClick={() => handleLoadConfiguration(config)}
                    >
                      {config.title || t("home_page_default_title")}
                    </button>
                    <button
                      class="btn btn-xs btn-circle btn-ghost text-error opacity-50 group-hover:opacity-100 focus:opacity-100 p-1 mr-1 shrink-0"
                      aria-label={t(
                        "drawer_config_item_delete_aria",
                        config.title || t("home_page_default_title"),
                      )}
                      title={t(
                        "drawer_config_item_delete_aria",
                        config.title || t("home_page_default_title"),
                      )}
                      onClick={(e) => requestDeleteConfiguration(config, e)}
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </li>
              )}
            </For>
          </Show>
          <div class="divider my-4"></div>
          <li class="menu-title">
            <span>{t("drawer_language_settings_title")}</span>
          </li>
          <li>
            <button
              class="flex items-center py-2 px-3 hover:bg-base-300/60 rounded-lg w-full text-left"
              classList={{
                "font-bold text-primary": currentLanguage() === "en",
              }}
              onClick={() => switchLanguage("en")}
            >
              English
            </button>
          </li>
          <li>
            <button
              class="flex items-center py-2 px-3 hover:bg-base-300/60 rounded-lg w-full text-left"
              classList={{
                "font-bold text-primary": currentLanguage() === "zh",
              }}
              onClick={() => switchLanguage("zh")}
            >
              中文
            </button>
          </li>

          {/* --- 新增：主題切換器 --- */}
          <div class="divider my-4"></div>
          <li class="menu-title">
            <span>{t("drawer_theme_settings_title")}</span>{" "}
            {/* 需要添加 i18n key */}
          </li>
          <li>
            <button
              class="flex items-center py-2 px-3 hover:bg-base-300/60 rounded-lg w-full text-left"
              onClick={toggleTheme}
              aria-label={t("drawer_theme_toggle_aria")} /* 需要添加 i18n key */
            >
              <Show
                when={currentTheme() === "dark"}
                fallback={
                  <SunIcon class="h-5 w-5 mr-2 shrink-0" />
                } /* 淺色模式時顯示太陽圖示，提示可切換到深色 */
              >
                <MoonIcon class="h-5 w-5 mr-2 shrink-0" />{" "}
                {/* 深色模式時顯示月亮圖示，提示可切換到淺色 */}
              </Show>
              <span>
                {
                  currentTheme() === "light"
                    ? t("drawer_switch_to_dark_theme") /* 需要添加 i18n key */
                    : t("drawer_switch_to_light_theme") /* 需要添加 i18n key */
                }
              </span>
            </button>
          </li>
          {/* --- 結束新增 --- */}

          <div class="divider my-4"></div>
          <li class="menu-title">
            <span>{t("drawer_menu_title_other")}</span>
          </li>
          <li>
            <button
              class="flex items-center py-2 px-3 hover:bg-base-300/60 rounded-lg w-full text-left"
              onClick={() => alert(t("drawer_explore_wip"))}
            >
              <SearchIcon class="h-5 w-5 mr-2 shrink-0" />
              {t("drawer_explore")}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AppLayout;
