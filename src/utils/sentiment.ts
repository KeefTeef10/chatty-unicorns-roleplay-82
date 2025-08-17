import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export function analyzeSentiment(text: string) {
  return sentiment.analyze(text);
}
