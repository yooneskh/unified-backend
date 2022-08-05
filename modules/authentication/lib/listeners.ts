import { EventEmitter } from '../../../services/event-emitter.ts';
import { IVerificationToken } from '../verification-tokens/interfaces.d.ts';
import { Config } from '../../../config.ts';
import { sendLookupSMS } from '../../../plugins/kavenegar/kavenegar-agent.ts';


EventEmitter.on('Resource.VerificationToken.Created', async (_event: string, _verificationTokenId: string, verificationToken: IVerificationToken) => {

  const { channel, channelIdentifier, code } = verificationToken;

  if (channel !== 'sms' || code === Config.authentication.staticVerificationCode) {
    return;
  }

  await sendLookupSMS({
    receptor: channelIdentifier,
    template: 'XXX',
    token: code
  });

});
