export const enum sendgridAttachmentTypes {
  'image/jpeg',
}

type brevoAttachment = {
  url?: string;
  content?: string;
  name?: string;
};

type sendgridAttachment = {
  content?: string;
  type?: sendgridAttachmentTypes;
  filename?: string;
  disposition?: string;
  content_ID?: string;
};

export type SendEmailParams = {
  to: string;
  toName: string;
  text: string;
  html?: string;
  attachments?: sendgridAttachment[] & brevoAttachment[];
};

export type SendEmailHandler = (params: SendEmailParams) => Promise<void>;
