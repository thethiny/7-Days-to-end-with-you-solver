
import { IndexedDictionary } from './wordService';
import { ShiftResult } from '../types';

/**
 * Standard Levenshtein distance calculation matching the logic in the Python snippet.
 */
function levenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;
  if (a === b) return 0;
  if (la === 0) return lb;
  if (lb === 0) return la;

  let prev = Array.from({ length: lb + 1 }, (_, i) => i);
  for (let i = 1; i <= la; i++) {
    const cur = [i];
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur.push(Math.min(
        cur[j - 1] + 1,    // insertion
        prev[j] + 1,       // deletion
        prev[j - 1] + cost // substitution
      ));
    }
    prev = cur;
  }
  return prev[lb];
}

/**
 * Replicates the specific Caesar shift logic provided in the Python snippet:
 * if raw >= 25: raw += 1
 */
export function caesarShift(text: string, k: number): string {
  const base = 65; // charCode for 'A'
  return text.split('').map(char => {
    const upper = char.toUpperCase();
    if (upper >= 'A' && upper <= 'Z') {
      // Python logic: raw = ord(ch) - base + k
      let raw = char.charCodeAt(0) - base + k;
      if (raw >= 25) {
        raw += 1;
      }
      // Python logic: chr((raw % 26) + base)
      return String.fromCharCode(((raw % 26) + base));
    }
    return char;
  }).join('');
}

/**
 * English scoring logic following the Python implementation exactly:
 * 1. Exact match gets 10 * length.
 * 2. Partial match gets (length - best_d) * length.
 */
export function scoreEnglish(text: string, dictionary: IndexedDictionary): number {
  if (!dictionary || dictionary.size === 0) return 0;
  
  // Python: tokens = re.findall(r"[A-Za-z]+", text)
  const tokens = text.match(/[A-Za-z]+/g) || [];
  let totalScore = 0;

  for (const token of tokens) {
    const w = token.toLowerCase();
    const L = w.length;
    
    // Python: candidates = dict_by_len.get(L)
    const candidates = dictionary.get(L);
    if (!candidates) continue;

    // Python: if w in set(candidates): score += 10 * L
    if (candidates.has(w)) {
      totalScore += 10 * L;
      continue;
    }

    // Python: Find best distance among candidates of same length
    let bestDist = L;
    for (const cand of candidates) {
      const d = levenshtein(w, cand);
      if (d < bestDist) {
        bestDist = d;
        // Optimization: Can't get better than 1 if exact match wasn't found in Set.
        if (bestDist === 1) break;
      }
    }
    
    // Python: credit = max(0, L - best_d) * L
    totalScore += Math.max(0, L - bestDist) * L;
  }

  return totalScore;
}

export function analyzeShifts(input: string, dictionary: IndexedDictionary): ShiftResult[] {
  const results: ShiftResult[] = [];
  
  for (let k = 0; k < 26; k++) {
    const shifted = caesarShift(input, k);
    const score = scoreEnglish(shifted, dictionary);
    results.push({ shift: k, text: shifted, score, rank: 0 });
  }

  // Rank by score descending, then by shift index
  const ranked = [...results].sort((a, b) => b.score - a.score || a.shift - b.shift);
  ranked.forEach((res, index) => {
    const original = results.find(r => r.shift === res.shift);
    if (original) original.rank = index + 1;
  });

  return results;
}
