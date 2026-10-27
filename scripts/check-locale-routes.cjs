const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

// 用已安装的 TS 编译真实模块，不导入 Next 服务端运行时，也不改全局 require 解析规则。
function sourceLoader() {
  const cache = new Map();
  function load(file) {
    const resolved = [file, `${file}.ts`, path.join(file, "index.ts")]
      .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    assert.ok(resolved, `Source module exists: ${file}`);
    if (cache.has(resolved)) return cache.get(resolved).exports;
    const compiledModule = { exports: {} };
    cache.set(resolved, compiledModule);
    const output = ts.transpileModule(fs.readFileSync(resolved, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    });
    function localRequire(specifier) {
      if (specifier.startsWith("@/")) return load(path.join(root, "src", specifier.slice(2)));
      if (specifier.startsWith(".")) return load(path.resolve(path.dirname(resolved), specifier));
      return require(specifier);
    }
    new Function("require", "module", "exports", output.outputText)(localRequire, compiledModule, compiledModule.exports);
    return compiledModule.exports;
  }
  return (relative) => load(path.join(root, relative));
}

const expectedSlugs = [
  "product", "product/work-delivery", "product/methods", "product/governance", "product/architecture",
  "solutions", "solutions/engineering", "solutions/team-reuse", "solutions/enterprise-adoption",
  "security", "resources", "resources/how-it-works",
];
const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
try {
  process.env.NEXT_PUBLIC_SITE_URL = "https://skymythos.ai";
  for (const basePath of ["", "/site"]) {
    process.env.NEXT_PUBLIC_BASE_PATH = basePath;
    const load = sourceLoader();
    const { commercialSlugs, availableLocalesForPath, languageSwitchDestination } = load("src/lib/commercial-routes.ts");
    const { buildMetadata } = load("src/lib/metadata.ts");
    const { default: sitemap } = load("src/app/sitemap.ts");
    const { docRoutes, getDocCorpus } = load("src/content/registry.ts");
    assert.deepEqual(commercialSlugs, expectedSlugs, "12 non-home commercial routes are authoritative");
    assert.deepEqual(docRoutes(), getDocCorpus("en").pages.map((page) => page.slug), "docs truly share route identities");
    assert.deepEqual(availableLocalesForPath("/unknown"), [], "unknown marketing paths have no invented translations");

    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    assert.equal(new Set(urls).size, urls.length, "sitemap has no duplicate home or content URL");
    const sharedPaths = ["/", "/concept", "/architecture", "/docs", ...docRoutes().map((slug) => `/docs/${slug}`)];
    assert.equal(entries.length, sharedPaths.length * 2 + expectedSlugs.length, "only real shared + Chinese-only pages exist");

    for (const slug of expectedSlugs) {
      const path = `/${slug}`;
      const canonical = `${basePath}/zh/${slug}/`;
      const absolute = `https://skymythos.ai${canonical}`;
      assert.deepEqual(availableLocalesForPath(`${path}/`), ["zh"]);
      const metadata = buildMetadata({ locale: "zh", title: "商业页", description: "说明", path });
      assert.equal(metadata.metadataBase.origin, "https://skymythos.ai");
      assert.equal(metadata.alternates.canonical, canonical);
      assert.deepEqual(metadata.alternates.languages, { "zh-CN": canonical, "x-default": canonical });
      assert.deepEqual(metadata.openGraph.alternateLocale, []);
      const entry = entries.find((entry) => entry.url === absolute);
      assert.ok(entry, `sitemap includes ${absolute}`);
      assert.deepEqual(entry.alternates.languages, { "zh-CN": absolute });
      assert.ok(!urls.includes(`https://skymythos.ai${basePath}/en/${slug}/`));
      for (const pathname of [`/zh/${slug}/`, `${basePath}/zh/${slug}/`]) {
        assert.deepEqual(languageSwitchDestination({ pathname, targetLocale: "en", basePath, suffix: "?q=1#section" }), {
          href: `${basePath}/en/`, isEquivalent: false,
        }, "untranslated page explicitly falls back to English home without query/hash");
        assert.deepEqual(languageSwitchDestination({ pathname, targetLocale: "zh", basePath, suffix: "?q=1#section" }), {
          href: `${canonical}?q=1#section`, isEquivalent: true,
        });
      }
    }

    for (const path of sharedPaths) {
      const suffix = path === "/" ? "" : path;
      assert.deepEqual(availableLocalesForPath(path), ["zh", "en"]);
      for (const locale of ["zh", "en"]) {
        const targetLocale = locale === "zh" ? "en" : "zh";
        const metadata = buildMetadata({ locale, title: "Page", description: "Description", path });
        assert.deepEqual(metadata.alternates.languages, {
          "zh-CN": `${basePath}/zh${suffix}/`,
          en: `${basePath}/en${suffix}/`,
          "x-default": `${basePath}/zh${suffix}/`,
        });
        assert.deepEqual(metadata.openGraph.alternateLocale, [targetLocale === "zh" ? "zh_CN" : "en_US"]);
        assert.deepEqual(languageSwitchDestination({ pathname: `${basePath}/${locale}${suffix}/`, targetLocale, basePath, suffix: "?q=a%20b#section" }), {
          href: `${basePath}/${targetLocale}${suffix}/?q=a%20b#section`, isEquivalent: true,
        }, "equivalent home/legacy/docs routes preserve encoded query and hash");
      }
    }
    assert.deepEqual(languageSwitchDestination({ pathname: "/sitewide/zh/product/", targetLocale: "en", basePath: "/site" }), {
      href: "/site/en/", isEquivalent: false,
    }, "basePath is stripped at a segment boundary only");
    console.log(`PASS locale routes: ${entries.length} sitemap entries, 12 zh-only pages, all shared docs/legacy/home, basePath=${JSON.stringify(basePath)}`);
  }
} finally {
  if (originalBasePath === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
  else process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
  if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
}
