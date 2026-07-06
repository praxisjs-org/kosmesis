import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";

import type { StorybookConfig } from "@praxisjs/storybook";

import type { InlineConfig } from "vite";

// Same "@/*" alias convention as `packages/registry/tsconfig.json`'s `paths`, resolved from the
// registry package root so `@/ui/tailwind/button`, `@/lib/utils`, `@/lib/kosmesis-theme`, etc.
// resolve identically to how the registry components themselves expect to resolve at typecheck
// time — the registry is copy-paste source, never a published package, so stories import it
// directly rather than through a workspace dependency.
const registryRoot = fileURLToPath(new URL("../../packages/registry", import.meta.url));

// `StorybookConfig` (as published by `@praxisjs/storybook`) doesn't itself declare `viteFinal` —
// that hook is contributed by `@storybook/builder-vite` and composed across every preset
// (including the framework's own `dist/preset.d.ts` `viteFinal`, which wires `@praxisjs/vite-plugin`)
// plus this file's, rather than replacing it.
type ViteFinal = (viteConfig: InlineConfig) => InlineConfig;

const config: StorybookConfig & { viteFinal: ViteFinal } = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: {
    name: "@praxisjs/storybook",
    options: {},
  },
  viteFinal(viteConfig) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    viteConfig.resolve = {
      ...viteConfig.resolve,
      // Not spreading `viteConfig.resolve?.alias` here — Vite's `AliasOptions` type is a union
      // that also allows an array form, and spreading an array into an object literal silently
      // produces index-keyed properties instead of merging entries.
      alias: {
        "@": registryRoot,
      },
    };
    return viteConfig;
  },
};

export default config;
