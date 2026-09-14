import nodemailer from "npm:nodemailer@9.1.1";
import {
  renderEmailTemplate,
  type EmailTemplateDataMap,
  type EmailTemplateId,
} from "./email-templates.ts";

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465;
const REQUIRED_PROVIDER_SECRETS = ["SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM"] as const;
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

type SmtpError = Error & {
  code?: string;
  responseCode?: number;
  command?: string;
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

function createSmtpTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: env("SMTP_USERNAME"),
      pass: env("SMTP_PASSWORD"),
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

function messageIdFor(idempotencyKey: string) {
  const safeKey = String(idempotencyKey ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, 180) || crypto.randomUUID();
  const from = env("SMTP_FROM");
  const domain = from.match(/@([^>\s]+)/)?.[1] || "gmail.com";
  return `<${safeKey}@${domain}>`;
}

function smtpErrorDetails(error: unknown) {
  const smtpError = error as SmtpError;
  const providerCode = smtpError?.code ? String(smtpError.code).slice(0, 100) : "";
  const providerStatus = Number(smtpError?.responseCode);
  const command = smtpError?.command ? String(smtpError.command).slice(0, 100) : "";
  return {
    providerCode,
    providerStatus: Number.isFinite(providerStatus) && providerStatus > 0 ? providerStatus : undefined,
    command,
  };
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
    const transport = createSmtpTransport();
    const result = await transport.sendMail({
      from: env("SMTP_FROM"),
      to: recipient,
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
      messageId: messageIdFor(idempotencyKey),
      headers: {
        "X-Cheongpa-Idempotency-Key": idempotencyKey,
      },
    });

    if (!Array.isArray(result.accepted) || result.accepted.length === 0) {
      console.error("Email SMTP delivery was not accepted", { template });
      return { attempted: 1, sent: 0, failed: 1, reason: "SMTP_NOT_ACCEPTED" };
    }

    return { attempted: 1, sent: 1, failed: 0 };
  } catch (error) {
    const { providerCode, providerStatus, command } = smtpErrorDetails(error);
    console.error("Email SMTP delivery failed", {
      template,
      providerStatus: providerStatus ?? null,
      providerCode: providerCode || null,
      command: command || null,
    });
    return {
      attempted: 1,
      sent: 0,
      failed: 1,
      reason: providerCode ? `SMTP_${providerCode}` : "SMTP_DELIVERY_FAILED",
      ...(providerStatus ? { providerStatus } : {}),
      ...(providerCode ? { providerCode } : {}),
    };
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
