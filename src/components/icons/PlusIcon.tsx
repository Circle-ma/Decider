// src/components/icons/PlusIcon.tsx
import { type Component } from "solid-js";

const PlusIcon: Component<{ class?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2" // 通常 stroke-width 寫在 path 上或直接用 CSS 控制，但也可放這裡
      stroke="currentColor" // 使用 currentColor 可以讓 SVG 繼承文字顏色
      class={`w-5 h-5 ${props.class || ""}`} // 預設 w-5 h-5，允許外部 class 覆蓋或添加
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
};

export default PlusIcon;
