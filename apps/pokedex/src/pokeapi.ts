/**
 * Thin client for https://pokeapi.co — no key, no auth, generous rate limits.
 * PokeAPI asks callers to cache aggressively, so resolved details are memoised
 * for the lifetime of the page.
 */

const API_ROOT = 'https://pokeapi.co/api/v2';

export interface PokemonSummary {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string | null;
}

interface ListResponse {
  count: number;
  next: string | null;
  results: Array<{ name: string; url: string }>;
}

interface PokemonResponse {
  id: number;
  name: string;
  types: Array<{ slot: number; type: { name: string } }>;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
}

const detailCache = new Map<string, Promise<PokemonSummary>>();

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, signal ? { signal } : undefined);

  if (!response.ok) {
    throw new Error(`PokeAPI ${response.status} for ${url}`);
  }

  return (await response.json()) as T;
}

function toSummary(data: PokemonResponse): PokemonSummary {
  return {
    id: data.id,
    name: data.name,
    types: data.types
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => entry.type.name),
    spriteUrl:
      data.sprites.other?.['official-artwork']?.front_default ??
      data.sprites.front_default,
  };
}

/** Fetch one Pokémon by name or id. Results are cached per key. */
export function fetchPokemon(nameOrId: string | number): Promise<PokemonSummary> {
  const key = String(nameOrId).toLowerCase();
  const cached = detailCache.get(key);
  if (cached) return cached;

  const request = getJson<PokemonResponse>(`${API_ROOT}/pokemon/${key}`).then(
    toSummary,
  );

  // Don't cache failures — a transient network error shouldn't poison the key.
  request.catch(() => detailCache.delete(key));
  detailCache.set(key, request);

  return request;
}

/**
 * Fetch a page of Pokémon with their details resolved.
 *
 * The list endpoint returns names and URLs only, so this fans out one request
 * per entry. Keep `limit` modest.
 */
export async function fetchPokemonPage(
  offset: number,
  limit: number,
  signal?: AbortSignal,
): Promise<{ pokemon: PokemonSummary[]; total: number }> {
  const list = await getJson<ListResponse>(
    `${API_ROOT}/pokemon?offset=${offset}&limit=${limit}`,
    signal,
  );

  const pokemon = await Promise.all(
    list.results.map((entry) => fetchPokemon(entry.name)),
  );

  return { pokemon, total: list.count };
}
