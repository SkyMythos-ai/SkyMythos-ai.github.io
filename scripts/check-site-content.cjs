const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "fusion-content-check-"));
const oldSlugs = [
  "getting-started/overview", "getting-started/deployment", "getting-started/first-task",
  "concepts/tasks-and-specs", "concepts/flows-and-worknodes", "concepts/sandbox",
  "concepts/preflight", "concepts/artifacts-and-gates", "concepts/knowledge-and-memory",
  "guides/create-a-task", "guides/observe-execution", "guides/handle-failures",
  "guides/flows-and-marketplace", "guides/digital-employees", "guides/knowledge-base",
  "guides/connections-and-mcp", "operations/roles", "operations/configuration",
  "operations/verification", "reference/glossary", "reference/faq",
];
const managementSlugs = ["management/usage", "management/costs", "management/model-policies"];

function compile(relative) {
  const source = path.join(root, "src/content", relative);
  const output = path.join(temporary, relative.replace(/\.ts$/, ".js"));
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, ts.transpileModule(fs.readFileSync(source, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText);
}

try {
  compile("types.ts");
  for (const locale of ["zh", "en"]) {
    for (const file of fs.readdirSync(path.join(root, "src/content/docs", locale))) {
      if (file.endsWith(".ts")) compile(`docs/${locale}/${file}`);
    }
  }
  const { buildDocNav, docNeighbours } = require(path.join(temporary, "types.js"));
  const corpora = ["zh", "en"].map(locale => require(path.join(temporary, `docs/${locale}/index.js`))[`${locale}Docs`]);
  let links = 0;
  for (const corpus of corpora) {
    const slugs = corpus.pages.map(page => page.slug);
    assert.equal(new Set(slugs).size, slugs.length, "Unique document slugs");
    assert.deepEqual(corpus.sections.map(section => section.id), ["getting-started", "guides", "management", "operations", "concepts", "reference"]);
    for (const slug of [...oldSlugs, ...managementSlugs]) assert.ok(slugs.includes(slug), `${corpus.locale}: missing ${slug}`);
    const navigation = buildDocNav(corpus).flatMap(group => group.pages);
    assert.equal(navigation.length, corpus.pages.length, "Every document belongs to the navigation");
    navigation.forEach((page, index) => {
      const adjacent = docNeighbours(corpus, page.slug);
      assert.equal(adjacent.previous?.slug, navigation[index - 1]?.slug);
      assert.equal(adjacent.next?.slug, navigation[index + 1]?.slug);
      assert.ok(!/^# /m.test(page.body), "The document title is the only H1");
      for (const match of page.body.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
        const target = new URL(match[1], `https://docs.local/${corpus.locale}/docs/${page.slug}/`);
        if (target.origin !== "https://docs.local") continue;
        if (target.pathname.startsWith("/images/")) {
          assert.ok(fs.existsSync(path.join(root, "public", target.pathname)), `Missing image ${target.pathname}`);
          continue;
        }
        const prefix = `/${corpus.locale}/docs/`;
        assert.ok(target.pathname.startsWith(prefix), `${page.slug}: unexpected document link ${target.pathname}`);
        assert.ok(slugs.includes(target.pathname.slice(prefix.length).replace(/\/$/, "")), `${page.slug}: broken link ${match[1]}`);
        links++;
      }
    });
    const costs = corpus.pages.find(page => page.slug === "management/costs").body;
    for (const state of ["complete", "partial", "unknown"]) assert.ok(costs.includes(state), `Missing cost state ${state}`);
    const policies = corpus.pages.find(page => page.slug === "management/model-policies").body;
    for (const boundary of ["UTC", "Task", "BudgetNone"]) assert.ok(policies.includes(boundary), `Missing policy boundary ${boundary}`);
  }
  const signature = corpus => corpus.pages.map(({ slug, section, readingOrder }) => ({ slug, section, readingOrder })).sort((a, b) => a.slug.localeCompare(b.slug));
  assert.deepEqual(signature(corpora[0]), signature(corpora[1]), "Bilingual coverage and reading order");
  console.log(`PASS: ${corpora[0].pages.length} documents per locale; all ${oldSlugs.length} existing slugs retained; ${links} document links; navigation, neighbours and governance boundaries.`);
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
