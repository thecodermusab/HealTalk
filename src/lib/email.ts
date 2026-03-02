import { Resend } from "resend";

type SendEmailPayload = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "noreply@healtalk.com";
const emailReplyTo = process.env.EMAIL_REPLY_TO;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendEmail = async ({ to, subject, html, text, from }: SendEmailPayload) => {
  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email service is not configured (missing RESEND_API_KEY).");
    }

    console.log("==================================================================");
    console.log("                      EMAIL DELIVERY (MOCK)                      ");
    console.log("------------------------------------------------------------------");
    console.log(`To: ${to}`);
    console.log(`From: ${from || emailFrom}`);
    console.log(`Subject: ${subject}`);
    if (text) {
      console.log("Text:");
      console.log(text);
    }
    if (html) {
      console.log("HTML:");
      console.log(html);
    }
    console.log("==================================================================");
    return;
  }

  const body = html ? { html } : { text: text || "(no content)" };
  try {
    const response = await resend.emails.send({
      from: from || emailFrom,
      to,
      subject,
      ...(emailReplyTo ? { replyTo: emailReplyTo } : {}),
      ...body,
    });

    if (response.error) {
      throw new Error(`Resend API error: ${response.error.message}`);
    }

    return response.data;
  } catch (err) {
    // Log delivery failures but don't crash the calling route.
    // The caller is responsible for deciding whether to surface this error.
    console.error("Email delivery failed:", err);
    throw err;
  }
};
