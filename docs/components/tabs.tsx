import {
  Tabs as BaseTabs,
  Tab as BaseTab,
  TabsList as BaseTabsList,
  TabsTrigger as BaseTabsTrigger,
  TabsContent as BaseTabsContent,
} from 'fumadocs-ui/components/tabs';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/**
 * Flat, card-less restyle of fumadocs-ui's Tabs — the upstream default wraps every `<Tabs>` in a
 * bordered, rounded, `bg-fd-secondary` box, which looks like a nested card when one Tabs (e.g. the
 * CLI/Manual install switcher) contains another (the package-manager switcher inside it).
 */
export function SlimTabs({ className, ...props }: ComponentProps<typeof BaseTabs>) {
  return <BaseTabs className={cn('overflow-visible rounded-none border-none bg-transparent', className)} {...props} />;
}

export function SlimTabsList({ className, ...props }: ComponentProps<typeof BaseTabsList>) {
  return <BaseTabsList className={cn('gap-4 border-b border-fd-border px-0', className)} {...props} />;
}

export function SlimTabsTrigger({ className, ...props }: ComponentProps<typeof BaseTabsTrigger>) {
  return <BaseTabsTrigger className={cn('border-b-2', className)} {...props} />;
}

export function SlimTab({ className, ...props }: ComponentProps<typeof BaseTab>) {
  return (
    <BaseTab
      className={cn('rounded-none border-none bg-transparent p-0 pt-4 [&>figure:only-child]:m-0', className)}
      {...props}
    />
  );
}

export function SlimTabsContent({ className, ...props }: ComponentProps<typeof BaseTabsContent>) {
  return (
    <BaseTabsContent
      className={cn('rounded-none border-none bg-transparent p-0 pt-4 [&>figure:only-child]:m-0', className)}
      {...props}
    />
  );
}
