export const getTestEmailURL = (data: any): string => {
  const secret: string = data.response.split('MSGID=').reverse()[0];
  return `https://ethereal.email/message/${secret.substring(
    0,
    secret.length - 1,
  )}`;
};
