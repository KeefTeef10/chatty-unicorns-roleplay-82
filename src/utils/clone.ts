import { analyzeSentiment } from './sentiment';
import { detectFallacy } from './fallacy';

export function generateCloneResponse(message: string): string {
  const sentiment = analyzeSentiment(message);
  const fallacy = detectFallacy(message);

  let response = '';

  if (fallacy) {
    response += `That's a ${fallacy} you just used. `;
  }

  if (sentiment.score > 0) {
    response += "Your optimism blinds you. ";
  } else if (sentiment.score < 0) {
    response += "Why so negative? ";
  }

  response += counterPoint(message);
  return response;
}

function counterPoint(text: string): string {
  if (text.toLowerCase().startsWith('i ')) {
    return 'You ' + text.slice(2);
  }
  return 'Not ' + text;
}
