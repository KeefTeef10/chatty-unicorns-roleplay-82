export type Fallacy =
  | 'ad hominem'
  | 'strawman'
  | 'false dilemma'
  | 'hasty generalization';

const fallacyPatterns: Record<Fallacy, RegExp> = {
  'ad hominem': /\byou\b.*\b(?:idiot|stupid|dumb)\b/i,
  strawman: /\balways\b|\bnever\b/i,
  'false dilemma': /\beither\b.*\bor\b/i,
  'hasty generalization': /\b(all|none|every|never)\b/i,
};

export function detectFallacy(text: string): Fallacy | null {
  for (const [type, pattern] of Object.entries(fallacyPatterns) as [Fallacy, RegExp][]) {
    if (pattern.test(text)) return type;
  }
  return null;
}
