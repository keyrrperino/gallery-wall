import { config } from '../config';
import type { SendEmailHandler } from '../types';

const { from, fromName, subject } = config;

export const sendBrevo: SendEmailHandler = async ({
  to,
  toName,
  text,
  html,
  attachments,
}) => {
  try {
    const emailPayload = {
      sender: {
        name: fromName,
        email: from,
      },
      attachment: attachments,
      to: [
        {
          email: to,
          name: toName,
        },
      ],
      htmlContent: html,
      textContent: text,
      subject,
    };

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not send email');
  }
};
