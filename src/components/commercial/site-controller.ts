export type CommercialSiteController = ReturnType<typeof mountCommercialSite>;

/** 挂载当前商业外壳的导航、只读原图和本地预约预览；dispose 后可安全重复挂载。 */
export function mountCommercialSite(root: HTMLElement) {
  const events = new AbortController();
  const options = { signal: events.signal };
  const compact = matchMedia("(max-width: 700px)");
  const navigation = root.querySelector<HTMLElement>("#navigation");
  const menuButton = root.querySelector<HTMLButtonElement>(".menu-toggle");
  const groups = [...root.querySelectorAll<HTMLDetailsElement>(".nav-group")];
  const contactDialog = root.querySelector<HTMLDialogElement>("#contact-dialog");
  const imageDialog = root.querySelector<HTMLDialogElement>("#image-dialog");
  const form = root.querySelector<HTMLFormElement>("#contact-form");
  const result = root.querySelector<HTMLElement>("#contact-result");
  const zoomImage = root.querySelector<HTMLImageElement>("#zoom-image");
  const imageError = root.querySelector<HTMLElement>("#image-error");
  const original = root.querySelector<HTMLAnchorElement>("#image-original");
  const edit = root.querySelector<HTMLButtonElement>("#edit-contact");
  const fields = ["company", "email", "interest", "goal"] as const;
  const triggers = new WeakMap<HTMLDialogElement, HTMLElement>();
  const wasEnhanced = root.classList.contains("js");
  root.classList.add("js");

  function closeGroups(except?: HTMLDetailsElement) {
    groups.forEach(group => { if (group !== except) group.open = false; });
  }
  function setNavigation(open: boolean) {
    if (navigation) navigation.hidden = compact.matches && !open;
    menuButton?.setAttribute("aria-expanded", String(compact.matches && open));
    if (!open) closeGroups();
  }
  function resizeNavigation() {
    if (menuButton) menuButton.hidden = !compact.matches;
    setNavigation(false);
  }
  menuButton?.addEventListener("click", () => setNavigation(menuButton.getAttribute("aria-expanded") !== "true"), options);
  compact.addEventListener("change", resizeNavigation, options);
  groups.forEach(group => group.addEventListener("toggle", () => { if (group.open) closeGroups(group); }, options));
  root.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(".nav-group")) closeGroups();
    if (event.target.closest("#navigation a")) setNavigation(false);
  }, options);
  root.addEventListener("keydown", event => {
    if (event.key !== "Escape" || root.querySelector("dialog[open]")) return;
    const open = groups.find(group => group.open);
    if (open) { closeGroups(); open.querySelector("summary")?.focus(); }
    else if (compact.matches && navigation && !navigation.hidden) { setNavigation(false); menuButton?.focus(); }
  }, options);

  function resetContact() {
    form?.reset();
    if (form) form.hidden = false;
    if (result) result.hidden = true;
    fields.forEach(field => {
      const value = result?.querySelector(`[data-result="${field}"]`);
      if (value) value.textContent = "";
    });
  }
  function openDialog(dialog: HTMLDialogElement | null, trigger: HTMLElement) {
    if (!dialog || typeof dialog.showModal !== "function") return false;
    closeGroups();
    setNavigation(false);
    triggers.set(dialog, trigger);
    if (!dialog.open) dialog.showModal();
    return true;
  }
  for (const dialog of [contactDialog, imageDialog]) {
    if (!dialog) continue;
    dialog.querySelector("[data-close]")?.addEventListener("click", () => dialog.close(), options);
    dialog.addEventListener("click", event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    }, options);
    dialog.addEventListener("close", () => {
      const trigger = triggers.get(dialog);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      if (dialog === contactDialog) resetContact();
      else {
        zoomImage?.removeAttribute("src");
        if (zoomImage) zoomImage.alt = "";
        if (imageError) imageError.hidden = true;
      }
    }, options);
  }
  root.addEventListener("click", event => {
    if (!(event.target instanceof Element) || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const contact = event.target.closest<HTMLElement>("[data-contact]");
    if (contact && openDialog(contactDialog, contact)) event.preventDefault();
    const trigger = event.target.closest<HTMLAnchorElement>("a[data-zoom]");
    if (!trigger || !imageDialog || !zoomImage || typeof imageDialog.showModal !== "function") return;
    event.preventDefault();
    if (imageError) imageError.hidden = true;
    zoomImage.alt = trigger.dataset.zoomAlt || trigger.querySelector("img")?.alt || "产品原图";
    zoomImage.src = trigger.href;
    if (original) original.href = trigger.href;
    openDialog(imageDialog, trigger);
  }, options);
  form?.addEventListener("submit", event => {
    // 仅内存中呈现用户输入：不发请求、不持久化、不改 URL，也不声称预约已受理。
    event.preventDefault();
    if (!form.reportValidity() || !result) return;
    fields.forEach(key => {
      const input = form.elements.namedItem(key);
      const target = result.querySelector(`[data-result="${key}"]`);
      if (target && (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement)) target.textContent = input.value.trim() || "未填写";
    });
    form.hidden = true;
    result.hidden = false;
    edit?.focus();
  }, options);
  edit?.addEventListener("click", () => {
    if (form) form.hidden = false;
    if (result) result.hidden = true;
    root.querySelector<HTMLInputElement>("#company")?.focus();
  }, options);
  zoomImage?.addEventListener("error", () => { if (imageError) imageError.hidden = false; }, options);
  zoomImage?.addEventListener("load", () => { if (imageError) imageError.hidden = true; }, options);
  const closeDialogs = () => {
    [contactDialog, imageDialog].forEach(dialog => { if (dialog?.open) dialog.close(); });
    resetContact();
  };
  window.addEventListener("pagehide", closeDialogs, options);
  resizeNavigation();
  return {
    setNavigation,
    dispose() {
      closeDialogs();
      events.abort();
      closeGroups();
      if (navigation) navigation.hidden = false;
      if (menuButton) { menuButton.hidden = true; menuButton.setAttribute("aria-expanded", "false"); }
      zoomImage?.removeAttribute("src");
      if (!wasEnhanced) root.classList.remove("js");
    },
  };
}
