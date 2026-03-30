interface GoogleSlidesPopupOptions {
  title: string;
  message: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  autoOpenHref?: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildGoogleSlidesImportUrl(fileUrl: string) {
  return `https://docs.google.com/presentation/u/0/?usp=import&url=${encodeURIComponent(fileUrl)}`;
}

export function writeGoogleSlidesPopup(
  popupWindow: Window | null,
  {
    title,
    message,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    autoOpenHref,
  }: GoogleSlidesPopupOptions,
) {
  if (!popupWindow || popupWindow.closed) return false;

  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const safePrimaryHref = primaryHref ? escapeHtml(primaryHref) : null;
  const safePrimaryLabel = primaryLabel ? escapeHtml(primaryLabel) : null;
  const safeSecondaryHref = secondaryHref ? escapeHtml(secondaryHref) : null;
  const safeSecondaryLabel = secondaryLabel ? escapeHtml(secondaryLabel) : null;
  const autoOpenScript = autoOpenHref
    ? `
      <script>
        const autoOpenHref = ${JSON.stringify(autoOpenHref)};
        window.setTimeout(() => {
          const link = document.getElementById("primary-link");
          if (link) link.click();
        }, 80);
        window.setTimeout(() => {
          try {
            window.location.replace(autoOpenHref);
          } catch (error) {
            console.error(error);
          }
        }, 180);
      </script>
    `
    : "";

  popupWindow.document.open();
  popupWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${safeTitle}</title>
        <style>
          :root { color-scheme: light; }
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #f8fafc;
            color: #0f172a;
            font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          }
          .card {
            width: min(520px, calc(100vw - 32px));
            box-sizing: border-box;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
          }
          h1 {
            margin: 0 0 12px;
            font-size: 22px;
            line-height: 1.2;
          }
          p {
            margin: 0;
            line-height: 1.6;
            color: #475569;
          }
          .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 20px;
          }
          a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
            padding: 0 16px;
            border-radius: 999px;
            font-weight: 600;
            text-decoration: none;
          }
          .primary {
            background: #0f172a;
            color: white;
          }
          .secondary {
            border: 1px solid #cbd5e1;
            color: #0f172a;
          }
        </style>
      </head>
      <body>
        <main class="card">
          <h1>${safeTitle}</h1>
          <p>${safeMessage}</p>
          <div class="actions">
            ${safePrimaryHref && safePrimaryLabel ? `<a id="primary-link" class="primary" href="${safePrimaryHref}" target="_self" rel="noreferrer">${safePrimaryLabel}</a>` : ""}
            ${safeSecondaryHref && safeSecondaryLabel ? `<a class="secondary" href="${safeSecondaryHref}" target="_self" rel="noreferrer">${safeSecondaryLabel}</a>` : ""}
          </div>
        </main>
        ${autoOpenScript}
      </body>
    </html>
  `);
  popupWindow.document.close();

  return true;
}