import type { Meta, StoryObj } from "@praxisjs/storybook";

import { TreeView, type TreeNode } from "@/ui/tailwind/tree-view";

const DATA: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "src/app.tsx", label: "app.tsx" },
      {
        id: "src/components",
        label: "components",
        children: [
          { id: "src/components/button.tsx", label: "button.tsx" },
          { id: "src/components/card.tsx", label: "card.tsx" },
        ],
      },
    ],
  },
  {
    id: "public",
    label: "public",
    children: [
      {
        id: "public/images",
        label: "images",
        children: [
          { id: "public/images/logo.svg", label: "logo.svg" },
          { id: "public/images/hero.png", label: "hero.png" },
        ],
      },
    ],
  },
  { id: "package.json", label: "package.json" },
  { id: "tsconfig.json", label: "tsconfig.json" },
  { id: "README.md", label: "README.md" },
];

const meta: Meta = {
  title: "Tailwind/Tree View",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A recursive expand/collapse/select tree. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <TreeView data={DATA} defaultExpanded={["src", "public", "public/images"]} />,
};

export const WithLines: Story = {
  name: "With Lines",
  render: () => <TreeView data={DATA} defaultExpanded={["src", "public", "public/images"]} showLines />,
};
