import { SmtpClient } from 'smtp';


interface ISmtpEmailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}

export async function sendSmtpEmail(config: ISmtpEmailConfig) {

  const client = new SmtpClient();

  await client.connect({
    hostname: config.host,
    port: config.port,
    username: config.username,
    password: config.password
  });

  await client.send({
    from: config.from,
    to: config.to,
    subject: config.subject,
    content: config.html,
    html: config.html
  });


  await client.close();

}