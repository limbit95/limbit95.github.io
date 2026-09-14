import nodemailer from "npm:nodemailer@9.1.1";

const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465;
const REQUIRED_TRANSPORT_SECRETS = ["SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM"] as const;

export type EmailDeliveryResult = {
  attempted: number;
  sent: number;
  failed: number;
  reason?: string;
  missing?: string[];
  providerStatus?: number;
  providerCode?: string;
};

export type RenderedEmailMessage = {
  subject: string;
  text: string;
  html: string;
};

type SendRenderedEmailOptions = {
  to: string;
  template: string;
  rendered: RenderedEmailMessage;
  idempotencyKey: string;
};

type SmtpError = Error & {
  code?: string;
  responseCode?: number;
  command?: string;
};

function env(name: string) {
  return String(Deno.env.get(name) ?? "").trim();
}

export function emailTransportMissingSecrets() {
  return REQUIRED_TRANSPORT_SECRETS.filter((name) => !env(name));
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

export async function sendRenderedEmail({
  to,
  template,
  rendered,
  idempotencyKey,
}: SendRenderedEmailOptions): Promise<EmailDeliveryResult> {
  const missing = emailTransportMissingSecrets();
  if (missing.length) {
    console.error("Email delivery skipped: SMTP transport is not configured", { template, missing });
    return { attempted: 1, sent: 0, failed: 1, reason: "EMAIL_NOT_CONFIGURED", missing };
  }

  try {
    const transport = createSmtpTransport();
    const result = await transport.sendMail({
      from: env("SMTP_FROM"),
      to,
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
