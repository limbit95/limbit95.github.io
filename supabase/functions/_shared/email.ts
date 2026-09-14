import {
  renderEmailTemplate,
  type EmailTemplateDataMap,
  type EmailTemplateId,
} from "./email-templates.ts";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const REQUIRED_PROVIDER_SECRETS = ["RESEND_API_KEY", "EMAIL_FROM"] as const;
const REQUIRED_USER_LOOKUP_SECRETS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;

export type EmailDeliveryResult = {
  attempted: number;
  sent: number;
  failed: number;
  reason?: string;
  missing?: string[];
  providerStatus?: number;
  providerCode?: string;
};

type SendEmailOptions<T extends EmailTemplateId> = {
  to: string;
  template: T;
  data: EmailTemplateDataMap[T];
  idempotencyKey: string;
};

type SendUserEmailOptions<T extends EmailTemplateId> = Omit<SendEmailOptions<T>, "to"> & {
  userId: string;
};

function env(name: string) {
  return String(Deno.env.get(name) ?? "").trim();
}

function missingSecrets(names: readonly string[]) {
  return names.filter((name) => !env(name));
}

function serviceHeaders() {
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  return {
    apikey: key,
    authorization: `Bearer ${key}`,
    "content-type": "application/json",
  };
}

async function authUserEmail(userId: string) {
  const response = await fetch(
    `${env("SUPABASE_URL")}/auth/v1/admin/users/${encodeURIComponent(userId)}`,
    { method: "GET", headers: serviceHeaders() },
  );
  if (!response.ok) throw new Error(`SUPABASE_AUTH_${response.status}`);
  const user = await response.json();
  return String(user?.email ?? "").trim();
}

async function readProviderCode(response: Response) {
  try {
    const body = await response.clone().json();
    const code = body?.name ?? body?.code ?? body?.error?.name ?? body?.error?.code;
    return code ? String(code).slice(0, 100) : "";
  } catch {
    return "";
  }
}

export async function sendEmail<T extends EmailTemplateId>({
  to,
  template,
  data,
  idempotencyKey,
}: SendEmailOptions<T>): Promise<EmailDeliveryResult> {
  const missing = missingSecrets(REQUIRED_PROVIDER_SECRETS);
  if (missing.length) {
    console.error("Email delivery skipped: service is not configured", { template, missing });
    return { attempted: 1, sent: 0, failed: 1, reason: "EMAIL_NOT_CONFIGURED", missing };
  }

  const recipient = String(to ?? "").trim();
  if (!recipient) {
    return { attempted: 1, sent: 0, failed: 1, reason: "RECIPIENT_EMAIL_MISSING" };
  }

  try {
    const rendered = renderEmailTemplate(template, data, {
      siteUrl: env("APP_SITE_URL") || undefined,
    });
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env("RESEND_API_KEY")}`,
        "content-type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: env("EMAIL_FROM"),
        to: [recipient],
        subject: rendered.subject,
        text: rendered.text,
      }),
    });

    if (!response.ok) {
      const providerCode = await readProviderCode(response);
      console.error("Email provider delivery failed", {
        template,
        status: response.status,
        providerCode: providerCode || null,
      });
      return {
        attempted: 1,
        sent: 0,
        failed: 1,
        reason: `RESEND_${response.status}`,
        providerStatus: response.status,
        ...(providerCode ? { providerCode } : {}),
      };
    }

    return { attempted: 1, sent: 1, failed: 0 };
  } catch (error) {
    console.error("Email provider request failed", {
      template,
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
    });
    return { attempted: 1, sent: 0, failed: 1, reason: "EMAIL_DELIVERY_FAILED" };
  }
}

export async function sendUserEmail<T extends EmailTemplateId>({
  userId,
  template,
  data,
  idempotencyKey,
}: SendUserEmailOptions<T>): Promise<EmailDeliveryResult> {
  const missing = missingSecrets([
    ...REQUIRED_PROVIDER_SECRETS,
    ...REQUIRED_USER_LOOKUP_SECRETS,
  ]);
  if (missing.length) {
    console.error("Email delivery skipped: service is not configured", { template, missing });
    return { attempted: 1, sent: 0, failed: 1, reason: "EMAIL_NOT_CONFIGURED", missing };
  }

  try {
    const email = await authUserEmail(userId);
    if (!email) {
      console.error("Email delivery skipped: recipient has no email", { template });
      return { attempted: 1, sent: 0, failed: 1, reason: "RECIPIENT_EMAIL_MISSING" };
    }
    return await sendEmail({ to: email, template, data, idempotencyKey });
  } catch (error) {
    console.error("Email recipient lookup failed", {
      template,
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
    });
    return { attempted: 1, sent: 0, failed: 1, reason: "EMAIL_DELIVERY_FAILED" };
  }
}
