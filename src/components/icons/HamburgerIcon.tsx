// src/components/icons/HamburgerIcon.tsx
import { type Component } from "solid-js";

const HamburgerIcon: Component<{ class?: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      // 可以接收外部傳入的 class，並與預設 class 合併
      class={`inline-block w-6 h-6 stroke-current ${props.class || ""}`}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      ></path>
    </svg>
  );
};

export default HamburgerIcon;
