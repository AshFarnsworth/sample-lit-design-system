import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import '@lit-ds/design-system';
import { fetchPokemonPage, type PokemonSummary } from './pokeapi.js';

const PAGE_SIZE = 24;

/**
 * App shell. Deliberately thin — the grid tiles below are plain markup so that
 * they can be replaced by real design-system components (`ds-card`, `ds-badge`,
 * `ds-input`, …) as those get built.
 */
@customElement('pokedex-app')
export class PokedexApp extends LitElement {
  static override styles = css`
    :host {
      display: block;
      min-height: 100vh;
      padding: var(--ds-space-6, 2rem) var(--ds-space-4, 1rem);
      background: var(--ds-color-bg, #fff);
      color: var(--ds-color-text, #14171f);
      font-family: var(--ds-font-family, system-ui, sans-serif);
    }

    .shell {
      max-width: 72rem;
      margin: 0 auto;
    }

    header {
      margin-bottom: var(--ds-space-6, 2rem);
    }

    h1 {
      margin: 0 0 var(--ds-space-2, 0.5rem);
      font-size: 2rem;
      letter-spacing: -0.02em;
    }

    p.lede {
      margin: 0;
      color: var(--ds-color-text-muted, #5b6270);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
      gap: var(--ds-space-4, 1rem);
    }

    /* TODO: replace with <ds-card> once it exists. */
    .tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ds-space-2, 0.5rem);
      padding: var(--ds-space-4, 1rem);
      border: 1px solid var(--ds-color-border, #d9dce2);
      border-radius: var(--ds-radius-lg, 12px);
      background: var(--ds-color-surface, #f5f6f8);
      box-shadow: var(--ds-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.08));
      text-align: center;
    }

    .tile img {
      width: 6rem;
      height: 6rem;
      object-fit: contain;
    }

    .tile .num {
      font-size: var(--ds-font-size-sm, 0.8125rem);
      color: var(--ds-color-text-muted, #5b6270);
      font-variant-numeric: tabular-nums;
    }

    .tile .name {
      font-weight: var(--ds-font-weight-medium, 550);
      text-transform: capitalize;
    }

    /* TODO: replace with <ds-badge>. */
    .types {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--ds-space-1, 0.25rem);
    }

    .types span {
      padding: 0.1rem var(--ds-space-2, 0.5rem);
      border: 1px solid var(--ds-color-border, #d9dce2);
      border-radius: var(--ds-radius-pill, 999px);
      font-size: var(--ds-font-size-sm, 0.8125rem);
      text-transform: capitalize;
    }

    .footer {
      display: flex;
      justify-content: center;
      margin-top: var(--ds-space-6, 2rem);
    }

    .error {
      padding: var(--ds-space-4, 1rem);
      border: 1px solid currentColor;
      border-radius: var(--ds-radius-md, 8px);
      color: #b3261e;
    }
  `;

  @state() private pokemon: PokemonSummary[] = [];
  @state() private total = 0;
  @state() private loading = false;
  @state() private error: string | null = null;

  override connectedCallback() {
    super.connectedCallback();
    void this.#loadNextPage();
  }

  override render() {
    const hasMore = this.pokemon.length < this.total;

    return html`
      <div class="shell">
        <header>
          <h1>Pokédex</h1>
          <p class="lede">
            ${this.total
              ? `${this.pokemon.length} of ${this.total} loaded`
              : 'Loading…'}
          </p>
        </header>

        ${this.error
          ? html`<p class="error" role="alert">${this.error}</p>`
          : nothing}

        <div class="grid">
          ${repeat(
            this.pokemon,
            (entry) => entry.id,
            (entry) => html`
              <article class="tile">
                ${entry.spriteUrl
                  ? html`<img
                      src=${entry.spriteUrl}
                      alt=${entry.name}
                      loading="lazy"
                    />`
                  : nothing}
                <span class="num">#${String(entry.id).padStart(4, '0')}</span>
                <span class="name">${entry.name.replace(/-/g, ' ')}</span>
                <div class="types">
                  ${entry.types.map((type) => html`<span>${type}</span>`)}
                </div>
              </article>
            `,
          )}
        </div>

        ${hasMore || this.loading
          ? html`
              <div class="footer">
                <ds-button
                  size="lg"
                  ?loading=${this.loading}
                  @ds-click=${this.#loadNextPage}
                >
                  Load more
                </ds-button>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  #loadNextPage = async () => {
    if (this.loading) return;

    this.loading = true;
    this.error = null;

    try {
      const { pokemon, total } = await fetchPokemonPage(
        this.pokemon.length,
        PAGE_SIZE,
      );
      this.pokemon = [...this.pokemon, ...pokemon];
      this.total = total;
    } catch (cause) {
      this.error =
        cause instanceof Error
          ? `Could not reach PokeAPI: ${cause.message}`
          : 'Could not reach PokeAPI.';
    } finally {
      this.loading = false;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'pokedex-app': PokedexApp;
  }
}
