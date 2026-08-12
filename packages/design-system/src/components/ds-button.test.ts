import { describe, expect, it } from 'vitest';

import './ds-button.js';
import type { DsButton } from './ds-button.js';

async function mount(html: string): Promise<DsButton> {
  document.body.innerHTML = html;
  const element = document.body.firstElementChild as DsButton;
  await element.updateComplete;
  return element;
}

describe('ds-button', () => {
  it('renders slotted content inside a native button', async () => {
    const element = await mount('<ds-button>Catch it</ds-button>');

    expect(element.shadowRoot?.querySelector('button')).not.toBeNull();
    expect(element.textContent).toContain('Catch it');
  });

  it('emits ds-click when activated', async () => {
    const element = await mount('<ds-button>Catch it</ds-button>');
    let fired = 0;
    element.addEventListener('ds-click', () => (fired += 1));

    element.shadowRoot?.querySelector('button')?.click();

    expect(fired).toBe(1);
  });

  it('does not emit ds-click while loading', async () => {
    const element = await mount('<ds-button loading>Catch it</ds-button>');
    let fired = 0;
    element.addEventListener('ds-click', () => (fired += 1));

    element.shadowRoot?.querySelector('button')?.click();

    expect(fired).toBe(0);
  });

  it('marks the native button busy while loading', async () => {
    const element = await mount('<ds-button loading>Catch it</ds-button>');
    const button = element.shadowRoot?.querySelector('button');

    expect(button?.getAttribute('aria-busy')).toBe('true');
    expect(button?.disabled).toBe(true);
  });
});
