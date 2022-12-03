import { Notify } from 'quasar';

export function copyToClipboard(value: string): void {
  navigator.clipboard.writeText(value);
  Notify.create({
    message: 'Copied to Clipboard',
    icon: 'inventory',
    position: 'top',
    timeout: 500,
  });
}
