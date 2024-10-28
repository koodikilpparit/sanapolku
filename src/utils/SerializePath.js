import { getPathByName, getWordsForPath } from '../db/db';

export default async function serializePath(pathName) {
  return await getPathToSerialize(pathName);
}

async function getPathToSerialize(pathName) {
  const path = await getPathByName(pathName);
  if (!path) {
    console.warn('Path not found', pathName);
  }
  const words = await getWordsToSerialize(path.id);
  return { pathName: pathName, words: words };
}

async function getWordsToSerialize(pathId) {
  const words = await getWordsForPath(pathId);

  if (words.length < 1) {
    throw new Error('Path does not have words');
  }
  return words.map((word) => {
    return { word: word.word, img: word.img };
  });
}
