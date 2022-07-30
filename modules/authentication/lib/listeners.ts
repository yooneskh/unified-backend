import { EventEmitter } from '../../../services/event-emitter.ts';
import { IVerificationToken } from '../verification-tokens/interfaces.d.ts';
import { makeSendInBlueEmail } from '../../../plugins/send-in-blue/send-in-blue-agent.ts';
import { Config } from '../../../config.ts';


EventEmitter.on('Resource.VerificationToken.Created', async (_event: string, _verificationTokenId: string, verificationToken: IVerificationToken) => {

  const { channel, channelIdentifier, code } = verificationToken;

  if (channel !== 'email' || code === Config.authentication.staticVerificationCode) {
    return;
  }


  const htmlContent = `
    <html>
      <body>
        <h1>
          Welcome To AboutShiraz
        </h1>
        <p>
          You have reqeusted a verification code from AboutShiraz. If you have not, please ignore this email.
        </p>
        <p>
          Verification Code: <strong>${code}</strong>
        </p>
      </body>
    </html>
  `;


  await makeSendInBlueEmail({
    ApiKey: Config.notifications.sendInBlue.apiKey,
    senderName: 'AboutShiraz',
    senderEmail: 'noreply@aboutshiraz.com',
    receivers: [
      {
        name: 'Authentication',
        email: channelIdentifier
      }
    ],
    subject: 'Your Verification Code',
    content: htmlContent
  });

});
