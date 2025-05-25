// src/pages/HomePage.tsx
import {
  type Component,
  createSignal,
  Show,
  For,
  createEffect,
  on,
  createMemo,
} from "solid-js";
import {
  currentConfigTitle,
  currentOptions,
  currentConfigId,
} from "../store/optionsStore";
import { t } from "../i18n";

const HomePage: Component = () => {
  const [finalSelectedOption, setFinalSelectedOption] = createSignal<
    string | null
  >(null);
  const [isDeciding, setIsDeciding] = createSignal<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = createSignal<number | null>(
    null,
  );

  let animationTimeoutId: number | undefined;
  let scrollContainerRef: HTMLDivElement | undefined;
  const optionItemRefs: (HTMLDivElement | undefined)[] = [];

  const resetUIStateForNewConfig = () => {
    setFinalSelectedOption(null);
    setIsDeciding(false);
    setHighlightedIndex(null);
    if (animationTimeoutId) clearTimeout(animationTimeoutId);
    optionItemRefs.length = 0;
    if (scrollContainerRef) {
      scrollContainerRef.scrollLeft = 0;
    }
  };

  createEffect(on(currentConfigId, resetUIStateForNewConfig, { defer: true }));

  createEffect(
    on(
      highlightedIndex,
      (hIndex) => {
        if (isDeciding() && hIndex !== null && scrollContainerRef) {
          const activeItem = optionItemRefs[hIndex];
          if (activeItem) {
            activeItem.scrollIntoView({
              behavior: "auto",
              block: "nearest",
              inline: "center",
            });
          }
        }
      },
      { defer: true },
    ),
  );

  // --- 動畫參數設定 ---
  const animationConfig = {
    initialDelay: 200, // 初始延遲 (ms) - 稍慢啟動
    peakDelay: 50, // 最快轉動延遲 (ms)
    finalRampDownDelayIncrement: 25, // 最後減速時，每次延遲增加量
    minCyclesAtPeakSpeed: 2, // 最快速度至少完整轉動幾圈
    decelerationStartCycles: 1.5, // 倒數幾圈開始減速
  };

  const handleDecide = () => {
    const options = currentOptions();
    if (options.length < 2) {
      const singleOptionIndex = options.length === 1 ? 0 : null;
      setFinalSelectedOption(
        singleOptionIndex !== null ? options[singleOptionIndex] : null,
      );
      setHighlightedIndex(singleOptionIndex);
      if (singleOptionIndex !== null) {
        const activeItem = optionItemRefs[singleOptionIndex];
        if (activeItem) {
          activeItem.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
      setIsDeciding(false);
      return;
    }

    setIsDeciding(true);
    setFinalSelectedOption(null);
    if (animationTimeoutId) clearTimeout(animationTimeoutId);

    const numOptions = options.length;
    const finalChoiceIndex = Math.floor(Math.random() * numOptions);

    let currentAnimatedIndex =
      highlightedIndex() !== null
        ? highlightedIndex()!
        : Math.floor(Math.random() * numOptions);
    let currentDelay = animationConfig.initialDelay;

    const totalCycles =
      animationConfig.minCyclesAtPeakSpeed +
      animationConfig.decelerationStartCycles +
      1;
    let itemsToHighlightTotal = Math.floor(totalCycles * numOptions);
    itemsToHighlightTotal =
      itemsToHighlightTotal -
      (itemsToHighlightTotal % numOptions) +
      finalChoiceIndex;
    if (itemsToHighlightTotal < numOptions * 2) {
      itemsToHighlightTotal += numOptions;
    }

    let itemsHighlightedCount = 0;
    const decelerationStartPoint =
      itemsToHighlightTotal -
      Math.floor(animationConfig.decelerationStartCycles * numOptions);
    const accelerationEndPoint = numOptions;

    const animate = () => {
      itemsHighlightedCount++;
      currentAnimatedIndex = (currentAnimatedIndex + 1) % numOptions;
      setHighlightedIndex(currentAnimatedIndex);

      if (itemsHighlightedCount < accelerationEndPoint) {
        const progress = itemsHighlightedCount / accelerationEndPoint;
        currentDelay =
          animationConfig.initialDelay -
          (animationConfig.initialDelay - animationConfig.peakDelay) * progress;
      } else if (itemsHighlightedCount >= decelerationStartPoint) {
        currentDelay += animationConfig.finalRampDownDelayIncrement;
      } else {
        currentDelay = animationConfig.peakDelay;
      }
      currentDelay = Math.max(animationConfig.peakDelay, currentDelay);

      if (itemsHighlightedCount < itemsToHighlightTotal) {
        animationTimeoutId = setTimeout(animate, currentDelay);
      } else {
        setHighlightedIndex(finalChoiceIndex);
        setFinalSelectedOption(options[finalChoiceIndex]);
        setIsDeciding(false);
        const finalItemRef = optionItemRefs[finalChoiceIndex];
        if (finalItemRef) {
          finalItemRef.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    };

    setHighlightedIndex(currentAnimatedIndex);
    animate();
  };

  const decideButtonDisabled = () => currentOptions().length === 0;

  const optionToDisplayInResult = createMemo(() => {
    const deciding = isDeciding();
    const hIndex = highlightedIndex();
    const finalOpt = finalSelectedOption();
    const options = currentOptions();
    if (deciding && hIndex !== null && hIndex >= 0 && hIndex < options.length) {
      return options[hIndex];
    } else if (!deciding && finalOpt) {
      return finalOpt;
    }
    return null;
  });

  return (
    <div class="flex flex-col items-center justify-start w-full h-full px-2 sm:px-4 pt-2 overflow-y-hidden">
      {/* 1. 標題區域 */}
      <div class="my-6 sm:my-8 text-center">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-semibold break-words hyphens-auto">
          {currentConfigTitle() || t("home_page_default_title")}
        </h1>
      </div>

      {/* 2. 決策工具區域 */}
      <div class="w-full max-w-md flex flex-col items-center bg-base-100 rounded-xl shadow-md p-4 sm:p-6 my-4">
        {/* 按鈕部分 */}
        <div class="h-[42px] flex items-center justify-center mb-5 sm:mb-7">
          <Show
            when={!isDeciding()}
            fallback={
              <div class="text-md text-primary/70 font-normal">
                {t("home_page_deciding_in_progress")}
              </div>
            }
          >
            <button
              class="btn btn-primary btn-md"
              onClick={handleDecide}
              disabled={decideButtonDisabled()}
            >
              {t("home_page_decide_button")}
            </button>
          </Show>
        </div>

        {/* 選項列表展示與高亮 (水平排列) */}
        <div class="w-full">
          <Show
            when={currentOptions().length > 0}
            fallback={
              <Show when={currentConfigId() && !decideButtonDisabled()}>
                <p class="text-xs text-warning/80 text-center py-3">
                  {t("tag_input_no_options")}
                </p>
              </Show>
            }
          >
            <div
              class="w-full overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory"
              ref={scrollContainerRef}
              style={{ "scroll-padding": "0 45%" }}
            >
              <div class="inline-flex flex-row space-x-2 items-stretch px-1 py-2 min-h-[3.5rem]">
                <For each={currentOptions()}>
                  {(option, index) => (
                    <div
                      ref={(el) => (optionItemRefs[index()] = el)}
                      class="snap-center flex-shrink-0 px-3 py-1.5 border border-transparent rounded-md text-center transition-all duration-150 ease-in-out cursor-default whitespace-nowrap min-w-[60px] max-w-[150px] truncate flex items-center justify-center"
                      classList={{
                        "bg-primary/80 text-primary-content scale-102 shadow-sm":
                          isDeciding() && highlightedIndex() === index(),
                        // 注意：這裡的 scale-105 是針對最終選中項的靜態放大，若與 animate-bounce 同時作用於文字本身可能需要調整
                        "bg-accent text-accent-content scale-105 shadow-md ring-1 ring-accent/50":
                          !isDeciding() &&
                          finalSelectedOption() === option &&
                          highlightedIndex() === index(),
                        "bg-base-200/70 text-base-content/60 hover:bg-base-300/50":
                          !(isDeciding() && highlightedIndex() === index()) &&
                          !(
                            !isDeciding() &&
                            finalSelectedOption() === option &&
                            highlightedIndex() === index()
                          ),
                      }}
                      title={option}
                    >
                      <span class="text-xs sm:text-sm font-normal">
                        {option}
                      </span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </div>

      {/* 3. 結果展示區域 */}
      <div class="w-full max-w-sm text-center bg-base-200 rounded-xl shadow-sm p-4 sm:p-5 my-4 min-h-[80px] sm:min-h-[90px] flex flex-col justify-center items-center">
        <Show
          when={optionToDisplayInResult()}
          fallback={
            <p class="text-sm text-base-content/50">
              {t("home_page_result_area_desc")}
            </p>
          }
        >
          {(currentDisplayOption) => (
            <>
              <p class="text-xs text-base-content/60 mb-1">
                {isDeciding()
                  ? t("home_page_deciding_in_progress")
                  : t("home_page_decision_result_label")}
              </p>
              <p
                // 基礎 class，保留 transition 用於顏色等其他可能的平滑過渡
                class="text-lg sm:text-xl font-medium transition-colors duration-300 ease-out"
                classList={{
                  // 重新加入 animate-bounce 並移除 scale-105 以避免衝突
                  "text-accent animate-bounce":
                    !isDeciding() && !!finalSelectedOption(),
                  "text-primary/80": isDeciding(),
                  // 只有在決定中且還沒有最終選項時才降低透明度，避免影響 bounce 時的視覺
                  "opacity-70": isDeciding() && !finalSelectedOption(),
                }}
              >
                {currentDisplayOption()}
              </p>
            </>
          )}
        </Show>
      </div>
    </div>
  );
};

export default HomePage;
