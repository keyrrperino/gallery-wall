export const config = {
  from: process.env.EMAIL_FROM ?? '',
  fromName: process.env.EMAIL_FROM_NAME ?? '',
  subject: process.env.EMAIL_SUBJECT ?? '',
};
