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
          description: "Guides and components, in both style systems",
          url: "/docs",
        },
        {
          title: "Changelog",
          description: "Release history for the kosmesis CLI",
          url: "/docs/changelog",
        },
      ]}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
