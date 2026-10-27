import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Existing legacy previews are preserved by this release. Track these new
  // compiler diagnostics as warnings until those components are migrated;
  // the same rules remain errors for the new commercial implementation.
  {
    files: ["src/components/hero-stage.tsx"],
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  {
    files: ["src/components/product-demo/playback.ts"],
    rules: { "react-hooks/immutability": "warn" },
  },
  {
    files: ["scripts/**/*.cjs", "tests/**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  globalIgnores([
    ".next/**", "out/**", "node_modules/**", "next-env.d.ts",
    ".handoff/**", ".agents/**", ".claude/**", "coverage/**",
  ]),
]);
