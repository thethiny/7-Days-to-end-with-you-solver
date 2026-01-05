

// Use the local words_alpha.txt file from the assets folder
const WORDS_URL = '/assets/words_alpha.txt';

export type IndexedDictionary = Map<number, Set<string>>;

export async function fetchAndIndexWords(): Promise<IndexedDictionary> {
  try {
    const response = await fetch(WORDS_URL);
    if (!response.ok) {
        // If direct fetch fails, it might be a CORS issue in some environments. 
        // We'll try a fallback to common small words if the fetch is completely blocked, 
        // but the standard raw URL usually works.
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
