import type { Metadata } from "next";
import Link from "next/link";
import { gitConfig } from "@/lib/shared";

export const metadata: Metadata = {
  openGraph: {
    images: "/og/home/image.png",
  },
};

const GITHUB_URL = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

const LOGO_PATH =
  "M605.411 445.66L641.322 498.293L641.342 498.278L697.538 578.57L742.673 512.806L512.5 178.878L281.327 512.806L512.5 848.182L603.519 715.561L650.559 782.134L512.701 983L187 510.478L512.701 40L837 510.478L698.206 712.709L668.895 671.104L604.033 578.775L512 712.504L373.199 511.5L512.233 309.092L584.13 414.469L536.746 480.456L513.69 445.66L466.305 511.5L512.166 577.425L556.48 513.91L605.411 445.66Z";

const PRINCIPLES = [
  {
    title: "Own your components",
    body: "kosmesis add button copies real source into src/components/ui — not an npm dependency. You read it, own it, and change whatever you want.",
  },
  {
    title: "Behavior from Morphos",
    body: "Every interactive component wraps a headless Morphos primitive: keyboard navigation, ARIA, focus management, and data-* state — done for you.",
  },
  {
    title: "Presentation is yours",
    body: "Tailwind CSS v4 utility classes react to Morphos's data-* attributes directly, e.g. data-[state=open]:animate-in. No CSS-in-JS, no theme provider required.",
  },
];

const STEPS = [
  {
    n: "01",
    label: "Init",
    title: "One command to configure",
    body: "Run kosmesis init inside a create-praxisjs project. It writes components.json, wires up Tailwind v4, and adds the cn() helper.",
    code: "npx kosmesis init",
  },
  {
    n: "02",
    label: "Add",
    title: "Add components one at a time",
    body: "Each component is a small set of files copied straight into your project, with its Morphos dependency declared for you.",
    code: "npx kosmesis add button dialog",
  },
  {
    n: "03",
    label: "Customize",
    title: "Edit the source directly",
    body: "The component now lives in your repo. Change variants, swap classes, or rip out parts you don't need.",
    code: "src/components/ui/button.tsx",
  },
];

const CATEGORIES = [
  {
    name: "Inputs",
    href: "/docs/components/button",
    description:
      "Button · Button Group · Checkbox · Switch · Toggle · Toggle Group · Radio Group · Select · Native Select · Slider · Input · Input Group · Number Field · Input OTP · Textarea · Label · Combobox · Date Picker · Calendar · Field",
    count: 20,
  },
  {
    name: "Overlays",
    href: "/docs/components/dialog",
    description:
      "Dialog · Alert Dialog · Drawer · Sheet · Popover · Tooltip · Hover Card · Dropdown Menu · Context Menu · Command",
    count: 10,
  },
  {
    name: "Layout",
    href: "/docs/components/accordion",
    description:
      "Accordion · Tabs · Collapsible · Separator · Scroll Area · Navigation Menu · Menubar · Sidebar · Breadcrumb · Aspect Ratio · Resizable · Direction",
    count: 12,
  },
  {
    name: "Display",
    href: "/docs/components/alert",
    description:
      "Alert · Toast · Sonner · Progress · Spinner · Skeleton · Avatar · Badge · Card · Table · Data Table · Typography · Kbd · Empty · Item · Marker · Chart · Carousel · Pagination · Message · Message Scroller · Bubble · Attachment",
    count: 23,
  },
];

const FOOTER_LINKS = [
  {
    group: "Learn",
    links: [
      { label: "Introduction", href: "/docs/guide/introduction" },
      { label: "Getting started", href: "/docs/guide/getting-started" },
      { label: "Components", href: "/docs/components/button" },
    ],
  },
  {
    group: "Categories",
    links: [
      { label: "Inputs", href: "/docs/components/button" },
      { label: "Overlays", href: "/docs/components/dialog" },
      { label: "Layout", href: "/docs/components/accordion" },
      { label: "Display", href: "/docs/components/alert" },
    ],
  },
  {
    group: "Ecosystem",
    links: [
      { label: "GitHub", href: GITHUB_URL },
      { label: "Morphos", href: "https://morphos.praxisjs.org" },
      { label: "PraxisJS", href: "https://praxisjs.org" },
    ],
  },
];

