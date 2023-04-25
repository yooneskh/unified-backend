import { EventEmitter } from '../../../services/event-emitter.ts';
import { IVerificationToken } from '../verification-tokens/interfaces.d.ts';
import { Config } from '../../../config.ts';
import { sendLookupSMS } from '../../../plugins/kavenegar/kavenegar-agent.ts';
import { makeSendInBlueEmail } from '../../../plugins/send-in-blue/send-in-blue-agent.ts';


EventEmitter.on('Resource.VerificationToken.Created', async (_event: string, _verificationTokenId: string, verificationToken: IVerificationToken) => {

  const { channel, channelIdentifier, code } = verificationToken;

  if (code === Config.authentication.staticVerificationCode) {
    return;
  }

  if (channel === 'sms') {
    await sendLookupSMS({
      receptor: channelIdentifier,
      template: 'XXX',
      token: code
    });
  }
  else if (channel === 'email') {
    await makeSendInBlueEmail({
      apiKey: Config.notifications.sendInBlue.apiKey,
      senderName: 'xxx',
      senderEmail: 'xxx',
      subject: 'Authentication Code',
      receivers: [
        {
          name: 'You',
          email: channelIdentifier
        }
      ],
      content: (
        `Welcome.

        Please use ${code} code to enter.`
      )
    });
  }

});
