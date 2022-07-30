

export interface ISendInBlueEmailConfig {
  ApiKey: string;
  senderName: string;
  senderEmail: string;
  receivers: {
    name: string;
    email: string;
  }[];
  subject: string;
  content: string;
}

export async function makeSendInBlueEmail(config: ISendInBlueEmailConfig) {

  const payload = {
    sender: {
      name: config.senderName,
      email: config.senderEmail
    },
    to: config.receivers,
    subject: config.subject,
    htmlContent: config.content
  };


  const url = 'https://api.sendinblue.com/v3/smtp/email';

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Api-Key': config.ApiKey
    },
    body: JSON.stringify(payload)
  });


  if (response.status !== 201) {
    throw new Error(`could not send send-in-blue email ${response.status} ${await response.text()}`);
  }

}
