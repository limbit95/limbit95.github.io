export type EmailLayoutAction = {
  label: string;
  url: string;
};

export type EmailLayoutOptions = {
  preheader?: string;
  eyebrow?: string;
  title: string;
  paragraphs?: string[];
  action?: EmailLayoutAction;
  footerNote?: string;
};

const BRAND_NAME = "청파 같이";
const BRAND_ACCENT = "#c9e3ec";
const BRAND_INK = "#3f6270";
const TEXT_PRIMARY = "#24363d";
const TEXT_SECONDARY = "#66777e";
const SURFACE = "#ffffff";
const PAGE = "#f4f9fb";
const LINE = "#dcebef";

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraphHtml(paragraph: string) {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:${TEXT_PRIMARY};">${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`;
}

function actionHtml(action: EmailLayoutAction | undefined) {
  if (!action) return "";
  return `
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 8px;">
                      <tr>
                        <td bgcolor="${BRAND_ACCENT}" style="border-radius:12px;">
                          <a href="${escapeHtml(action.url)}" style="display:inline-block;padding:13px 20px;font-size:14px;font-weight:800;line-height:1.2;color:${BRAND_INK};text-decoration:none;border:1px solid #bad9e4;border-radius:12px;">${escapeHtml(action.label)}</a>
                        </td>
                      </tr>
                    </table>`;
}

export function renderServiceEmailLayout({
  preheader = "",
  eyebrow = "알림",
  title,
  paragraphs = [],
  action,
  footerNote = "본 메일은 청파 같이 서비스에서 발송한 안내 메일입니다.",
}: EmailLayoutOptions) {
  const body = paragraphs.map(paragraphHtml).join("\n");
  const safePreheader = escapeHtml(preheader || title);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${PAGE};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans KR',Arial,sans-serif;color:${TEXT_PRIMARY};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:${PAGE};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:${SURFACE};border:1px solid ${LINE};border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:22px 28px;background:${SURFACE};border-bottom:1px solid ${LINE};">
                <div style="font-size:18px;font-weight:900;letter-spacing:-0.02em;color:${BRAND_INK};">${BRAND_NAME}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 28px 28px;">
                <div style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:0.08em;color:#6f8f9b;">${escapeHtml(eyebrow)}</div>
                <h1 style="margin:0 0 20px;font-size:26px;line-height:1.35;letter-spacing:-0.03em;color:${TEXT_PRIMARY};">${escapeHtml(title)}</h1>
                ${body}
                ${actionHtml(action)}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 26px;border-top:1px solid ${LINE};background:#fbfdfe;">
                <p style="margin:0;font-size:12px;line-height:1.65;color:${TEXT_SECONDARY};">${escapeHtml(footerNote)}</p>
                <p style="margin:8px 0 0;font-size:12px;line-height:1.65;color:#8a989e;">© 청파 같이</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
