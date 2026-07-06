import { renderOGImage } from '@/lib/og';

export const revalidate = false;

export function GET() {
  return renderOGImage({
    title: 'Headless, primitive components.',
    description: 'Accessible building blocks for PraxisJS. Keyboard navigation, ARIA support, and state exposed through data-* attributes. Zero CSS included.',
  });
}
