import { renderServiceEmailLayout } from "./email-layout.ts";

export type EmailTemplateId = "join_request_received";

export type EmailTemplateDataMap = {
  join_request_received: {
    title: string;
    body: string;
    targetPath?: string | null;
  };
};

export type RenderedEmail = {
  subject: string;
  text: string;
  html: string;
};

const DEFAULT_SITE_URL = "https://limbit95.github.io/";

function targetUrl(path: string | null | undefined, siteUrl: string) {
  return new URL(path || "#/admin/approvals?status=pending", siteUrl).toString();
}

export function renderEmailTemplate<T extends EmailTemplateId>(
  template: T,
  data: EmailTemplateDataMap[T],
  options: { siteUrl?: string } = {},
): RenderedEmail {
  const siteUrl = options.siteUrl || DEFAULT_SITE_URL;

  switch (template) {
    case "join_request_received": {
      const payload = data as EmailTemplateDataMap["join_request_received"];
      const adminUrl = targetUrl(payload.targetPath, siteUrl);
      const footerNote = "이 메일은 최고 관리자 및 회원 관리 권한이 있는 관리자에게 발송되었습니다.";
      return {
        subject: `[청파 같이] ${payload.title}`,
        text: `${payload.body}\n\n관리자 페이지에서 가입 신청 정보를 확인하고 처리해주세요.\n${adminUrl}\n\n${footerNote}`,
        html: renderServiceEmailLayout({
          preheader: payload.body,
          eyebrow: "회원 관리",
          title: payload.title,
          paragraphs: [
            payload.body,
            "관리자 페이지에서 가입 신청 정보를 확인하고 처리해주세요.",
          ],
          action: {
            label: "가입 신청 확인하기",
            url: adminUrl,
          },
          footerNote,
        }),
      };
    }
    default: {
      const exhaustive: never = template;
      throw new Error(`Unsupported email template: ${exhaustive}`);
    }
  }
}
