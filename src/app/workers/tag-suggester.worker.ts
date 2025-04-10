/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const text: string = data;

  // Lowercase and extract words
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  if(!words.length) {
    postMessage([]); // No words found, return empty array
  }
  // Basic stop words list
  const stopWords = new Set([
    'the', 'and', 'is', 'a', 'an', 'in', 'of', 'to', 'with', 'that', 'was', 'are',
    'for', 'on', 'as', 'by', 'at', 'from', 'it', 'this', 'be', 'or', 'but', 'not',
    'which', 'has', 'have', 'had', 'will', 'can', 'would', 'should', 'could'
  ]);

  const filtered = words.filter(word =>
    !stopWords.has(word) && word.length > 3 && isNaN(Number(word))
  );

  // Frequency count of remaining words
  const frequencyMap: Record<string, number> = {};
  filtered.forEach(word => {
    frequencyMap[word] = (frequencyMap[word] || 0) + 1;
  });

  // Sort by frequency and pick top 5–10 keywords
  const sorted = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(entry => entry[0]);

  postMessage(sorted);
});
