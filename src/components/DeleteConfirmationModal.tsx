// src/components/DeleteConfirmationModal.tsx
import { type Component, createEffect, Show } from "solid-js";
import {
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  configToDelete,
  setConfigToDelete,
  setSavedConfigurations,
  currentConfigId,
  setCurrentConfigId,
  setCurrentConfigTitle,
  setCurrentOptions,
  // type Configuration, // Configuration type is implicitly handled by configToDelete()
} from "../store/optionsStore";
import { t } from "../i18n";

const DeleteConfirmationModal: Component = () => {
  let dialogRef: HTMLDialogElement | undefined;

  createEffect(() => {
    const isOpen = isDeleteConfirmOpen();
    if (dialogRef) {
      if (isOpen) {
        if (!dialogRef.hasAttribute("open")) {
          dialogRef.showModal();
        }
      } else {
        if (dialogRef.hasAttribute("open")) {
          dialogRef.close();
        }
      }
    }
    // No return needed if not using prevIsOpenState logic
  });

  const handleDialogNativeClose = () => {
    if (isDeleteConfirmOpen()) {
      // If modal was open and closed by ESC/backdrop
      setIsDeleteConfirmOpen(false); // Sync global state
      // configToDelete will be reset when modal is triggered again or explicitly on cancel/confirm
    }
  };

  const handleCancel = () => {
    setIsDeleteConfirmOpen(false);
    setConfigToDelete(null); // Also clear the config to delete on cancel
  };

  const handleConfirmDelete = () => {
    const config = configToDelete();
    if (config) {
      console.log(
        `[Delete Modal] Deleting configuration: "${config.title}" (ID: ${config.id})`,
      ); // Added log
      setSavedConfigurations((prev) => prev.filter((c) => c.id !== config.id));

      // If the deleted config was the currently active one, reset current config
      if (currentConfigId() === config.id) {
        setCurrentConfigId(null);
        setCurrentConfigTitle(t("home_page_default_title")); // Reset to default
        setCurrentOptions([]);
      }
    }
    setIsDeleteConfirmOpen(false);
    setConfigToDelete(null); // Clear after deletion
  };

  return (
    <dialog
      ref={dialogRef}
      id="delete_confirm_modal"
      class="modal modal-bottom sm:modal-middle"
      onClose={handleDialogNativeClose}
    >
      <div class="modal-box">
        <h3 class="font-bold text-lg text-error">{t("delete_modal_title")}</h3>

        <Show
          when={configToDelete()}
          fallback={
            /* Fallback for when configToDelete is null, though usually modal won't show then */
            <p class="py-4 text-base-content opacity-70">
              {t("common_loading_info")}{" "}
              {/* Or a more specific "No item selected" message */}
            </p>
          }
          keyed // Good for object stability if configToDelete changes identity but still truthy
        >
          {(
            config, // config here is guaranteed to be non-null
          ) => (
            <p class="py-4">
              {t("delete_modal_confirm_part1")}
              <strong class="text-warning mx-1">
                {" "}
                {/* Added margin for spacing */}
                {config.title || t("home_page_default_title")}
              </strong>
              {t("delete_modal_confirm_part2")}
              <br />
              {t("delete_modal_confirm_part3")}
            </p>
          )}
        </Show>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost" onClick={handleCancel}>
            {t("common_cancel")}
          </button>
          <button
            type="button"
            class="btn btn-error"
            onClick={handleConfirmDelete}
          >
            {t("delete_modal_confirm_button")}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button type="submit">{t("common_close")}</button>
      </form>
    </dialog>
  );
};

export default DeleteConfirmationModal;
