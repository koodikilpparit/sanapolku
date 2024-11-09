import { adultImageNames, kidImageNames } from './imageNames';
import shuffleArray from 'lodash.shuffle';

export function getAdultPath(numberOfWords) {
  const path = 'data/paths/adult/images';
  let words = shuffleArray(adultImageNames);
  if (numberOfWords < words.length) {
    words = words.slice(0, numberOfWords);
  }
  return getPath(words, path);
}

export function getKidPath(numberOfWords) {
  const path = 'data/paths/kid/images';
  let words = shuffleArray(kidImageNames);
  if (numberOfWords < words.length) {
    words = words.slice(0, numberOfWords);
  }
  return getPath(words, path);
}

function getPath(words, path) {
  return words.map((fileName) => {
    const imagePath = `${path}/${fileName}`;
    const parsed = parseName(fileName);
    return {
      ...parsed,
      img: imagePath,
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
    maker: parts.slice(2).join(' '),
  };
}
