import { spawn } from "node:child_process";
import { cp, mkdir, open, readFile, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cache = path.join(root, "temp/pages-export");
const staging = path.join(root, ".next-pages");
await mkdir(cache, { recursive: true });
const lock = await open(path.join(cache, "build.lock"), "wx");
let child;
let interrupted;
const stop = (signal) => {
  interrupted = signal;
  child?.kill(signal);
};
const onInterrupt = () => stop("SIGINT");
const onTerminate = () => stop("SIGTERM");
process.once("SIGINT", onInterrupt);
process.once("SIGTERM", onTerminate);

try {
  // Next export固定使用.next作为中间目录。在独立副本构建，源文件和Node缓存始终不动。
  await rm(staging, { recursive: true, force: true });
  await mkdir(staging, { recursive: true });
  const excluded = ["src/app/api/poc", "src/app/reference"];
  const linearAssets = path.join(root, "public/sites/linear");
  const sharedFonts = ["inter-variable.woff2", "berkeley-mono-variable.woff2"];
  for (const relative of [
    "src", "content", "public", "next.config.mjs", "postcss.config.mjs",
    "package.json", "package-lock.json",
  ]) {
    await cp(path.join(root, relative), path.join(staging, relative), {
      recursive: true,
      filter: (source) => {
        if (source.startsWith(`${linearAssets}${path.sep}`)) {
          // 官网复用了这两份字体；next/font会复制到哈希后的_next/static/media。
          return sharedFonts.includes(path.relative(linearAssets, source));
        }
        return !excluded.some((item) => {
          const excludedPath = path.join(root, item);
          return source === excludedPath || source.startsWith(`${excludedPath}${path.sep}`);
        });
      },
    });
  }
  await symlink(path.join(root, "node_modules"), path.join(staging, "node_modules"), "dir");
  const tsconfig = JSON.parse(await readFile(path.join(root, "tsconfig.json"), "utf8"));
  tsconfig.include = ["next-env.d.ts", "src/**/*.ts", "src/**/*.tsx", ".next/types/**/*.ts"];
  tsconfig.exclude = ["node_modules"];
  await writeFile(path.join(staging, "tsconfig.json"), JSON.stringify(tsconfig, null, 2));

  const env = { ...process.env, GITHUB_PAGES: "true" };
  // 静态产物无需收件服务配置，构建时也不向Next进程传入这些私有值。
  for (const key of Object.keys(env)) {
    if (key.startsWith("POC_")) delete env[key];
  }

  if (interrupted) throw new Error(`静态构建已收到 ${interrupted}`);
  const code = await new Promise((resolve, reject) => {
    child = spawn(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
      cwd: staging,
      env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (value, signal) =>
      resolve(signal ? 1 : (value ?? 1)),
    );
  });
  if (code !== 0 || interrupted) {
    throw new Error(`静态构建未完成（退出码 ${code}）`);
  }
  // 移除上一次导出，避免已经取消发布的路由或素材残留。
  await rm(path.join(root, "out"), { recursive: true, force: true });
  await cp(path.join(staging, "out"), path.join(root, "out"), { recursive: true });
  await rm(path.join(root, "out/sites/linear"), { recursive: true, force: true });
  await writeFile(path.join(root, "out/.nojekyll"), "");
  console.log("GitHub Pages 静态产物已生成到 out/。");
} finally {
  process.removeListener("SIGINT", onInterrupt);
  process.removeListener("SIGTERM", onTerminate);
  await lock.close();
  await rm(path.join(cache, "build.lock"));
}
