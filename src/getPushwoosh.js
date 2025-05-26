import { Pushwoosh } from 'web-push-notifications';

const pushwoosh = new Pushwoosh();

window.Pushwoosh = pushwoosh;

export const getPushwoosh = () => pushwoosh;
