'use client';

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

export function KosmesisInit() {
  const commands: Record<string, string> = {
    npm: 'npx kosmesis init',
    pnpm: 'pnpm dlx kosmesis init',
    yarn: 'yarn dlx kosmesis init',
    bun: 'bunx kosmesis init',
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
