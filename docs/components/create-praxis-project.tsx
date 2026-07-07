'use client';

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

interface CreatePraxisProjectProps {
  projectName?: string;
}

export function CreatePraxisProject({ projectName = 'my-project' }: CreatePraxisProjectProps) {
  const commands: Record<string, string> = {
    npm: `npm create praxisjs@latest ${projectName}\ncd ${projectName}`,
    pnpm: `pnpm create praxisjs ${projectName}\ncd ${projectName}`,
    yarn: `yarn create praxisjs ${projectName}\ncd ${projectName}`,
    bun: `bun create praxisjs ${projectName}\ncd ${projectName}`,
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
