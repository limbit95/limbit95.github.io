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
      return {
        subject: `[청파 같이] ${payload.title}`,
        text: `${payload.body}\n\n관리자 페이지에서 바로 확인하세요.\n${targetUrl(payload.targetPath, siteUrl)}\n\n이 메일은 최고 관리자 및 회원 관리 권한이 있는 관리자에게 발송되었습니다.`,
      };
    }
    default: {
      const exhaustive: never = template;
      throw new Error(`Unsupported email template: ${exhaustive}`);
    }
  }
}
