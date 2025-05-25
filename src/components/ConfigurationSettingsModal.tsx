// src/components/ConfigurationSettingsModal.tsx
import { type Component, createSignal, createEffect } from "solid-js";
import {
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  currentConfigId,
  setCurrentConfigId,
  currentConfigTitle,
  setCurrentConfigTitle,
  currentOptions,
  setCurrentOptions,
  setSavedConfigurations,
  type Configuration,
} from "../store/optionsStore";
import TagInput from "./TagInput";
import { t } from "../i18n";
import { v4 as uuidv4 } from "uuid";

const ConfigurationSettingsModal: Component = () => {
  let dialogRef: HTMLDialogElement | undefined;
  const [localTitle, setLocalTitle] = createSignal<string>("");
  const [localOptions, setLocalOptions] = createSignal<string[]>([]);

  // Effect to control dialog visibility and sync global state to local state when opening
  createEffect((prevIsOpen) => {
    const isOpen = isSettingsModalOpen();
    if (dialogRef) {
      if (isOpen) {
        // 當 Modal 從關閉變為開啟狀態時，從全局狀態初始化本地狀態
        // prevIsOpen 在首次執行時為 undefined (如果 defer:true) 或初始值 (如此處的 false)
        // 此處的 prevIsOpen 是上一次 effect return 的 isOpen 值
        if (
          prevIsOpen === false ||
          prevIsOpen === undefined /* 適用於首次且 isOpen 為 true */
        ) {
          setLocalTitle(currentConfigTitle());
          setLocalOptions([...currentOptions()]); // 創建新陣列副本
        }
        if (!dialogRef.hasAttribute("open")) {
          dialogRef.showModal();
        }
      } else {
        if (dialogRef.hasAttribute("open")) {
          dialogRef.close();
        }
      }
    }
    return isOpen; // 返回當前開啟狀態，供下次 prevIsOpen 使用
  }, false); // 初始 prevIsOpen 為 false

  const handleDialogNativeClose = () => {
    // 當通過 ESC 或點擊背景關閉時
    if (isSettingsModalOpen()) {
      setIsSettingsModalOpen(false); // 同步全局狀態
    }
  };

  const handleCancel = () => {
    setIsSettingsModalOpen(false);
  };

  const handleSaveAndClose = () => {
    const titleToSave = localTitle().trim() || t("home_page_default_title");
    const optionsToSave = localOptions()
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);
    const existingId = currentConfigId();

    console.log(
      `%c[Modal Save] Action: ${existingId ? "Edit" : "Add"}. Title: "${titleToSave}"`,
      "color: blue; font-weight: bold;",
    );

    if (existingId) {
      setSavedConfigurations((prevConfigs) =>
        prevConfigs.map((config) =>
          config.id === existingId
            ? { ...config, title: titleToSave, options: optionsToSave }
            : config,
        ),
      );
      if (currentConfigId() === existingId) {
        // 如果正在編輯的就是當前主題，則同步更新當前主題的 signals
        setCurrentConfigTitle(titleToSave);
        setCurrentOptions(optionsToSave);
      }
    } else {
      const newId = uuidv4();
      const newConfig: Configuration = {
        id: newId,
        title: titleToSave,
        options: optionsToSave,
      };
      setSavedConfigurations((prevConfigs) => [...prevConfigs, newConfig]);
      setCurrentConfigId(newId); // 新增後，將新主題設為當前主題
      setCurrentConfigTitle(titleToSave);
      setCurrentOptions(optionsToSave);
    }
    setIsSettingsModalOpen(false);
  };

  return (
    <dialog
      ref={dialogRef}
      id="settings_config_modal"
      class="modal modal-bottom sm:modal-middle"
      onClose={handleDialogNativeClose}
    >
      <div class="modal-box space-y-6">
        {" "}
        {/* 使用 space-y 來自動管理子元素垂直間距 */}
        <h3 class="font-bold text-xl text-base-content">
          {" "}
          {/* 調整了字型大小和顏色 */}
          {currentConfigId()
            ? t("config_modal_edit_title")
            : t("config_modal_add_title")}
        </h3>
        {/* 主題輸入 */}
        <div class="form-control w-full">
          <label class="label" for="config-title-input">
            <span class="label-text text-base-content/90">
              {t("config_modal_topic_label")}
            </span>{" "}
            {/* 調整了 label 透明度 */}
          </label>
          <input
            id="config-title-input"
            type="text"
            placeholder={t("config_modal_topic_placeholder")}
            class="input input-bordered w-full"
            value={localTitle()}
            onInput={(e) => setLocalTitle(e.currentTarget.value)}
          />
        </div>
        {/* 選項輸入 */}
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text text-base-content/90">
              {t("config_modal_options_label")}
            </span>
          </label>
          <TagInput
            value={localOptions}
            onChange={setLocalOptions}
            placeholder={t("tag_input_single_placeholder")}
          />
        </div>
        {/* 操作按鈕 */}
        <div class="modal-action mt-2">
          {" "}
          {/* 調整了與上方元素的間距 */}
          <button type="button" class="btn btn-ghost" onClick={handleCancel}>
            {t("common_cancel")}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            onClick={handleSaveAndClose}
            // 當標題為空或回到預設標題 (且不是編輯模式下故意清空) 時，且沒有選項時，可以考慮禁用保存
            // disabled={(!localTitle().trim() || localTitle().trim() === t("home_page_default_title")) && localOptions().length === 0}
          >
            {t("common_save_and_close")}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button type="submit">{t("common_close")}</button>
      </form>
    </dialog>
  );
};

export default ConfigurationSettingsModal;
