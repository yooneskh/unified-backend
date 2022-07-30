import { EventEmitter } from '../../services/event-emitter.ts';
import { sendLookupSMS } from '../../plugins/kavenegar/kavenegar-agent.ts';


EventEmitter.on('Resource.xxx.xxx', (_event: string, _xxxId: string/* , _xxx: IEventRegistration */) => {

  sendLookupSMS({
    receptor: 'xxx',
    template: 'xxx',
    token: 'xxx'
  });

});
