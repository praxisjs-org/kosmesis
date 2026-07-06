import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { getLayoutTabs } from "fumadocs-ui/layouts/shared";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree = source.getPageTree();

  return (
    <DocsLayout
      tree={tree}
      tabs={[
        {
          title: "Documentation",
          description: "Guides, API reference, and component packages",
          url: "/docs",
        },
        {
          title: "Changelog",
          description: "Release history across all packages",
          url: "/docs/changelog",
        },
      ]}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