function SectionRule({
  label,
  count,
}: {
  label: string;
  count: string;
}) {
  return (
    <div className="mb-14 flex items-center gap-4">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-fd-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-fd-border" />
      <span className="shrink-0 font-mono text-[10px] text-fd-muted-foreground">
        {count}
      </span>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden px-6 py-14 md:px-16">
          {/* All hero content inside the same max-w container */}
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col">
          {/* Watermark logo — inside the constrained container so it tracks content on all screen sizes */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 flex select-none items-center"
          >
            <svg
              width="560"
              height="560"
              viewBox="0 0 1024 1024"
              fill="none"
              className="text-fd-foreground opacity-[0.04]"
              style={{ transform: "translateX(18%)" }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={LOGO_PATH}
                fill="currentColor"
              />
            </svg>
          </div>
            {/* Headline — grows to fill remaining height, centers content */}
            <div className="flex flex-1 flex-col justify-center py-8">
              <h1
                className="leading-[0.9] tracking-tight text-fd-foreground"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3.5rem, 7vw, 7rem)",
                }}
              >
                Components you
                <br />
                <em
                  style={{
                    color: "var(--color-fd-muted-foreground)",
                    fontStyle: "italic",
                  }}
                >
                  own
                </em>
                , built on Morphos.
              </h1>

              <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-start md:gap-20">
                <p className="max-w-[32ch] text-[0.95rem] leading-relaxed text-fd-muted-foreground">
                  Kosmesis is the shadcn/ui equivalent for PraxisJS. Copy-paste component source,
                  styled variants reacting to Morphos&apos;s{" "}
                  <code
                    className="rounded px-1.5 py-0.5 font-mono text-[0.8em] text-fd-foreground"
                    style={{ background: "var(--ct-bar)" }}
                  >
                    data-*
                  </code>{" "}
                  state.
                </p>

                <div className="flex flex-col gap-5">
                  <Link
                    href="/docs/guide/getting-started"
                    className="group inline-flex items-center gap-2 text-[0.95rem] font-semibold text-fd-foreground transition-colors hover:text-fd-primary"
                  >
                    Get started
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                  <Link
                    href="/docs/components/button"
                    className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                  >
                    Browse 65 components
                  </Link>
                </div>
              </div>
            </div>

            {/* Meta bar — anchored to bottom of the constrained container */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-fd-border pt-6 font-mono text-[10px] text-fd-muted-foreground">
              <span>Copy-paste, not npm install</span>
              <span className="text-fd-border" aria-hidden>·</span>
              <span>65 components</span>
              <span className="text-fd-border" aria-hidden>·</span>
              <span>TypeScript</span>
              <span className="text-fd-border" aria-hidden>·</span>
              <span>ARIA-ready</span>
              <span className="text-fd-border" aria-hidden>·</span>
              <span>PraxisJS</span>
            </div>
          </div>
        </section>

        {/* ── Design principles ─────────────────────────────────────────── */}
        <section className="border-t border-fd-border px-6 py-20 md:px-16">
          <div className="mx-auto max-w-6xl">
            <SectionRule label="Philosophy" count="03 principles" />

            <div className="grid gap-12 md:grid-cols-3">
              {PRINCIPLES.map(({ title, body }, i) => (
                <div key={title}>
                  <span
                    className="mb-5 block text-[3rem] leading-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      color: "var(--color-fd-primary)",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    className="mb-3 text-[1.15rem] text-fd-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-[0.875rem] leading-relaxed text-fd-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="border-t border-fd-border px-6 py-20 md:px-16">
          <div className="mx-auto max-w-6xl">
            <SectionRule label="Quick start" count="03 steps" />

            <div className="grid gap-12 md:grid-cols-3">
              {STEPS.map(({ n, label, title, body, code }) => (
                <div key={n} className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-[3.5rem] leading-none"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                        color: "var(--color-fd-primary)",
                      }}
                    >
                      {n}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-fd-muted-foreground">
                      {label}
                    </span>
                  </div>
                  <h3
                    className="text-[1.05rem] text-fd-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="flex-1 text-[0.875rem] leading-relaxed text-fd-muted-foreground">
                    {body}
                  </p>
                  <code
                    className="mt-2 self-start rounded border px-3 py-2 font-mono text-[11px]"
                    style={{
                      borderColor: "var(--ct-border)",
                      background: "var(--ct-bar)",
                      color: "var(--ct-dec)",
                    }}
                  >
                    {code}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Component categories ──────────────────────────────────────── */}
        <section className="border-t border-fd-border px-6 py-20 md:px-16">
          <div className="mx-auto max-w-6xl">
            <SectionRule label="Components" count="64 total" />

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map(({ name, href, description, count }) => (
                <Link
                  key={name}
                  href={href}
                  className="group flex flex-col gap-3"
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-[1.5rem] text-fd-foreground transition-colors group-hover:text-fd-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {name}
                    </span>
                    <span className="font-mono text-[10px] text-fd-muted-foreground">
                      ×{count}
                    </span>
                  </div>
                  <div className="h-px w-full bg-fd-border transition-colors group-hover:bg-fd-primary" />
                  <p className="text-[11px] leading-relaxed text-fd-muted-foreground transition-colors group-hover:text-fd-foreground">
                    {description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-16 flex flex-wrap items-center gap-6">
              <Link
                href="/docs/guide/getting-started"
                className="group inline-flex items-center gap-2 border border-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary transition-all hover:bg-fd-primary hover:text-fd-primary-foreground"
              >
                Read the guide
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                GitHub ↗
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-fd-border px-6 py-16 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">
            {/* Brand */}
            <div>
              <div className="mb-5 flex items-center gap-2.5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 1024 1024"
                  fill="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient
                      id="footer-logo-g"
                      x1="512"
                      y1="40"
                      x2="512"
                      y2="983"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#B8B8B8" />
                      <stop offset="1" stopColor="#666666" />
                    </linearGradient>
                  </defs>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d={LOGO_PATH}
                    fill="url(#footer-logo-g)"
                  />
                </svg>
                <span
                  className="text-[1.05rem] text-fd-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Kosmesis
                </span>
              </div>
              <p className="mb-6 max-w-[22ch] text-[13px] leading-relaxed text-fd-muted-foreground">
                Copy-paste UI components for PraxisJS, built on top of Morphos.
              </p>
              <p className="font-mono text-[10px] text-fd-muted-foreground">
                MIT · © {new Date().getFullYear()} Mateus Martins
              </p>
            </div>

            {/* Link groups */}
            {FOOTER_LINKS.map(({ group, links }) => (
              <div key={group}>
                <p className="mb-5 font-mono text-[10px] uppercase tracking-widest text-fd-foreground">
                  {group}
                </p>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-[13px] text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
