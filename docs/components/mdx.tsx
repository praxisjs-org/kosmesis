import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';
import { Cards, Card } from 'fumadocs-ui/components/card';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { StorybookLink } from './storybook-link';
import { StorybookEmbed } from './storybook-embed';
import { PackageInstall } from './package-install';
import type { MDXComponents } from 'mdx/types';
import { KosmesisInstall } from './kosmesis-install';
import { KosmesisInit } from './kosmesis-init';
import { ManualInstall } from './manual-install';
import { CreatePraxisProject } from './create-praxis-project';
import { SlimTabs, SlimTab } from './tabs';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tabs,
    Tab,
    SlimTabs,
    SlimTab,
    Callout,
    Cards,
    Card,
    Steps,
    Step,
    StorybookLink,
    StorybookEmbed,
    PackageInstall,
    CreatePraxisProject,
    KosmesisInit,
    KosmesisInstall,
    ManualInstall,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
