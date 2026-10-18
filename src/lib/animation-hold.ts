/** Keyboard focus can hold a figure for reading; pointer hover never stops playback. */
export function observeAnimationHold(element: HTMLElement, change: (held: boolean) => void) {
  const scope = element.closest<HTMLElement>("[data-animation-scope]") ?? element;
  const hasKeyboardFocus = () => scope.matches(":focus-visible") || !!scope.querySelector(":focus-visible");
  let focused = hasKeyboardFocus();
  function publish() {
    scope.dataset.held = String(focused);
    scope.getAnimations({ subtree: true }).forEach(animation => {
      if (focused) animation.pause();
      else if (animation.playState === "paused") animation.play();
    });
    change(focused);
  }
  const focus = () => { focused = hasKeyboardFocus(); publish(); };
  const blur = (event: FocusEvent) => { if (!(event.relatedTarget instanceof Node) || !scope.contains(event.relatedTarget)) focused = false; publish(); };
  const pointer = () => { focused = false; publish(); };
  scope.addEventListener("pointerdown", pointer);
  scope.addEventListener("focusin", focus);
  scope.addEventListener("focusout", blur);
  publish();
  return () => {
    scope.removeEventListener("pointerdown", pointer);
    scope.removeEventListener("focusin", focus);
    scope.removeEventListener("focusout", blur);
  };
}
