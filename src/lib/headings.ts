/**
 * Heading helpers shared by the Markdown renderer and the table of contents.
 *
 * Both sides must derive the same id from the same heading text, or the "on this
 * page" links point at nothing. Keeping one implementation is the only reliable
 * way to guarantee that.
 */

/**
 * Build a URL-safe slug from heading text.
 *
 * Chinese headings are a first-class case here, not an edge case: the default
 * locale's headings are mostly Chinese, and stripping non-ASCII would collapse
 * most of them to the empty string. CJK characters are therefore preserved —
 * they are valid in a URL fragment and browsers handle them correctly — while
 * whitespace and punctuation that would break a fragment are removed.
 */
export function slugifyHeading(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    // Drop characters that are unsafe or meaningless in a fragment.
    .replace(/[·、，。：；！？（）【】《》""''「」…—―,.!?:;()[\]{}"'`]/g, "")
    // Whitespace and slashes become single hyphens.
    .replace(/[\s/]+/g, "-")
    // Collapse repeated hyphens left by the substitutions above.
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

  // An empty result is possible for a heading made only of punctuation. Fall
  // back to a stable marker rather than emitting `id=""`, which is invalid.
  return slug || "section";
}

/** A heading extracted from a Markdown body, for the table of contents. */
export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Extract `##` and `###` headings from a Markdown body.
 *
 * Deliberately a straightforward line scan rather than a full parse: the docs are
 * authored in this repository under review, and a heading inside a fenced code
 * block is the only realistic false positive — which the fence tracker below
 * handles.
 */
export function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  let insideFence = false;

  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    // Strip inline Markdown emphasis and code ticks so the label reads cleanly.
    const text = match[2]
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\*\*([^*]*)\*\*/g, "$1")
      .replace(/\*([^*]*)\*/g, "$1")
      .trim();

    entries.push({ id: slugifyHeading(text), text, level });
  }

  return entries;
}

/**
 * Estimate reading time. Latin prose runs about 220 words per minute; Chinese
 * runs about 350 characters per minute because a character carries more meaning
 * than a word in the Latin sense.
 */
export function readingMinutes(body: string): number {
  const latinWords = (body.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).length;
  const cjkChars = (body.match(/[一-鿿]/g) ?? []).length;

  const minutes = latinWords / 220 + cjkChars / 350;
  return Math.max(1, Math.round(minutes));
}
