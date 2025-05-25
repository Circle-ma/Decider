// src/locales/en.ts
import type { TranslationKeys } from "./zh";

export const enTranslations: Record<TranslationKeys, string> = {
  // --- Common ---
  app_title: "Decision Helper",
  common_cancel: "Cancel",
  common_save_and_close: "Save & Close",
  common_confirm_delete: "Confirm Delete",
  common_options: "Options",
  common_loading_info: "Loading information...",
  common_close: "Close",

  // --- AppLayout (Drawer) ---
  drawer_menu_title_configs: "My Topics",
  drawer_add_new_config: "Start New Topic",
  drawer_menu_title_saved_configs: "All Topics",
  drawer_no_saved_configs: "It's empty here, start your first topic!",
  drawer_menu_title_other: "Others",
  drawer_explore: "Explore",
  drawer_explore_wip:
    "'Explore More' is on its way, please look forward to it!",
  drawer_config_item_delete_aria: "Delete topic {title}",
  drawer_config_item_delete_confirm_title: "Really Say Goodbye?",
  drawer_language_settings_title: "Language",
  drawer_open_sidebar_aria: "Open sidebar",
  drawer_close_sidebar_aria: "Close sidebar",

  // --- HomePage ---
  home_page_default_title: "What's this topic called?",
  home_page_decision_tool_area_title: "Props for Fate",
  home_page_decision_tool_area_desc:
    "(Magical roulette or card flip, coming soon!)",
  home_page_result_area_title: "Fate's Instruction",
  home_page_result_area_desc: "(Let's see what answer the universe gives you!)",
  home_page_decide_button: "Decide for Me!",
  home_page_deciding_in_progress: "Making a choice for you...",
  home_page_no_options_to_decide:
    "Please provide at least two options to start!",
  home_page_not_enough_options_to_decide:
    "At least two options are needed to make a decision",
  home_page_decision_result_label: "Fate has chosen:",

  // --- ConfigurationSettingsModal ---
  config_modal_title: "Edit Topic & Options",
  config_modal_edit_title: "Edit Topic",
  config_modal_add_title: "Add New Topic",
  config_modal_topic_label: "What's this topic about?",
  config_modal_topic_placeholder:
    "e.g., What to eat for lunch? Which movie for the weekend?",
  config_modal_options_label: "What are the options? (Press Enter to add)",
  config_modal_settings_aria_label: "Settings",

  // --- TagInput ---
  tag_input_no_options: "Haven't decided on the options yet?",
  tag_input_no_options_yet: "No options added yet",
  tag_input_single_placeholder: "Add whatever comes to mind...",
  tag_input_batch_label: "Or, list them all at once (one per line):",
  tag_input_batch_placeholder: "Food Item 1\nFood Item 2\nPlace to Visit...",
  tag_input_batch_button: "Add These All!",
  tag_input_remove_tag_aria: "Remove {tag}",
  tag_input_batch_hint:
    "Tip: Use Enter, comma (,) or semicolon (;) to separate options", // <-- Added

  // --- DeleteConfirmationModal ---
  delete_modal_title: "Really Say Goodbye?",
  delete_modal_confirm_message:
    'Are you sure you want to completely forget the topic "<strong>{title}</strong>"?<br />Once deleted, it cannot be retrieved!',
  delete_modal_confirm_button: "Yes, Delete It",
  delete_modal_confirm_part1:
    'Are you sure you want to permanently delete the topic "',
  delete_modal_confirm_part2: '"?',
  delete_modal_confirm_part3: "This action cannot be undone.",
  drawer_theme_settings_title: "Theme",
  drawer_theme_toggle_aria: "Toggle theme",
  drawer_switch_to_dark_theme: "Switch to Dark Mode",
  drawer_switch_to_light_theme: "Switch to Light Mode",
};
