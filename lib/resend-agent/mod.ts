

interface IResendMailSendOptions {
  authorization: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
}

export async function sendResendMail(options: IResendMailSendOptions) {

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': options.authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error('could not send email: ' + await response.text());
  }

}
