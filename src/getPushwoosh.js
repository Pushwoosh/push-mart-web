import { Pushwoosh } from 'web-push-notifications';
import { PWSubscriptionButtonWidget } from 'web-push-notifications/widget-subscription-button';

const pushwoosh = new Pushwoosh();

window.Pushwoosh = pushwoosh;

pushwoosh.push(async () => {
  try {
    const widget = new PWSubscriptionButtonWidget(pushwoosh);
    await widget.run();
  } catch (error) {
    console.error('PWSubscriptionButtonWidget initialization failed:', error);
  }
});

export const getPushwoosh = () => pushwoosh;
