export const wordsIntoLevels = (words) => {
  const totalWords = words.length;
  let levelCount = 0;

  // Determine the number of levels
  if (totalWords <= 5) {
    levelCount = totalWords;
  } else {
    levelCount = Math.ceil(totalWords / 50) * 5;
  }

  // Base number of words per level
  const baseWordsPerLevel = Math.floor(totalWords / levelCount);

  // Extra words that need to be added
  const extraWords = totalWords % levelCount;

  // Initialize levels
  const levels = Array.from({ length: levelCount }, () => []);

  let wordIndex = 0;

  // Distribute the base number of words to each level
  for (let i = 0; i < levelCount; i++) {
    levels[i] = words.slice(wordIndex, wordIndex + baseWordsPerLevel);
    wordIndex += baseWordsPerLevel;
  }

  // Distribute the extra words starting from the first level towards the end
  for (let i = 0; i < extraWords; i++) {
    levels[i].push(words[wordIndex]);
    wordIndex++;
  }

  return levels;
};

export default wordsIntoLevels;
