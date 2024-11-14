import { adultImageNames, kidImageNames } from './imageNames';
import shuffleArray from 'lodash.shuffle';

const public_url = process.env.PUBLIC_URL;

export function getAdultPath(numberOfWords) {
  const path = public_url + '/data/paths/adult/images';
  let words = shuffleArray(adultImageNames);
  if (numberOfWords < words.length) {
    words = words.slice(0, numberOfWords);
  }
  return getWordData(words, path);
}

export function getKidPath(numberOfWords) {
  const path = public_url + '/data/paths/kid/images';
  let words = shuffleArray(kidImageNames);
  if (numberOfWords < words.length) {
    words = words.slice(0, numberOfWords);
  }
  return getWordData(words, path);
}

function getWordData(words, path) {
  return words.map((fileName) => {
    const imagePath = `${path}/${fileName}`;
    const parsed = parseName(fileName);
    return {
      word: parsed.word,
      id: parsed.id,
      imageData: {
        src: imagePath,
        author: parsed.author,
      },
    };
  });
}

export function parseName(fileName) {
  // Remove the file extension
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
  // Split the string by underscores
  const parts = nameWithoutExtension.split('_');
  // Return the components
  return {
    word: parts[0],
    id: parts[1],
    author: parts.slice(2).join(' '),
  };
}
