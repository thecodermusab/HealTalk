import { Resend } from "resend";

type SendEmailPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "noreply@healtalk.com";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendEmail = async ({ to, subject, html, text, from }: SendEmailPayload) => {
  if (!resend) {
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

  await resend.emails.send({
    from: from || emailFrom,
    to,
    subject,
    html: html || text,
  } as any);
};
