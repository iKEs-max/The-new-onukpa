import crypto from 'crypto';

export const generateTicketNumber = (): string => {
  const prefix = 'WKM';
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${randomStr}`;
};
