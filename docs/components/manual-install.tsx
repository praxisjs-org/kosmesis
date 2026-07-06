import fs from 'node:fs';
import path from 'node:path';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import Link from 'fumadocs-core/link';
import { PackageInstall } from './package-install';

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content: string;
}

interface RegistryItem {
  name: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

const STYLE_SYSTEMS = [
  { value: 'Tailwind', dir: 'tailwind' as const },
  { value: '@praxisjs/css', dir: 'praxisjs-css' as const },
];

function readRegistryItem(styleSystem: 'tailwind' | 'praxisjs-css', name: string): RegistryItem {
  const file = path.join(process.cwd(), 'public/r', styleSystem, `${name}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as RegistryItem;
}

interface ManualInstallProps {
  /** Registry component name, e.g. "button". */
  name: string;
}

/**
 * The copy-paste alternative to `<KosmesisInstall />`: what `kosmesis add` actually does,
 * spelled out as steps — install the component's npm dependencies, then copy its source file(s)
 * into the consumer's own `components/ui` directory. Reads the already-built
 * `public/r/<styleSystem>/<name>.json` registry artifacts (same ones the CLI fetches), so this
 * always matches the real source and never drifts from a hand-copied snippet.
 */
export function ManualInstall({ name }: ManualInstallProps) {
  return (
    <Tabs items={STYLE_SYSTEMS.map((s) => s.value)} groupId="kosmesis-style-system" persist>
      {STYLE_SYSTEMS.map(({ value, dir }) => {
        const item = readRegistryItem(dir, name);
        return (
          <Tab key={value} value={value}>
            <ManualSteps item={item} />
          </Tab>
        );
      })}
    </Tabs>
  );
}

function ManualSteps({ item }: { item: RegistryItem }) {
  return (
    <Steps>
      {item.dependencies && item.dependencies.length > 0 && (
        <Step>
          <p>Install the following dependencies:</p>
          <PackageInstall pkg={item.dependencies} />
        </Step>
      )}
      {item.registryDependencies && item.registryDependencies.length > 0 && (
        <Step>
          <p>
            This component builds on other Kosmesis components — install these first (via{' '}
            <code>kosmesis add</code> or this same manual process on their own pages):{' '}
            {item.registryDependencies.map((dep, i) => (
              <span key={dep}>
                {i > 0 && ', '}
                <Link href={`/docs/components/${dep}`}>
                  <code>{dep}</code>
                </Link>
              </span>
            ))}
            .
          </p>
        </Step>
      )}
      <Step>
        <p>Copy and paste the following code into your project.</p>
        {item.files.map((file) => (
          <DynamicCodeBlock
            key={file.path}
            lang="tsx"
            code={file.content}
            codeblock={{ title: file.target ?? file.path }}
          />
        ))}
      </Step>
    </Steps>
  );
}
