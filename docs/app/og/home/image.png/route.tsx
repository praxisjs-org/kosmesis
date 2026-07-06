import { renderOGImage } from '@/lib/og';

export const revalidate = false;

export function GET() {
  return renderOGImage({
    title: 'Components you own, built on Morphos.',
    description: 'Copy-paste UI components for PraxisJS. The shadcn/ui equivalent for the PraxisJS ecosystem — Tailwind CSS or @praxisjs/css, chosen once, owned outright.',
  });
}
