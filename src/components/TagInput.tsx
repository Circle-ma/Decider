// src/components/TagInput.tsx
import {
  type Component,
  type Accessor,
  createSignal,
  For,
  createMemo, // batchInputId 和 batchLabelId 仍會使用它
} from "solid-js";
import { t } from "../i18n";

interface TagInputProps {
  value: Accessor<string[]>;
  onChange: (newTags: string[]) => void;
  placeholder?: string;
  id?: string; // 主輸入框的 ID
}

const TagInput: Component<TagInputProps> = (props) => {
  const [singleInputValue, setSingleInputValue] = createSignal("");
  const [batchInputValue, setBatchInputValue] = createSignal("");

  // 移除了 const currentTags = createMemo(() => props.value());
  // 現在直接在需要的地方使用 props.value()

  const addSingleTagFromInput = () => {
    const trimmedTag = singleInputValue().trim();
    // 直接使用 props.value()
    if (trimmedTag && !props.value().includes(trimmedTag)) {
      props.onChange([...props.value(), trimmedTag]);
    }
    setSingleInputValue("");
  };

  const handleSingleInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSingleTagFromInput();
    }
  };

  const addTagsFromBatchText = () => {
    const lines = batchInputValue()
      .split(/[\n,;]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (lines.length === 0) {
      setBatchInputValue("");
      return;
    }

    const tagsToAdd = new Set<string>();
    // 直接使用 props.value()
    const existingTagsSet = new Set(props.value());

    for (const line of lines) {
      if (!existingTagsSet.has(line) && !tagsToAdd.has(line)) {
        tagsToAdd.add(line);
      }
    }

    if (tagsToAdd.size > 0) {
      // 直接使用 props.value()
      props.onChange([...props.value(), ...Array.from(tagsToAdd)]);
    }
    setBatchInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    // 直接使用 props.value()
    props.onChange(props.value().filter((tag) => tag !== tagToRemove));
  };

  const singleInputPlaceholder = () =>
    props.placeholder || t("tag_input_single_placeholder");

  // batchInputId 和 batchLabelId 依賴於 props.id，它們可以保持 createMemo
  // 因為 props.id 通常在組件實例的生命週期內是不變的
  const batchInputId = createMemo(() =>
    props.id ? `${props.id}-batch-input` : "batch-tag-input",
  );
  const batchLabelId = createMemo(() =>
    props.id ? `${props.id}-batch-label` : "batch-tag-label",
  );

  return (
    <div class="flex flex-col space-y-3 w-full">
      {/* 1. 已有標籤的展示區域 */}
      <div
        class="flex flex-wrap gap-2 p-2 border border-base-300 rounded-lg min-h-[2.5rem]"
        classList={{ "py-2": props.value().length > 0 }} // 直接使用 props.value()
      >
        <For
          each={props.value()} // 直接使用 props.value()
          fallback={
            <span class="text-sm text-base-content/70 px-1 self-center">
              {t("tag_input_no_options_yet")}
            </span>
          }
        >
          {(tag) => (
            <div class="badge badge-neutral gap-1.5 pr-1 items-center text-sm">
              <span>{tag}</span>
              <button
                type="button"
                aria-label={t("tag_input_remove_tag_aria", tag)}
                title={t("tag_input_remove_tag_aria", tag)}
                class="btn btn-xs btn-circle btn-ghost opacity-60 hover:opacity-100 focus:opacity-100"
                onClick={() => removeTag(tag)} // removeTag 內部已修改為使用 props.value()
              >
                ✕
              </button>
            </div>
          )}
        </For>
      </div>

      {/* 2. 單行輸入框 */}
      <input
        id={props.id || "single-tag-input"}
        type="text"
        value={singleInputValue()}
        onInput={(e) => setSingleInputValue(e.currentTarget.value)}
        onKeyDown={handleSingleInputKeyDown}
        placeholder={singleInputPlaceholder()}
        class="input input-bordered input-sm w-full"
      />

      {/* 3. 批量輸入區域 */}
      <div>
        <label id={batchLabelId()} for={batchInputId()} class="label pt-0 pb-1">
          <span class="label-text text-sm text-base-content/80">
            {t("tag_input_batch_label")}
          </span>
        </label>
        <textarea
          id={batchInputId()}
          aria-labelledby={batchLabelId()}
          class="textarea textarea-bordered w-full textarea-sm"
          rows="3"
          value={batchInputValue()}
          onInput={(e) => setBatchInputValue(e.currentTarget.value)}
          placeholder={t("tag_input_batch_placeholder")}
        ></textarea>
        <p class="text-xs text-base-content/60 mt-1 px-1">
          {t("tag_input_batch_hint", "使用換行、逗號或分號分隔選項")}
        </p>
        <button
          type="button"
          class="btn btn-sm btn-outline mt-2 w-full md:w-auto"
          onClick={addTagsFromBatchText}
          disabled={!batchInputValue().trim()}
        >
          {t("tag_input_batch_button")}
        </button>
      </div>
    </div>
  );
};

export default TagInput;
