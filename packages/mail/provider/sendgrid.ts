import { config } from '../config';
import type { SendEmailHandler } from '../types';

const { from, fromName, subject } = config;

export const sendSendgrid: SendEmailHandler = async ({
  to,
  toName,
  html,
  text,
  attachments,
}) => {
  try {
    const emailPayload = {
      personalizations: [
        {
          to: [
            {
              email: to,
              name: toName,
            },
          ],
          subject,
        },
      ],
      content: [
        {
          type: html ? 'text/html' : 'text/plain',
          value: html ?? text,
        },
      ],
      from: {
        email: from,
        name: fromName,
      },
      attachments: attachments,
    };
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: process.env.SENDGRID_API_KEY ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });
  } catch (error) {
    console.error(error);
    throw new Error('Could not send email');
  }
};
