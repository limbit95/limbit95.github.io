import {
  renderEmailTemplate,
  type EmailTemplateDataMap,
  type EmailTemplateId,
} from "./email-templates.ts";
import {
  emailTransportMissingSecrets,
  sendRenderedEmail,
  type EmailDeliveryResult,
} from "./email-transport.ts";

export type { EmailDeliveryResult } from "./email-transport.ts";

const REQUIRED_USER_LOOKUP_SECRETS = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;

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

export async function sendEmail<T extends EmailTemplateId>({
  to,
  template,
  data,
  idempotencyKey,
}: SendEmailOptions<T>): Promise<EmailDeliveryResult> {
  const missing = emailTransportMissingSecrets();
  if (missing.length) {
    console.error("Email delivery skipped: service is not configured", { template, missing });
    return { attempted: 1, sent: 0, failed: 1, reason: "EMAIL_NOT_CONFIGURED", missing };
  }

  const recipient = String(to ?? "").trim();
  if (!recipient) {
    return { attempted: 1, sent: 0, failed: 1, reason: "RECIPIENT_EMAIL_MISSING" };
  }

  const rendered = renderEmailTemplate(template, data, {
    siteUrl: env("APP_SITE_URL") || undefined,
  });
  return await sendRenderedEmail({
    to: recipient,
    template,
    rendered,
    idempotencyKey,
  });
}

export async function sendUserEmail<T extends EmailTemplateId>({
  userId,
  template,
  data,
  idempotencyKey,
}: SendUserEmailOptions<T>): Promise<EmailDeliveryResult> {
  const missing = [
    ...emailTransportMissingSecrets(),
    ...missingSecrets(REQUIRED_USER_LOOKUP_SECRETS),
  ];
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
