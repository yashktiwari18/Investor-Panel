import type { Venture } from '../types';

/**
 * Accurate relevance scoring function for search across ventures.
 * Ranks exact matches first, followed by prefix and word matches.
 */
export function getSearchRelevance(v: Venture, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const name = v.name.toLowerCase();
  const cat = v.category.toLowerCase();
  const founder = v.founder.toLowerCase();
  const wordsInName = name.split(/[\s\-]+/);

  // 1. Exact name match
  if (name === q) return 1000;
  // 2. Name starts with query (e.g. "Medi" -> "MediConnect")
  if (name.startsWith(q)) return 500;
  // 3. Any word in name starts with query (e.g. "AI" -> "Smart Farming with AI")
  if (wordsInName.some((w) => w.startsWith(q))) return 300;
  // 4. Name contains query
  if (name.includes(q)) return 200;
  // 5. Category starts with query
  if (cat.startsWith(q)) return 150;
  // 6. Founder word starts with query
  if (founder.split(/[\s\-]+/).some((w) => w.startsWith(q))) return 120;
  // 7. Word in tagline starts with query
  const wordsInTagline = v.tagline.toLowerCase().split(/[\s\-.,()]+/);
  if (wordsInTagline.some((w) => w.startsWith(q))) return 100;

  return 0;
}
