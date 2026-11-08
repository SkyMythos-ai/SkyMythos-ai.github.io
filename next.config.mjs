import { createMDX } from "fumadocs-mdx/next";

const githubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 独立缓存目录，避免旧项目仍在运行的开发服务写入类型和构建缓存。
  // export模式把自定义distDir解释为导出位置；Pages在独立副本中使用默认.next。
  distDir: githubPages ? ".next" : ".next-linear",
  devIndicators: false,
  output: githubPages ? "export" : "standalone",
  ...(githubPages && {
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default createMDX()(nextConfig);
