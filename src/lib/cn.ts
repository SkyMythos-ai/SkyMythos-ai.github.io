/**
 * Class name joiner.
 *
 * A local implementation rather than a dependency: the site needs exactly this
 * much behaviour, and `clsx` plus `tailwind-merge` would add two packages to
 * de-duplicate a handful of static class strings. Falsy values are dropped so
 * conditionals can be written inline.
 */
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
