

const WORDS_URL = new URL('/assets/words_alpha.txt', import.meta.url).href;

export type IndexedDictionary = Map<number, Set<string>>;

export async function fetchAndIndexWords(): Promise<IndexedDictionary> {
  try {
    const response = await fetch(WORDS_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch dictionary: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    const words = text.split('\n').map(w => w.trim().toLowerCase());
    
    const index: IndexedDictionary = new Map();
    for (const word of words) {
      if (!word || word.length < 1) continue;
      const len = word.length;
      if (!index.has(len)) {
        index.set(len, new Set());
      }
      index.get(len)!.add(word);
    }
    return index;
  } catch (error) {
    console.error('Dictionary load error:', error);
    // Returning an empty map will result in 0 scores, alerting the user to the failure.
    return new Map();
  }
}
