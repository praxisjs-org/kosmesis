'use client';

import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';

interface KosmesisInstallProps {
  /** Registry component name(s), e.g. "button" or ["button", "card"]. */
  name: string | string[];
}

/** Shows the `<pm> dlx kosmesis add <name>` command for every supported package manager. */
export function KosmesisInstall({ name }: KosmesisInstallProps) {
  const names = Array.isArray(name) ? name.join(' ') : name;

  const commands: Record<string, string> = {
    npm: `npx kosmesis add ${names}`,
    pnpm: `pnpm dlx kosmesis add ${names}`,
    yarn: `yarn dlx kosmesis add ${names}`,
    bun: `bunx kosmesis add ${names}`,
  };

  return (
    <Tabs items={['npm', 'pnpm', 'yarn', 'bun']}>
      {(Object.entries(commands) as [string, string][]).map(([manager, command]) => (
        <Tab key={manager} value={manager}>
          <DynamicCodeBlock lang="sh" code={command} />
        </Tab>
      ))}
    </Tabs>
  );
}
