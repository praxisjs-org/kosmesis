import { ImageResponse } from 'next/og';

const LOGO_PATH =
  'M605.411 445.66L641.322 498.293L641.342 498.278L697.538 578.57L742.673 512.806L512.5 178.878L281.327 512.806L512.5 848.182L603.519 715.561L650.559 782.134L512.701 983L187 510.478L512.701 40L837 510.478L698.206 712.709L668.895 671.104L604.033 578.775L512 712.504L373.199 511.5L512.233 309.092L584.13 414.469L536.746 480.456L513.69 445.66L466.305 511.5L512.166 577.425L556.48 513.91L605.411 445.66Z';

let fonts: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;

async function loadFonts() {
  if (fonts) return fonts;

  const [regularCss, boldCss] = await Promise.all([
    fetch('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    }).then((r) => r.text()),
    fetch('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    }).then((r) => r.text()),
  ]);

  const toUrl = (css: string) => css.match(/url\(([^)]+)\)/)?.[1] ?? '';

  const [regular, bold] = await Promise.all([
    fetch(toUrl(regularCss)).then((r) => r.arrayBuffer()),
    fetch(toUrl(boldCss)).then((r) => r.arrayBuffer()),
  ]);

  fonts = { regular, bold };
  return fonts;
}

export async function renderOGImage({
  title,
  description,
  url = 'kosmesis.praxisjs.org',
}: {
  title: string;
  description?: string;
  url?: string;
}) {
  const { regular, bold } = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#121212',
          padding: '56px 64px',
          fontFamily: 'DM Sans',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft glow */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Watermark logo */}
        <svg
          width="500"
          height="500"
          viewBox="0 0 1024 1024"
          fill="none"
          style={{
            position: 'absolute',
            right: -80,
            bottom: -80,
            opacity: 0.06,
          }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={LOGO_PATH}
            fill="#999999"
          />
        </svg>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="32" height="32" viewBox="0 0 1024 1024" fill="none">
            <defs>
              <linearGradient
                id="og-logo-g"
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
              fill="url(#og-logo-g)"
            />
          </svg>
          <span
            style={{
              color: '#e5e5e5',
              fontSize: 20,
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            Kosmesis
          </span>
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            maxWidth: 920,
          }}
        >
          <div
            style={{
              color: '#f2f2f2',
              fontSize: title.length > 30 ? 58 : 70,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                color: '#999999',
                fontSize: 24,
                lineHeight: 1.55,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxWidth: 820,
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 32,
              height: 1,
              background: '#333333',
            }}
          />
          <span
            style={{
              color: '#666666',
              fontSize: 14,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            {url}
          </span>
        </div>

        {/* Bottom rule */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              'linear-gradient(90deg, transparent 0%, #666666 30%, #B8B8B8 50%, #666666 70%, transparent 100%)',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'DM Sans', data: regular, weight: 400 },
        { name: 'DM Sans', data: bold, weight: 700 },
      ],
    },
  );
}
