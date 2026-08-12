import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export type DsButtonVariant = 'primary' | 'secondary' | 'ghost';
export type DsButtonSize = 'sm' | 'md' | 'lg';

/**
 * A button.
 *
 * @slot - The button label.
 * @slot leading - Content placed before the label, typically an icon.
 * @fires ds-click - Dispatched on activation. Suppressed while disabled or loading.
 *
 * @csspart button - The native button element.
 */
@customElement('ds-button')
export class DsButton extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      /* The host is the sizing boundary; let consumers stretch it. */
      vertical-align: middle;
    }

    :host([full-width]) {
      display: block;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--ds-space-2, 0.5rem);
      width: 100%;
      margin: 0;
      border: 1px solid transparent;
      border-radius: var(--ds-radius-md, 8px);
      font-family: var(--ds-font-family, system-ui, sans-serif);
      font-weight: var(--ds-font-weight-medium, 550);
      line-height: 1.2;
      cursor: pointer;
      transition:
        background-color var(--ds-transition-fast, 120ms ease),
        border-color var(--ds-transition-fast, 120ms ease),
        color var(--ds-transition-fast, 120ms ease);
    }

    button:focus-visible {
      outline: 2px solid var(--ds-color-focus, #7aa2ff);
      outline-offset: 2px;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    /* Sizes */
    .size-sm {
      padding: var(--ds-space-1, 0.25rem) var(--ds-space-3, 0.75rem);
      font-size: var(--ds-font-size-sm, 0.8125rem);
      min-height: 1.75rem;
    }

    .size-md {
      padding: var(--ds-space-2, 0.5rem) var(--ds-space-4, 1rem);
      font-size: var(--ds-font-size-md, 0.9375rem);
      min-height: 2.25rem;
    }

    .size-lg {
      padding: var(--ds-space-3, 0.75rem) var(--ds-space-5, 1.5rem);
      font-size: var(--ds-font-size-lg, 1.0625rem);
      min-height: 2.75rem;
    }

    /* Variants */
    .variant-primary {
      background-color: var(--ds-color-primary, #2f5bd8);
      color: var(--ds-color-primary-text, #fff);
    }

    .variant-primary:hover:not(:disabled) {
      background-color: var(--ds-color-primary-hover, #2749ad);
    }

    .variant-secondary {
      background-color: var(--ds-color-surface, #f5f6f8);
      border-color: var(--ds-color-border, #d9dce2);
      color: var(--ds-color-text, #14171f);
    }

    .variant-secondary:hover:not(:disabled) {
      border-color: var(--ds-color-primary, #2f5bd8);
      color: var(--ds-color-primary, #2f5bd8);
    }

    .variant-ghost {
      background-color: transparent;
      color: var(--ds-color-text, #14171f);
    }

    .variant-ghost:hover:not(:disabled) {
      background-color: var(--ds-color-surface, #f5f6f8);
    }

    /* Loading */
    .spinner {
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 700ms linear infinite;
      flex: none;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }

      .spinner {
        animation-duration: 2s;
      }
    }
  `;

  /** Visual emphasis. */
  @property({ reflect: true })
  variant: DsButtonVariant = 'primary';

  /** Controls height and text size. */
  @property({ reflect: true })
  size: DsButtonSize = 'md';

  /** Prevents interaction and dims the button. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Shows a spinner and blocks activation, without collapsing the button's
   * width the way swapping the label out would.
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /** Stretch to the width of the containing block. */
  @property({ type: Boolean, reflect: true, attribute: 'full-width' })
  fullWidth = false;

  /** Native button behaviour when used inside a form. */
  @property()
  type: 'button' | 'submit' | 'reset' = 'button';

  /** Accessible name, for icon-only buttons with no text in the default slot. */
  @property()
  label?: string;

  override render() {
    const inert = this.disabled || this.loading;

    return html`
      <button
        part="button"
        class=${classMap({
          [`variant-${this.variant}`]: true,
          [`size-${this.size}`]: true,
        })}
        type=${this.type}
        ?disabled=${inert}
        aria-busy=${this.loading ? 'true' : nothing}
        aria-label=${this.label ?? nothing}
        @click=${this.#handleClick}
      >
        ${this.loading
          ? html`<span class="spinner" aria-hidden="true"></span>`
          : html`<slot name="leading"></slot>`}
        <slot></slot>
      </button>
    `;
  }

  #handleClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('ds-click', { bubbles: true, composed: true }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
  }
}
