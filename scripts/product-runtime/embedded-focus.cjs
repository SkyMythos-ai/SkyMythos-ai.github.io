// Keep native focus behavior while preventing an ambient, inert demo from
// scrolling its reader back to a component that finishes mounting later.
function installEmbeddedFocusGuard(view) {
  const prototype = view.HTMLElement.prototype;
  const focus = prototype.focus;
  prototype.focus = function (...args) {
    if (view.parent !== view && view.frameElement?.inert) {
      return focus.call(this, { ...args[0], preventScroll: true }, ...args.slice(1));
    }
    return focus.apply(this, args);
  };
}

module.exports = { installEmbeddedFocusGuard };
