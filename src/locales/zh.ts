// src/locales/zh.ts
export const zhTranslations = {
  // --- 通用 ---
  app_title: "選擇困難解決方案",
  common_cancel: "取消",
  common_save_and_close: "儲存並關閉",
  common_confirm_delete: "確認刪除",
  common_options: "選項",
  common_loading_info: "正在加載資訊...",
  common_close: "關閉",

  // --- AppLayout (抽屜) ---
  drawer_menu_title_configs: "我的主題",
  drawer_add_new_config: "開啟新主題",
  drawer_menu_title_saved_configs: "所有主題",
  drawer_no_saved_configs: "這裡空空如也，開始你的第一個主題吧！",
  drawer_menu_title_other: "其他",
  drawer_explore: "探索",
  drawer_explore_wip: "「探索更多」正在來的路上，敬請期待！",
  drawer_config_item_delete_aria: "刪除主題 {title}",
  drawer_config_item_delete_confirm_title: "真的要說再見嗎？",
  drawer_language_settings_title: "語言設定",
  drawer_open_sidebar_aria: "開啟側邊欄",
  drawer_close_sidebar_aria: "關閉側邊欄",

  // --- HomePage ---
  home_page_default_title: "這個主題叫什麼呢？",
  home_page_decision_tool_area_title: "交給命運的小道具",
  home_page_decision_tool_area_desc: "(神奇輪盤或翻牌，即將登場！)",
  home_page_result_area_title: "命運的指示",
  home_page_result_area_desc: "(看看宇宙會給你什麼答案！)",
  home_page_decide_button: "幫我做決定！",
  home_page_deciding_in_progress: "正在為您選擇中...",
  home_page_no_options_to_decide: "至少需要提供兩個選項才能開始喔！",
  home_page_not_enough_options_to_decide: "至少需要兩個選項才能進行抉擇",
  home_page_decision_result_label: "命運的選擇是：",

  // --- ConfigurationSettingsModal ---
  config_modal_title: "編輯主題與選項",
  config_modal_edit_title: "編輯主題",
  config_modal_add_title: "新增主題",
  config_modal_topic_label: "這個主題關於？",
  config_modal_topic_placeholder: "例如：今天午餐吃什麼？週末看哪部電影？",
  config_modal_options_label: "有哪些選項呢？(按 Enter 新增)",
  config_modal_settings_aria_label: "設定",

  // --- TagInput ---
  tag_input_no_options: "還沒想好有哪些選項嗎？",
  tag_input_no_options_yet: "尚未添加任何選項",
  tag_input_single_placeholder: "想到什麼，就加點什麼...",
  tag_input_batch_label: "或者，一次全都列出來 (每行一個):",
  tag_input_batch_placeholder: "美食1\n美食2\n想去的地方...",
  tag_input_batch_button: "一次加入這些！",
  tag_input_remove_tag_aria: "移除 {tag}",
  tag_input_batch_hint: "提示：可使用換行、逗號 (,) 或分號 (;) 分隔多個選項", // <-- 新增

  // --- DeleteConfirmationModal ---
  delete_modal_title: "真的要說再見嗎？",
  delete_modal_confirm_message:
    '你確定要把主題 "<strong>{title}</strong>" 徹底忘掉嗎？<br />一旦刪除，就找不回來囉！',
  delete_modal_confirm_button: "狠心刪除",
  delete_modal_confirm_part1: '您確定要永久刪除主題 "',
  delete_modal_confirm_part2: '" 嗎？',
  delete_modal_confirm_part3: "此操作無法復原。",
};

export type TranslationKeys = keyof typeof zhTranslations;
